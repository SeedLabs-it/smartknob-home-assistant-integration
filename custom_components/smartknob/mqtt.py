"""MQTT handler for SmartKnob."""
import json
import secrets

from homeassistant.components import mqtt
from homeassistant.core import HomeAssistant, State, callback

from .const import DOMAIN, TOPIC_INIT
from .coordinator import SmartknobCoordinator
from .logger import _LOGGER
from .services import (
    BlindsState,
    ClimateMode,
    ClimateState,
    LightState,
    Services,
    StateEncoder,
    SwitchState,
)


class MqttHandler:
    """Handles MQTT messages between HASS and SmartKnob."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the MQTT handler."""
        self.hass = hass
        self.services = Services(hass)
        self._subscribed_topics = []
        self._subscriptions = []

        self.hass.async_add_job(self._async_subscribe_to_init())
        self.hass.async_add_job(self.async_subscribe_to_knobs())

    # @callback
    async def async_entity_state_changed(
        self,
        affected_knobs: list[dict],
        apps,
        old_state: State,
        new_state: State,
    ):
        """Handle entity state changes."""
        for knob in affected_knobs:
            for app in apps:
                random_number = secrets.randbits(32)
                hex_string = hex(random_number)[2:]
                payload_id = hex_string.zfill(8)[-8:]

                state = None

                if app["app_slug"] == "light_switch" or app["app_slug"] == "switch":
                    state = SwitchState(new_state.state == "on")

                elif app["app_slug"] == "light_dimmer":
                    state = LightState(  #! FOR SOME REASON BRIGHTNESS IS NOT SET ON FIRST STATE AFTER RESTART OF HASS UI CAN SHOW LIGHT ON STATE CAN BE "ON" BUT BRIGHTNESS IS NOT SET SO FIRST STATE SENT TO KNOB IS OFF BRIGHTNESS 0
                        new_state.state == "on" or False,
                        new_state.attributes.get("brightness") or 0,
                        new_state.attributes.get("color_temp") or None,
                        new_state.attributes.get("rgb_color") or None,
                    )
                elif app["app_slug"] == "blinds":
                    state = BlindsState(
                        new_state.attributes.get("current_position") or 0
                    )
                elif app["app_slug"] == "climate":
                    if new_state.state in ClimateMode.__members__:
                        mode = ClimateMode[new_state.state].value
                    state = ClimateState(
                        mode or "off",
                        new_state.attributes.get("temperature") or 0,
                        new_state.attributes.get("current_temperature") or 0,
                    )

                if state is not None:
                    await mqtt.async_publish(
                        self.hass,
                        "smartknob/" + knob["mac_address"] + "/from_hass",
                        json.dumps(
                            {
                                "id": payload_id,
                                "type": "state_update",
                                "app_id": app["app_id"],
                                "entity_id": app["entity_id"],
                                "new_state": state,
                            },
                            cls=StateEncoder,
                            separators=(
                                ",",
                                ":",
                            ),  # REMOVES WHITESPACE FOR STRCMP ON KNOB
                        ),
                    )

    async def _async_subscribe_to_init(self):
        """Subscribe to init topic."""
        try:
            _LOGGER.debug("SUBSCRIBING TO INIT")
            await mqtt.async_subscribe(self.hass, TOPIC_INIT, self.async_init_received)

        except Exception as e:
            _LOGGER.error(e)

    async def async_subscribe_to_knobs(self):
        """Subscribe to knob topics."""
        try:
            _LOGGER.debug("SUBSCRIBING TO KNOBS")
            coordinator: SmartknobCoordinator = self.hass.data[DOMAIN]["coordinator"]
            knobs = coordinator.store.knobs
            for mac_address in knobs:
                _LOGGER.debug(mac_address)
                topic = f"smartknob/{mac_address}/from_knob"
                await mqtt.async_subscribe(
                    self.hass, topic, self.async_message_received
                )

        except Exception as e:
            _LOGGER.error(e)

    @callback
    async def async_init_received(self, msg):
        """Handle init message from SmartKnob."""
        try:
            payload = json.loads(msg.payload)

            if "mac_address" in payload:
                mac_address = payload["mac_address"]
                coordinator: SmartknobCoordinator = self.hass.data[DOMAIN][
                    "coordinator"
                ]
                if not coordinator.store.async_get_knob(mac_address):
                    await coordinator.store.async_init_knob(
                        {"mac_address": mac_address, "apps": []}
                    )
                else:
                    _LOGGER.debug("KNOB ALREADY INITIALIZED")
                    knob: dict = coordinator.store.async_get_knob(mac_address)
                    _LOGGER.debug(knob.get("apps"))
                    await self.async_sync_knob(mac_address)

                await self.async_acknowledge(mac_address, payload["id"], "init")

        except ValueError:
            _LOGGER.error("Error decoding JSON payload")
            return

    @callback
    async def async_message_received(self, msg):
        """Handle messages from SmartKnob."""
        try:
            payload = json.loads(msg.payload)

            mac_address = msg.topic.split("/")[1]  # UGLY BAD WAY
            type_ = payload["type"]

            coordinator: SmartknobCoordinator = self.hass.data[DOMAIN]["coordinator"]

            if type_ == "acknowledgement":
                data = payload["data"]
                if data == "sync":
                    knob = coordinator.store.async_get_knob(mac_address)
                    for app in knob.get("apps"):
                        _LOGGER.debug("Sending initial state. to " + app.get("app_id"))
                        state: State = self.hass.states.get(app.get("entity_id"))
                        await self.async_entity_state_changed(
                            [knob],
                            [app],
                            None,
                            state,
                        )

            elif type_ == "state_update":
                app_id = payload["app_id"]
                state = payload["state"]

                # knob = coordinator.store.async_get_knob(mac_address)
                app = await coordinator.store.async_get_app(mac_address, app_id)
                if app is not None:
                    if app["app_slug"] == "light_dimmer":
                        await self.services.async_set_light(
                            app["entity_id"],
                            LightState(
                                state.get("on"),
                                state.get("brightness"),
                                state.get("color_temp"),
                                state.get("rgb_color"),
                            ),
                        )
                    elif (
                        app["app_slug"] == "switch" or app["app_slug"] == "light_switch"
                    ):
                        await self.services.async_toggle_switch(
                            app["entity_id"],
                            SwitchState(
                                state.get("on"),
                            ),
                        )
                    elif app["app_slug"] == "blinds":
                        await self.services.async_handle_blinds(
                            app["entity_id"],
                            state.get("position"),
                        )
                    elif app["app_slug"] == "climate":
                        await self.services.async_handle_climate(
                            app["entity_id"],
                            ClimateState(
                                state.get("mode"),
                                state.get("target_temp"),
                                state.get("current_temp"),
                            ),
                        )
                    else:
                        _LOGGER.error("Not implemented command: ")
                        _LOGGER.debug(app)

                    await self.async_acknowledge(
                        mac_address, payload["id"], "state_update"
                    )

        except ValueError:
            _LOGGER.error("Error decoding JSON payload")
            return

    @callback
    async def async_sync_knob(self, mac_address):
        """Sync a knob."""
        _LOGGER.debug("SYNCING KNOB")
        _LOGGER.debug(mac_address)
        coordinator = self.hass.data[DOMAIN]["coordinator"]
        knob = coordinator.store.async_get_knob(mac_address)
        _LOGGER.debug(knob)
        if knob is not None:
            _LOGGER.debug("KNOB FOUND")
            await mqtt.async_publish(
                self.hass,
                "smartknob/" + knob["mac_address"] + "/from_hass",
                json.dumps({"type": "sync", "apps": knob["apps"]}),
            )
        else:
            _LOGGER.debug("KNOB NOT FOUND")

    @callback
    async def async_acknowledge(
        self, mac_address, acknowledgement_id, acknowledgement_type
    ):
        """Send an acknowledgement to the knob."""
        await mqtt.async_publish(
            self.hass,
            "smartknob/" + mac_address + "/from_hass",
            json.dumps(
                {
                    "type": "acknowledgement",
                    "acknowledge_id": acknowledgement_id,
                    "acknowledge_type": acknowledgement_type,
                }
            ),
        )
