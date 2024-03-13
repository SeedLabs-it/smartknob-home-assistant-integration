00:00:00:00:00:00 is to be replaced by the MAC address of a knob.

## smartknob/init
#### Sent from knob after configuration of knob is complete. And knob is ready for HASS.

```json
{
  "mac_address": "00:00:00:00:00:00"
}
```

`MAC_ADDRESS`:
- Mac address of knob to be initialized.

<br>
<br>
<br>

## smartknob/00:00:00:00:00:00/from_hass
#### Sent by HASS to knob to sync apps.

```json
{
  "type": "sync",
  "apps": [
     {
      "app_slug": "climate",
      "entity_id": "climate.study",
      "friendly_name": "Study",
      "features" : {
        "ac": false,
        "heater": true,
        "fan": true
      }
    }
    {
      "app_slug": "light_switch",
      "entity_id": "light.switch_1",
      "friendly_name": "Light 1"
      "type": 0
    },
    {
      "app_slug": "light_dimmer",
      "entity_id": "light.dimmer_1",
      "friendly_name": "Light Dimmer 1"
      "features": [
        0,
        1,
        ...
      ]
    },

    ...
  ]
}
```

<br>

### PROPS ON ALL APPS:
`app_slug`:
- TYPE: `str`

`entity_id`:
- TYPE: `str`

`friendly_name`:
- TYPE: `str`
---

<br>

<details>
<summary>Climate App</summary>

```json
{
  ...
  "features": [
    0,
    1,
    ...
  ]
}
```

`features`:
  - TYPE: [`Array[ClimateMode]`](#climatemode)


</details>

<details>
<summary>Switch App</summary>

```json
{
  ...
  "type": 0
}
```

`type`:
- TYPE: `int` ; 0 for switch, 1 for dimmer, 2 for climate

</details>

<details>
<summary>Light Dimmer App</summary>

```json
{
  ...
  "features": [
    0,
    1,
    ...
  ]
}
```

`features`:
- TYPE: [`Array[DimmerFeatures]`](#dimmerfeatures)

</details>





<br>
<br>
<br>

## smartknob/00:00:00:00:00:00/from_knob

### Example payloads

<details>
<summary>Climate Example</summary>

```json
{
  "app_id": "climate-climate.study",
  "state": {
    "mode": 0,
    "target_temp": 25
  }
}
```

`app_id`:

- TYPE: `str`

`state.mode`:

- TYPE: [`ClimateMode`](#climatemode)

`state.target_temp`:

- TYPE: `int`

<br>
</details>

<details>
<summary>Switch Example</summary>

```json
{
  "app_id": "light_switch-light.switch_1",
  "state": {
    "on": true
  }
}
```

`app_id`:

- TYPE: `str`

`state.on`:

- TYPE: `boolean`

<br>
</details>
<details>
<summary>Light Dimmer Example</summary>

```json
{
  "app_id": "light_dimmer-light.dimmer_",
  "state": {
    "brightness": "200",
    "color_temp": "200",
    "rgb_color": [255, 255, 255]
  }
}
```

`app_id`:

- TYPE: `str`

<br>

`state.brightness`:

- TYPE: `int`
- VALID INPUT: `0-255`

<br>

`state.color_temp`:

- TYPE: `int`
- VALID INPUT: `0-255`

<br>

`state.rgb_color`:

- TYPE: `Array[int]`
- VALID INPUT: `[0-255, 0-255, 0-255]`

<br>
</details>



<br>
<br>
<br>



## TYPE DEFS
#### ClimateMode
```python
class ClimateMode(Enum):
    off = 0
    heat = 1
    cool = 2
    heat_cool = 3
    auto = 4
    dry = 5
    fan_only = 6
```

#### SwitchType
```python
class LightType(Enum):
    switch = 0
    light = 1
```

#### DimmerFeatures
```python
class DimmerFeatures(Enum):
    brightness = 0
    color_temp = 1
    rgb_color = 2
```