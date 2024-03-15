"""Define the services called by smartknob on HASS entities."""
from enum import Enum
import json

from homeassistant.core import HomeAssistant

from .logger import _LOGGER


class SwitchState:
    """Defines the structure of the SwitchState object."""

    def __init__(self, on: bool) -> None:
        """Initialize the SwitchState object."""
        self.on: bool = on


class LightState:
    """Defines the structure of the LightState object."""

    def __init__(
        self, on: bool, brightness: int, color_temp: int, rgb_color: list[int]
    ) -> None:
        """Initialize the LightState object."""
        self.on: bool = on
        self.brightness: int = brightness
        self.color_temp: int = color_temp
        self.rgb_color: list[int] = rgb_color


class BlindsState:
    """Defines the structure of the BlindsState object."""

    def __init__(self, position: int) -> None:
        """Initialize the BlindsState object."""
        self.position: int = position


class ClimateMode(Enum):
    """Enum for climate modes."""

    off = 0
    heat = 1
    cool = 2
    heat_cool = 3
    auto = 4
    dry = 5
    fan_only = 6


class ClimateState:
    """Defines the structure of the ClimateState object."""

    def __init__(self, mode: int, target_temp: int, current_temp: int) -> None:
        """Initialize the ClimateState object."""
        self.mode: int = mode
        self.target_temp: int = target_temp
        self.current_temp: int = current_temp


class MediaState:
    """Defines the structure of the MediaState object."""

    def __init__(self, state) -> None:
        """Initialize the MediaState object."""
        self.volume = state["volume"]
        self.mute = state["mute"]
        self.playing = state["playing"]
        self.previous = state["previous"]
        self.next = state["next"]


class LockState:
    """Defines the structure of the LockState object."""

    def __init__(self, state) -> None:
        """Initialize the LockState object."""
        self.locked = state["locked"]


class Services:
    """Handles services."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the Service Handler."""
        self.hass = hass

    async def async_toggle_switch(self, entity_id: str, state: SwitchState):
        """Switch the entity on or off."""
        if state.on:
            await self.hass.services.async_call(
                "light", "turn_on", {"entity_id": entity_id}
            )
        elif not state.on:
            await self.hass.services.async_call(
                "light", "turn_off", {"entity_id": entity_id}
            )
        else:
            _LOGGER.error("Not implemented")

    async def async_set_light(self, entity_id: str, state: LightState):
        """Switch the light on or off, and set its brightness and color."""

        # if state.brightness == 255:
        #     await self.hass.services.async_call(
        #         "light", "turn_on", {"entity_id": entity_id}
        #     )
        if state.brightness >= 0 and state.brightness <= 255:
            await self.hass.services.async_call(
                "light",
                "turn_on",
                {
                    "entity_id": entity_id,
                    "brightness": state.brightness,
                },
            )
        # elif state.brightness == 0:
        #     await self.hass.services.async_call(
        #         "light", "turn_off", {"entity_id": entity_id}
        #     )
        else:
            _LOGGER.error("Not implemented")

        if state.rgb_color:
            await self.hass.services.async_call(
                "light",
                "turn_on",
                {
                    "entity_id": entity_id,
                    "brightness": state.brightness,
                    "rgb_color": state.rgb_color,
                },
            )
        else:
            _LOGGER.error("Not implemented")

    async def async_handle_blinds(self, entity_id: str, position: int):
        """Handle blinds entity."""
        await self.hass.services.async_call(
            "cover",
            "set_cover_position",
            {
                "entity_id": entity_id,
                "position": position,
            },
        )

    async def async_handle_climate(self, entity_id: str, state: ClimateState):
        """Handle climate entity."""
        mode = ClimateMode(state.mode)

        await self.hass.services.async_call(
            "climate",
            "set_temperature",
            {
                "entity_id": entity_id,
                "temperature": state.target_temp,
            },
        )
        await self.hass.services.async_call(
            "climate",
            "set_hvac_mode",
            {
                "entity_id": entity_id,
                "hvac_mode": mode.name,
            },
        )


class StateEncoder(json.JSONEncoder):
    """Custom JSON encoder for the state objects."""

    def default(self, o):
        """Encode the state objects."""
        if isinstance(o, SwitchState):
            return {
                "on": o.on,
            }
        if isinstance(o, LightState):
            return {
                "on": o.on,
                "brightness": o.brightness,
                "color_temp": o.color_temp,
                "rgb_color": o.rgb_color,
            }
        if isinstance(o, BlindsState):
            return {
                "position": o.position,
            }
        if isinstance(o, ClimateState):
            return {
                "mode": o.mode,
                "target_temp": o.target_temp,
                "current_temp": o.current_temp,
            }
        return super().default(o)
