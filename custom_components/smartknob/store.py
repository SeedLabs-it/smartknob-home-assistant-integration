"""Store for SmartKnob integration."""

from collections import OrderedDict
from collections.abc import MutableMapping
from typing import cast
from homeassistant.helpers import device_registry as dr

import attr

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.event import async_track_device_registry_updated_event
from homeassistant.helpers.storage import Store
from homeassistant.loader import bind_hass

from .const import DATA_REGISTRY, DOMAIN, SAVE_DELAY, STORAGE_KEY, STORE_MAJOR_VERSION, STORE_MINOR_VERSION, MANUFACTURER
from .logger import _LOGGER


@attr.s(slots=True, frozen=True)
class AppEntry:
    """App storage entry."""

    app_id = attr.ib(type=str, default=None)
    app_slug = attr.ib(type=str, default=None)
    entity_id = attr.ib(type=str, default=None)
    friendly_name = attr.ib(type=str, default=None)


@attr.s(slots=True, frozen=True)
class KnobSettings:
    """SmartKnob settings storage entry."""

    dim_screen = attr.ib(type=bool, default=False)
    screen_min_brightness = attr.ib(type=int, default=10)


@attr.s(slots=True, frozen=False)
class SmartknobConfig:
    """SmartKnob device configuration, storage entry."""

    mac_address = attr.ib(type=str, default=None)
    device_id = attr.ib(type=str, default=None)
    name = attr.ib(type=str, default="")
    settings = attr.ib(type=KnobSettings, default=KnobSettings())
    apps = attr.ib(type=list[AppEntry], default=None)


class MigratableStore(Store):
    async def _async_migrate_func(self, old_major_version: int, old_minor_version: int, old_data: dict):
        if old_major_version <= 1:
            device_registry = dr.async_get(self.hass)
            mqtt = self.hass.data[DOMAIN]["mqtt_handler"]
            for knob in old_data["knobs"]:

                device = device_registry.async_get_or_create(
                    config_entry_id=self.hass.data[DOMAIN]["entry"].entry_id,
                    identifiers={(DOMAIN, knob["mac_address"])},
                    name=knob["mac_address"] or "GET FROM KNOB",
                    model="SmartKnob Devkit v0.1", #HMMM NORMALLY GOTTEN FROM KNOB
                    sw_version="0.2.0", #HMMM NORMALLY GOTTEN FROM KNOB
                    manufacturer=MANUFACTURER,
                )
                async_track_device_registry_updated_event(
                  self.hass,
                  [device.id],
                  mqtt.async_device_change,
                )
                knob["device_id"] = device.id
                knob["name"] = knob["mac_address"] or "GET FROM KNOB"
                knob["settings"] = {"dim_screen": False, "screen_min_brightness": 10}

        return old_data

class SmartknobStorage:
    """Class to hold SmartKnob storage."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the SmartKnob storage."""
        self.hass = hass
        self.config: MutableMapping[
            str, str
        ] = {}  #! ADD SMARTKNOB DEVICE SPECIFIC CONFIG HERE
        self.knobs: MutableMapping[str, SmartknobConfig] = {}
        self._store = MigratableStore(hass, STORE_MAJOR_VERSION, STORAGE_KEY, minor_version=STORE_MINOR_VERSION)

    async def async_load(self) -> None:
        """Load the registry of SmartKnob."""
        data = await self._store.async_load()
        knobs = {}

        _LOGGER.debug("Loading SmartKnob data")
        _LOGGER.error(data)

        if data is None:
            return

        if "knobs" in data:
            for knob in data["knobs"]:
                apps = [
                    AppEntry(
                        app_id=app["app_id"],
                        app_slug=app["app_slug"],
                        entity_id=app["entity_id"],
                        friendly_name=app["friendly_name"],
                    )
                    for (app) in knob["apps"]
                ]
                knobs[knob["mac_address"]] = SmartknobConfig(
                    mac_address=knob["mac_address"],
                    device_id=knob["device_id"],
                    name=knob["name"],
                    settings=knob["settings"],
                    apps=apps,
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
        """Save the registry of SmartKnob."""
        await self._store.async_save(self._data_to_save())

    @callback
    def _data_to_save(self) -> dict:
        store_data = {"knobs": [attr.asdict(entry) for entry in self.knobs.values()]}

        # EXAMPLE OF ADDING MORE DATA TO STORE
        # store_data["apps"] = [attr.asdict(entry) for entry in self.areas.values()]

        return store_data

    async def async_delete(self):
        """Delete all registry data."""
        _LOGGER.warning("Removing SmartKnob configuration data!")
        await self._store.async_remove()
        self.config = {}
        self.knobs = {}

    @callback
    def async_get_knob(self, mac_address: str):
        """Get smartknob by mac_address."""
        try:
            res = self.knobs.get(mac_address)
        except:
            res = None

        return attr.asdict(res) if res else None

    @callback
    def async_get_knobs(self):
        """Get all smartknobs."""
        return [attr.asdict(val) for val in self.knobs.values()]

    @callback
    async def async_init_knob(self, data: dict) -> SmartknobConfig:
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

        mqtt = self.hass.data[DOMAIN]["mqtt_handler"]
        coordinator = self.hass.data[DOMAIN]["coordinator"]
        coordinator.entry.async_create_task(self.hass, mqtt.async_subscribe_to_knobs())
        coordinator.entry.async_create_task(
            self.hass, mqtt.async_sync_knob(mac_address)
        )
        return attr.asdict(new_app)

    @callback
    async def async_update_apps(self, mac_address, new_apps):
        """Update existing config."""
        new = []

        for app in new_apps:
            new_app = AppEntry(**app)
            new.append(new_app)

        self.knobs[mac_address].apps = new
        self.async_schedule_save()

        mqtt = self.hass.data[DOMAIN]["mqtt_handler"]
        coordinator = self.hass.data[DOMAIN]["coordinator"]
        coordinator.entry.async_create_task(self.hass, mqtt.async_subscribe_to_knobs())
        coordinator.entry.async_create_task(
            self.hass, mqtt.async_sync_knob(mac_address)
        )

        return list(self.knobs.values())  #! MIGHT BE INCORRECT

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
    def async_update_knob(self, knob: SmartknobConfig) -> SmartknobConfig:
        """Update existing config."""
        new_knob = SmartknobConfig(**knob)
        if new_knob.mac_address not in self.knobs:
            return None
        if new_knob.device_id is not None:
            self.knobs[new_knob.mac_address].device_id = new_knob.device_id
        if new_knob.name is not None:
            self.knobs[new_knob.mac_address].name = new_knob.name
        if new_knob.settings is not None:
            self.knobs[new_knob.mac_address].settings = new_knob.settings
        self.async_schedule_save()
        return attr.asdict(new_knob)

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
