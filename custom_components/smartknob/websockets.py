"""Websocket API for SmartKnob integration."""
# import json

import voluptuous as vol

from homeassistant.components.http import HomeAssistantView
from homeassistant.components.http.data_validator import RequestDataValidator
from homeassistant.core import HomeAssistant

from .const import APP_SLUGS, DOMAIN
from .coordinator import SmartknobCoordinator
from .logger import _LOGGER


async def async_register_websockets(hass: HomeAssistant):
    """Register websockets."""
    hass.http.register_view(SmartknobAppSlugsView)
    hass.http.register_view(SmartknobKnobsView)
    hass.http.register_view(SmartknobAppsView)
    hass.http.register_view(SmartknobKnobSyncView)


class SmartknobAppSlugsView(HomeAssistantView):
    """View to send appslugs from "backend" to frontend."""

    url = "/api/smartknob/app_slugs"
    name = "api:smartknob:app_slugs"

    async def get(self, request):
        """Get SmartKnob AppSlugs."""
        # hass: HomeAssistant = request.app["hass"]
        # coordinator = hass.data[DOMAIN]["coordinator"]

        return self.json({"success": True, "app_slugs": APP_SLUGS})


class SmartknobKnobsView(HomeAssistantView):
    """View to handle SmartKnob config requests."""

    url = "/api/smartknob/knobs"
    name = "api:smartknob:knobs"

    async def get(self, request):
        """Get SmartKnob config."""
        hass: HomeAssistant = request.app["hass"]
        coordinator = hass.data[DOMAIN]["coordinator"]
        knobs = coordinator.store.async_get_knobs()
        return self.json(
            {"success": True, "knobs": knobs}
        )  # TODO return actual success or error


class SmartknobKnobSyncView(HomeAssistantView):
    """View to handle SmartKnob config requests."""

    url = "/api/smartknob/knob/sync"
    name = "api:smartknob:knob:sync"

    @RequestDataValidator(
        vol.Schema(
            {
                vol.Required("mac_address"): str,
            }
        )
    )
    async def post(self, request, data: dict):
        """Update config for app."""
        hass: HomeAssistant = request.app["hass"]
        mqtt = hass.data[DOMAIN]["mqtt_handler"]
        if "mac_address" in data:
            await mqtt.async_sync_knob(data.get("mac_address"))


class SmartknobAppsView(HomeAssistantView):
    """View to handle SmartKnob config requests."""

    url = "/api/smartknob/apps"
    name = "api:smartknob:apps"

    @RequestDataValidator(
        vol.Schema(
            {
                vol.Required("mac_address"): str,
                vol.Required("apps"): [
                    {
                        vol.Required("app_id"): str,
                        vol.Required("app_slug"): str,
                        vol.Required("entity_id"): str,
                        vol.Required("friendly_name"): str,
                    }
                ],
            }
        )
    )
    async def post(self, request, data: dict):
        """Update config for app."""
        hass: HomeAssistant = request.app["hass"]
        coordinator: SmartknobCoordinator = hass.data[DOMAIN]["coordinator"]
        if "mac_address" and "apps" in data:
            apps = data.get("apps")

            if len(apps) > 1:
                await coordinator.store.async_update_apps(
                    data.get("mac_address"), apps
                )  # ADD ADD APPS FUNCTION!!!
            await coordinator.store.async_add_app(data.get("mac_address"), apps[0])
            await coordinator.update()

        return self.json({"success": True})  # TODO return actual success or error

    @RequestDataValidator(
        vol.Schema(
            {
                vol.Required("mac_address"): str,
                vol.Required("apps"): [
                    {
                        vol.Required("app_id"): str,
                        vol.Required("app_slug"): str,
                        vol.Required("entity_id"): str,
                        vol.Required("friendly_name"): str,
                    }
                ],
            }
        )
    )
    async def put(self, request, data: dict):
        """Update config for app."""
        hass: HomeAssistant = request.app["hass"]
        coordinator: SmartknobCoordinator = hass.data[DOMAIN]["coordinator"]
        if "mac_address" and "apps" in data:
            apps = data.get("apps")

            await coordinator.store.async_update_apps(data.get("mac_address"), apps)
            await coordinator.update()

        return self.json({"success": True})  # TODO return actual success or error
