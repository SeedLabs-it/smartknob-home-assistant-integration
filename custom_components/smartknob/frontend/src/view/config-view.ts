import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import '../components/SkReorderableList/SkReorderableList.ts';
// import { selectSelector } from '../const';

import install from '@twind/with-web-components';
import config from '../../twind.config.ts';
import { HomeAssistant, KnobData, KnobSettings } from '../types.ts';
// import { asyncSaveKnobSettings } from '../data/websockets.ts';

const withTwind = install(config);

@customElement('config-view')
export class Config extends withTwind(LitElement) {
  @property({ type: Object }) hass!: HomeAssistant;
  @property({ type: Object }) knob!: KnobData;
  // @property({ type: Object }) knob_settings!: KnobSettings;

  @state() private _updated_knob_settings: KnobSettings | undefined = undefined;

  connectedCallback(): void {
    super.connectedCallback();
    console.log(this._updated_knob_settings);

    this._updated_knob_settings = this.knob.settings;
  }
  render() {
    return html`
      <div>
        <h1>Config</h1>
        <p>Configure your Smartknob here.</p>
        <ul>
          <li>
            <input
              type="checkbox"
              .checked="${this._updated_knob_settings?.beacon_enabled}"
            />
            <p>enable beacon</p>
          </li>
          <li>
            <input
              type="text"
              .value="${this._updated_knob_settings?.beacon_color}"
            />
            <p>beacon color</p>
          </li>
          <li>
            <input
              type="checkbox"
              .checked="${this._updated_knob_settings?.dim_screen}"
            />
            <p>dim screen</p>
          </li>
          <li>
            <input
              type="number"
              .value="${this._updated_knob_settings?.screen_timeout}"
            />
            <p>screen timeout</p>
          </li>
          <li>
            <input
              type="number"
              .value="${this._updated_knob_settings?.screen_min_brightness}"
            />
            <p>screen min brightness</p>
          </li>

          <li>
            <input
              type="text"
              .value="${this._updated_knob_settings?.led_color}"
            />
            <p>color code for led ring</p>
          </li>
        </ul>
        <button>Save</button>
      </div>
    `;
  }

  // sync() {
  //   console.log('sync');

  //   asyncSaveKnobSettings(
  //     this.hass,
  //     this.knob.mac_address,
  //     this._updated_knob_settings,
  //   );
  // }
}
