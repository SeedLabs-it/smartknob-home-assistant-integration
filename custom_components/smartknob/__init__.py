"""The Smartknob integration."""
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.event import async_track_state_change
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator

from .const import DOMAIN
from .logger import _LOGGER
from .mqtt import MqttHandler
from .panel import async_register_panel, async_unregister_panel
from .store import SmartknobStorage, async_get_registry
from .websockets import async_register_websockets


async def async_setup(hass: HomeAssistant, config):
    """Set up the Smartknob component."""
    _LOGGER.debug("async_setup")

    # # Define a callback function to call when a state change occurs
    # def state_change_callback(entity_id, old_state, new_state):
    #     update_knob_on_entity_change(knobs, entity_id, new_state.state)

    # # Subscribe to state changes of the entities
    # async_track_state_change(hass, entity_ids, state_change_callback)

    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry):
    """Set up Smartknob from a config entry."""
    hass.data.setdefault(DOMAIN, {})
    session = async_get_clientsession(hass)

    store = await async_get_registry(hass)
    coordinator = SmartknobCoordinator(hass, session, entry, store)

    hass.data[DOMAIN] = {"coordinator": coordinator, "apps": []}

    if entry.unique_id is None:
        hass.config_entries.async_update_entry(entry, unique_id=coordinator.id, data={})

    await async_register_panel(hass)

    # Register Websockets
    await async_register_websockets(hass)

    # Load Config Data
    await coordinator.store.async_load()

    # Subsribe to entity state changes of all entities used in knobs
    knobs = coordinator.store.async_get_knobs()
    entity_ids = [(app["entity_id"]) for knob in knobs.values() for app in knob["apps"]]

    async def async_state_change_callback(entity_id, old_state, new_state):
        """Handle entity state changes."""
        affected_knobs = []
        app_id = []
        for knob in knobs.values():
            for app in knob["apps"]:
                if app["entity_id"] == entity_id:
                    affected_knobs.append(knob)
                    app_id.append(
                        app["app_id"]
                    )  # THIS DOESNT REALLY WORK WILL WORK FOR NOW

        await coordinator.mqtt_handler.async_entity_state_changed(
            affected_knobs, app_id, old_state, new_state
        )

    async_track_state_change(hass, entity_ids, async_state_change_callback)

    return True


async def async_remove_entry(hass: HomeAssistant | None, entry):
    """Handle removal of an entry."""
    async_unregister_panel(hass)
    coordinator = hass.data[DOMAIN]["coordinator"]
    await coordinator.async_delete_config()
    del hass.data[DOMAIN]


class SmartknobCoordinator(DataUpdateCoordinator):
    """Smartknob DataUpdateCoordinator."""

    def __init__(
        self, hass: HomeAssistant | None, session, entry, store: SmartknobStorage
    ) -> None:
        """Initialize the coordinator."""
        self.id = entry.entry_id
        self.hass = hass
        self.entry = entry
        self.store = store
        self.mqtt_handler = MqttHandler(self.hass)

        # self.hass.data[DOMAIN]["mqtt_handler"] = MqttHandler(self.hass)

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
