"""Store for Smartknob integration."""

from collections import OrderedDict
from collections.abc import MutableMapping
from typing import cast

import attr

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.storage import Store
from homeassistant.loader import bind_hass

from .const import DATA_REGISTRY, SAVE_DELAY, STORAGE_KEY
from .logger import _LOGGER


@attr.s(slots=True, frozen=True)
class AppEntry:
    """App storage entry."""

    app_id = attr.ib(type=str, default=None)
    app_slug_id = attr.ib(type=str, default=None)
    entity_id = attr.ib(type=str, default=None)
    friendly_name = attr.ib(type=str, default=None)


@attr.s(slots=True, frozen=True)
class SmartknobConfig:
    """Smartknob device configuration, storage entry."""

    mac_address = attr.ib(type=str, default=None)
    apps = attr.ib(type=list[AppEntry], default=None)


class SmartknobStorage:
    """Class to hold Smartknob storage."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the Smartknob storage."""
        self.hass = hass
        self.config: MutableMapping[
            str, str
        ] = {}  #! ADD SMARTKNOB DEVICE SPECIFIC CONFIG HERE
        self.knobs: MutableMapping[str, SmartknobConfig] = {}
        self._store = Store(hass, 1, STORAGE_KEY)

    async def async_load(self) -> None:
        """Load the registry of Smartknob."""
        data = await self._store.async_load()
        knobs: "OrderedDict[str, AppEntry]" = OrderedDict()

        if data is None:
            return

        if "knobs" in data:
            for knob in data["knobs"]:
                apps = [
                    AppEntry(
                        app_id=app["app_id"],
                        app_slug_id=app["app_slug_id"],
                        entity_id=app["entity_id"],
                        friendly_name=app["friendly_name"],
                    )
                    for (app) in knob["apps"]
                ]
                knobs[knob["mac_address"]] = SmartknobConfig(
                    mac_address=knob["mac_address"], apps=apps
                )

        self.knobs = knobs

        # TODO ADD CHECK IF NO APPS

        # if not apps:
        #     await self.async_factory_default()

    @callback
    def async_schedule_save(self) -> None:
        """Schedule saving the registry of alarmo."""
        self._store.async_delay_save(self._data_to_save, SAVE_DELAY)

    async def async_save(self) -> None:
        """Save the registry of Smartknob."""
        await self._store.async_save(self._data_to_save())

    @callback
    def _data_to_save(self) -> dict:
        store_data = {"knobs": [attr.asdict(entry) for entry in self.knobs.values()]}

        # EXAMPLE OF ADDING MORE DATA TO STORE
        # store_data["apps"] = [attr.asdict(entry) for entry in self.areas.values()]

        return store_data

    async def async_delete(self):
        """Delete all registry data."""
        _LOGGER.warning("Removing Smartknob configuration data!")
        await self._store.async_remove()
        self.config = {}
        self.knobs = []

    @callback
    def async_get_knob(self, mac_address: str):
        """Get smartknob by mac_address."""
        res = self.knobs.get(mac_address)
        return attr.asdict(res) if res else None

    @callback
    def async_get_knobs(self):
        """Get all smartknobs."""
        res = {}
        for key, val in self.knobs.items():
            res[key] = attr.asdict(val)
        return res

    @callback
    def async_init_knob(self, data: dict) -> SmartknobConfig:
        """Init new smartknob and add to registry."""
        new_knob = SmartknobConfig(**data)
        self.knobs[data["mac_address"]] = new_knob
        self.async_schedule_save()
        return attr.asdict(new_knob)

    @callback
    async def async_add_app(self, mac_address, data: dict) -> AppEntry:
        """Add new app to registry."""
        new_app = AppEntry(**data)
        self.knobs[mac_address].apps.append(new_app)  #! GOOD WAY TO DO THIS?
        self.async_schedule_save()
        return attr.asdict(new_app)

    @callback
    async def async_get_app(self, mac_address, app_id: str) -> AppEntry:
        """Get app from registry."""
        for app in self.knobs[mac_address].apps:
            if app.app_id == app_id:
                return attr.asdict(app)
        return None

    @callback
    def async_delete_knob(self, mac_address: str) -> None:
        """Remove a smartknob from registry."""
        if mac_address in self.knobs:
            del self.knobs[mac_address]
            self.async_schedule_save()
            return True
        return False

    @callback
    def async_update_knobs(self, new_knobs):
        """Update existing config."""
        new = []

        for knob in new_knobs:
            new_knob = SmartknobConfig(**knob)
            new.append(new_knob)

        self.knobs = new
        self.async_schedule_save()

        return attr.asdict(new)


@bind_hass
async def async_get_registry(hass: HomeAssistant) -> SmartknobStorage:
    """Return smartknob storage instance."""
    task = hass.data.get(DATA_REGISTRY)

    if task is None:

        async def _load_reg() -> SmartknobStorage:
            registry = SmartknobStorage(hass)
            await registry.async_load()
            return registry

        task = hass.data[DATA_REGISTRY] = hass.async_create_task(_load_reg())

    return cast(SmartknobStorage, await task)
