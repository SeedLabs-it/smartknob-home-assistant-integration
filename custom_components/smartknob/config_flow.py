"""Config flow for Smartknob integration."""

import logging
import secrets

from homeassistant import config_entries

from .const import DOMAIN, NAME

_LOGGER = logging.getLogger(__name__)


# TODO tell user to go to Smartknob panel after submit
class SmartknobConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Smartknob."""

    VERSION = 1
    MINOR_VERSION = 1

    async def async_step_user(self, user_input=None):
        """Handle conflow flow initiated by user (run on adding integration to HASS)."""
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")

        _id = secrets.token_hex(6)

        await self.async_set_unique_id(_id)
        self._abort_if_unique_id_configured(updates=user_input)

        return self.async_create_entry(title=NAME, data={})
