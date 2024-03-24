"""Coordinator."""
from homeassistant.core import HomeAssistant, State
from homeassistant.helpers.event import async_track_state_change
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator

from .const import DOMAIN
from .logger import _LOGGER
from .store import SmartknobStorage


class SmartknobCoordinator(DataUpdateCoordinator):
    """SmartKnob DataUpdateCoordinator."""

    remove_state_callback = None

    def __init__(
        self, hass: HomeAssistant | None, session, entry, store: SmartknobStorage
    ) -> None:
        """Initialize the coordinator."""
        self.id = entry.entry_id
        self.hass = hass
        self.entry = entry
        self.store = store
        # self.mqtt_handler = MqttHandler(self.hass) #ERROR CAUSES CIRCULAR IMPORT

        super().__init__(hass, _LOGGER, name=DOMAIN)

    async def async_update_app_config(self, data: dict = None):
        """Update config for app."""

        if self.store.async_get_app(data.get("app_id")):
            self.store.async_update_app(data)
            return

        self.store.async_create_app(data)

    async def async_unload(self):
        """Unload coordinator."""
        del self.hass.data[DOMAIN]["apps"]

    async def async_delete_config(self):
        """Delete config."""
        await self.store.async_delete()

    async def update(self):
        """Update state tracker."""
        if self.remove_state_callback:
            self.remove_state_callback()
            self.remove_state_callback = None

        mqtt = self.hass.data[DOMAIN]["mqtt_handler"]

        knobs = self.store.async_get_knobs()
        entity_ids = []
        for knob in knobs:
            for app in knob["apps"]:
                if app["entity_id"] not in entity_ids:
                    entity_ids.append(app["entity_id"])

        async def async_state_change_callback(
            entity_id, old_state: State, new_state: State
        ):
            """Handle entity state changes."""
            affected_knobs = []
            apps = []

            if old_state is None:
                return

            if new_state.context.user_id is None:
                return

            for knob in knobs:
                for app in knob["apps"]:
                    if app["entity_id"] == entity_id:
                        if knob not in affected_knobs:
                            affected_knobs.append(knob)
                        apps.append(app)  # THIS DOESNT REALLY WORK WILL WORK FOR NOW

            await mqtt.async_entity_state_changed(
                affected_knobs, apps, old_state, new_state
            )

        self.remove_state_callback = async_track_state_change(
            self.hass, entity_ids, async_state_change_callback
        )
