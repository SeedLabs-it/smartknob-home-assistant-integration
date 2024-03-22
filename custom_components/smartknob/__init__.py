"""The SmartKnob integration."""
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, State
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.event import async_track_state_change

from .const import DOMAIN
from .coordinator import SmartknobCoordinator
from .logger import _LOGGER
from .mqtt import MqttHandler
from .panel import async_register_panel, async_unregister_panel
from .store import async_get_registry
from .websockets import async_register_websockets


async def async_setup(hass: HomeAssistant, config):
    """Set up the SmartKnob component."""
    _LOGGER.debug("SmartKnob - Setup")
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry):
    """Set up SmartKnob from a config entry."""
    _LOGGER.debug("SmartKnob - Setup Entry")
    _LOGGER.debug("SmartKnob - Entry: %s", entry)
    hass.data.setdefault(DOMAIN, {})
    session = async_get_clientsession(hass)

    store = await async_get_registry(hass)
    coordinator = SmartknobCoordinator(hass, session, entry, store)
    mqtt_handler = MqttHandler(hass)

    hass.data[DOMAIN] = {
        "coordinator": coordinator,
        "apps": [],
        "mqtt_handler": mqtt_handler,
    }

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

    async def async_state_change_callback(
        entity_id, old_state: State, new_state: State
    ):
        """Handle entity state changes."""
        affected_knobs = []
        apps = []

        if new_state.context.user_id is None:
            return

        for knob in knobs.values():
            for app in knob["apps"]:
                if app["entity_id"] == entity_id:
                    affected_knobs.append(knob)
                    apps.append(app)  # THIS DOESNT REALLY WORK WILL WORK FOR NOW

        await mqtt_handler.async_entity_state_changed(
            affected_knobs, apps, old_state, new_state
        )

    async_track_state_change(hass, entity_ids, async_state_change_callback)

    return True


async def async_remove_entry(hass: HomeAssistant | None, entry):
    """Handle removal of an entry."""
    async_unregister_panel(hass)
    coordinator = hass.data[DOMAIN]["coordinator"]
    await coordinator.async_delete_config()
    del hass.data[DOMAIN]
