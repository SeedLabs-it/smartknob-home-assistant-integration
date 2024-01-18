"""Define the services called by smartknob on HASS entities."""
from homeassistant.core import HomeAssistant

from .logger import _LOGGER


class SwitchState:
    """Defines the structure of the SwitchState object."""

    def __init__(self, state) -> None:
        """Initialize the SwitchState object."""
        self.on: bool = state["on"]


class LightState:
    """Defines the structure of the LightState object."""

    def __init__(self, state) -> None:
        """Initialize the LightState object."""
        self.brightness: int = state["brightness"]
        self.color_temp: int = state["color_temp"]
        self.rgb_color: list[int] = state["rgb_color"]


class BlindsState:
    """Defines the structure of the BlindsState object."""

    def __init__(self, state) -> None:
        """Initialize the BlindsState object."""
        self.position: int = state["position"]


class ClimateState:
    """Defines the structure of the ClimateState object."""

    def __init__(self, state) -> None:
        """Initialize the ClimateState object."""
        self.temperature: float = state["temperature"]
        self.humidity: int = state["humidity"]


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
