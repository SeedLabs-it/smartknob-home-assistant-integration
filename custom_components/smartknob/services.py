"""Define the services called by smartknob on HASS entities."""
from homeassistant.core import HomeAssistant

from .logger import _LOGGER


class SwitchState:
    """Defines the structure of the SwitchState object."""

    def __init__(self, state) -> None:
        """Initialize the SwitchState object."""
        self.on = state["on"]


class LightState:
    """Defines the structure of the LightState object."""

    def __init__(self, state) -> None:
        """Initialize the LightState object."""
        self.brightness = state["brightness"]
        self.color_temp = state["color_temp"]
        self.rgb_color = state["rgb_color"]


class Services:
    """Handles services."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the Service Handler."""
        self.hass = hass

    async def async_toggle_switch(self, entity_id: str, state: SwitchState):
        """Switch the entity on or off."""
        if state.on:
            await self.hass.services.async_call(
                "switch", "turn_on", {"entity_id": entity_id}
            )
        elif not state.on:
            await self.hass.services.async_call(
                "switch", "turn_off", {"entity_id": entity_id}
            )
        else:
            _LOGGER.error("Not implemented")

    async def async_set_light(self, entity_id: str, state: LightState):
        """Switch the light on or off, and set its brightness and color."""

        if state.brightness == 255:
            await self.hass.services.async_call(
                "light", "turn_on", {"entity_id": entity_id}
            )
        elif state.brightness > 0 and state.brightness < 255:
            await self.hass.services.async_call(
                "light",
                "turn_on",
                {
                    "entity_id": entity_id,
                    "brightness": state.brightness,
                },
            )
        elif state.brightness == 0:
            await self.hass.services.async_call(
                "light", "turn_off", {"entity_id": entity_id}
            )
        else:
            _LOGGER.error("Not implemented")
