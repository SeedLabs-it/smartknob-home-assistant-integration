from .store import SmartknobStorage
from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator
from .logger import _LOGGER
from .const import DOMAIN


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
