import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import '../components/SkReorderableList/SkReorderableList.ts';
// import { selectSelector } from '../const';

import install from '@twind/with-web-components';
import config from '../../twind.config.ts';
import { HomeAssistant, KnobData, KnobSettings } from '../types.ts';
import { asyncSaveKnobSettings } from '../data/websockets.ts';

const withTwind = install(config);

@customElement('config-view')
export class Config extends withTwind(LitElement) {
  @property({ type: Object }) hass!: HomeAssistant;
  @property({ type: Object }) knob!: KnobData;

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
              ?checked="${this._updated_knob_settings?.beacon_enabled}"
              @change="${(e: Event) => {
                this._updated_knob_settings!.beacon_enabled = (
                  e.target as HTMLInputElement
                ).checked;
              }}"
            />
            <p>enable beacon</p>
          </li>
          <li>
            <input
              type="text"
              .value="${this._updated_knob_settings?.beacon_color
                .toString(16)
                .padStart(6, '0')}"
              @change="${(e: Event) => {
                let hex = (e.target as HTMLInputElement).value;
                this._updated_knob_settings!.beacon_color = parseInt(hex, 16);
              }}"
            />
            <p>beacon color</p>
          </li>
          <li>
            <input
              type="checkbox"
              ?checked="${this._updated_knob_settings?.dim_screen}"
              @change="${(e: Event) => {
                this._updated_knob_settings!.dim_screen = (
                  e.target as HTMLInputElement
                ).checked;
              }}"
            />
            <p>dim screen</p>
          </li>
          <li>
            <input
              type="number"
              .value="${this._updated_knob_settings?.screen_timeout}"
              @change="${(e: Event) => {
                this._updated_knob_settings!.screen_timeout = parseInt(
                  (e.target as HTMLInputElement).value,
                );
              }}"
            />
            <p>screen timeout</p>
          </li>
          <li>
            <input
              type="number"
              .value="${this._updated_knob_settings?.screen_min_brightness}"
              @change="${(e: Event) => {
                this._updated_knob_settings!.screen_min_brightness = parseInt(
                  (e.target as HTMLInputElement).value,
                );
              }}"
            />
            <p>screen min brightness</p>
          </li>
          <li>
            <input
              type="text"
              .value="${this._updated_knob_settings?.led_color
                .toString(16)
                .padStart(6, '0')}"
              @change="${(e: Event) => {
                let hex = (e.target as HTMLInputElement).value;
                this._updated_knob_settings!.led_color = parseInt(hex, 16);
              }}"
            />
            <p>color code for led ring</p>
          </li>
        </ul>
        <button @click=${this.save}>Save</button>
        <button>Sync</button>
      </div>
    `;
  }

  save() {
    console.log('save');

    asyncSaveKnobSettings(
      this.hass,
      this.knob.mac_address,
      this._updated_knob_settings!,
    );
  }
}
