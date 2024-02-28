"""Constants."""

DOMAIN = "smartknob"
NAME = "Smartknob"

STORAGE_KEY = f"{DOMAIN}.storage"
DATA_REGISTRY = f"{DOMAIN}_storage"

SAVE_DELAY = 10

TOPIC_INIT = DOMAIN + "/init"

TOPIC_TO_KNOB = "smartknob/to_knob"
TOPIC_TO_HASS = "smartknob/to_hass"


LIGHT_DIMMER = "light_dimmer"
DOMAIN_LIGHT = "light"

LIGHT_SWITCH = "light_switch"
SWITCH = "switch"
DOMAIN_SWITCH = "switch"

CLIMATE = "climate"
DOMAIN_CLIMATE = "climate"

STOPWATCH = "stopwatch"
DOMAIN_STOPWATCH = "stopwatch"


APP_SLUGS = [
    {
        "slug": LIGHT_SWITCH,
        "friendly_name": "Light Switch",
        "domain": DOMAIN_LIGHT,
        "supported_features": 1,
    },
    {
        "slug": LIGHT_DIMMER,
        "friendly_name": "Light Dimmer",
        "domain": DOMAIN_LIGHT,
        "supported_features": 1,
    },
    {
        "slug": SWITCH,
        "friendly_name": "Switch",
        "domain": DOMAIN_SWITCH,
        "supported_features": 1,
    },
    {
        "slug": CLIMATE,
        "friendly_name": "Climate",
        "domain": DOMAIN_CLIMATE,
        "supported_features": 1,
    },
    {
        "slug": STOPWATCH,
        "friendly_name": "Stopwatch",
        "domain": DOMAIN_STOPWATCH,
        "supported_features": 1,
    },
]


CUSTOM_COMPONENTS = "custom_components"
INTEGRATION_FOLDER = DOMAIN

PANEL_TITLE = NAME
PANEL_FOLDER = "frontend/dist"
PANEL_FILENAME = "smartknob-panel.js"
PANEL_URL = "/api/panel_custom/smartknob"
PANEL_NAME = "smartknob-panel"
PANEL_ICON = "mdi:knob"
