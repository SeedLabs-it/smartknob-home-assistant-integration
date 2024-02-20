"""MQTT handler for Smartknob."""
import json

from homeassistant.components import mqtt
from homeassistant.core import HomeAssistant, callback

from .const import DOMAIN, TOPIC_INIT
from .coordinator import SmartknobCoordinator
from .logger import _LOGGER
from .services import ClimateState, LightState, Services, SwitchState


class MqttHandler:
    """Handles MQTT messages between HASS and Smartknob."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the MQTT handler."""
        self.hass = hass
        self.services = Services(hass)
        self._subscribed_topics = []
        self._subscriptions = []

        self.hass.async_add_job(self._async_subscribe_to_init())
        self.hass.async_add_job(self._async_subscribe_to_knobs())

    # @callback
    async def async_entity_state_changed(
        self,
        knobs_needing_update: list[dict],
        app_id,
        old_state,
        new_state,
    ):
        """Handle entity state changes."""
        _LOGGER.debug("STATE CHANGE CALLBACK")
        _LOGGER.debug(knobs_needing_update)
        # for knob in knobs_needing_update:
        #     new_bool_state = new_state.state == "on"
        #     await mqtt.async_publish(
        #         self.hass,
        #         "smartknob/" + knob["mac_address"] + "/from_hass",
        #         json.dumps({"app_id": app_id[0], "new_state": new_bool_state}),
        #     )

    async def _async_subscribe_to_init(self):
        """Subscribe to init topic."""
        try:
            _LOGGER.debug("SUBSCRIBING TO INIT")
            await mqtt.async_subscribe(self.hass, TOPIC_INIT, self.async_init_received)

        except Exception as e:
            _LOGGER.error(e)

    async def _async_subscribe_to_knobs(self):
        """Subscribe to knob topics."""
        try:
            _LOGGER.debug("SUBSCRIBING TO KNOBS")
            coordinator = self.hass.data[DOMAIN]["coordinator"]
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
        """Handle init message from Smartknob."""
        try:
            payload = json.loads(msg.payload)

            if "mac_address" in payload:
                mac_address = payload["mac_address"]
                coordinator: SmartknobCoordinator = self.hass.data[DOMAIN][
                    "coordinator"
                ]
                _LOGGER.debug("INIT RECEIVED")

                if not coordinator.store.async_get_knob(mac_address):
                    await coordinator.store.async_init_knob(
                        {"mac_address": mac_address, "apps": []}
                    )
                else:
                    _LOGGER.debug("KNOB ALREADY INITIALIZED")
                    # TODO: Handle this case

        except ValueError:
            _LOGGER.error("Error decoding JSON payload")
            return

    @callback
    async def async_message_received(self, msg):
        """Handle messages from Smartknob."""
        try:
            payload = json.loads(msg.payload)
            _LOGGER.debug("PAYLOAD")
            _LOGGER.debug(msg.payload)

            mac_address = msg.topic.split("/")[1]  # UGLY BAD WAY
            app_id = payload["app_id"]
            state = payload["state"]
            coordinator = self.hass.data[DOMAIN]["coordinator"]

            # knob = coordinator.store.async_get_knob(mac_address)
            app = await coordinator.store.async_get_app(mac_address, app_id)
            if app is not None:
                if app["app_slug"] == "light_dimmer":
                    await self.services.async_set_light(
                        app["entity_id"],
                        LightState(state),
                    )
                elif app["app_slug"] == "switch" or app["app_slug"] == "light_switch":
                    await self.services.async_toggle_switch(
                        app["entity_id"], SwitchState(state)
                    )
                elif app["app_slug"] == "climate":
                    await self.services.async_handle_climate(
                        app["entity_id"],
                        ClimateState(state),
                    )
                else:
                    _LOGGER.error("Not implemented command")
                # knob.async_update(msg.payload)
                _LOGGER.debug("KNOB GOT")
                _LOGGER.debug(app)

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
