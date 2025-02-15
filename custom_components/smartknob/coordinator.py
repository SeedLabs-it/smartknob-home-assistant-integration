"""Coordinator."""

from homeassistant.core import HomeAssistant, State
from homeassistant.helpers.event import (
    async_track_device_registry_updated_event,
    async_track_state_change_event,
    Event,
    EventStateChangedData,
)
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator

from .const import DOMAIN
from .logger import _LOGGER
from .store import SmartknobStorage


class SmartknobCoordinator(DataUpdateCoordinator):
    """SmartKnob DataUpdateCoordinator."""

    remove_state_callback = None
    remove_device_change_callback = None

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
        _LOGGER.debug("SmartKnob - Update Change Trackers")
        if self.remove_state_callback:
            self.remove_state_callback()
            self.remove_state_callback = None

        if self.remove_device_change_callback:
            self.remove_device_change_callback()
            self.remove_device_change_callback = None

        mqtt = self.hass.data[DOMAIN]["mqtt_handler"]

        knobs = self.store.async_get_knobs()
        entity_ids = []
        device_ids = []
        for knob in knobs:
            device_ids.append(knob["device_id"])
            for app in knob["apps"]:
                if app["entity_id"] not in entity_ids:
                    entity_ids.append(app["entity_id"])

        async def async_state_change_callback(event: Event[EventStateChangedData]):
            """Handle entity state changes."""
            if event is None or event.data["new_state"].context.user_id is None:
                return

            affected_knob_apps = [
                (
                    knob["mac_address"],
                    [
                        app
                        for app in knob["apps"]
                        if app["entity_id"] == event.data["entity_id"]
                    ],
                )
                for knob in knobs
            ]

            await mqtt.async_entity_state_changed(
                affected_knob_apps, event.data["old_state"], event.data["new_state"]
            )

        self.remove_state_callback = async_track_state_change_event(
            self.hass, entity_ids, async_state_change_callback
        )

        self.remove_device_change_callback = async_track_device_registry_updated_event(
            self.hass,
            device_ids,
            mqtt.async_device_change,
        )
