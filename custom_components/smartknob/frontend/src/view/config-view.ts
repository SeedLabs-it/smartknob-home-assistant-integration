import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import '../components/SkReorderableList/SkReorderableList.ts';
// import { selectSelector } from '../const';

import install from '@twind/with-web-components';
import config from '../../twind.config.ts';
import { HomeAssistant, KnobData, KnobSettings } from '../types.ts';
import { asyncSaveKnobSettings } from '../data/websockets.ts';
import { parse } from '@twind/core';

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

  static styles = css`
    li {
      display: flex;
      align-items: flex-start;
      flex-direction: column;
    }
  `;

  render() {
    return html`
      <div>
        <div class="flex gap-8">
          <div class="gap-4 flex flex-col">
            <h2>Screen dimming</h2>
            <li>
              <label class="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  class="sr-only peer"
                  ?checked="${this._updated_knob_settings?.dim_screen}"
                  @change="${(e: Event) => {
                    this._updated_knob_settings!.dim_screen = (
                      e.target as HTMLInputElement
                    ).checked;
                  }}"
                />
                <div
                  class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                ></div>
              </label>
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
                max="14400"
                min="0"
              />
            </li>
            <li>
              <input
                type="range"
                .value="${
                  (this._updated_knob_settings?.screen_min_brightness ?? 6554) /
                  (65535 / 100)
                }"
                @change="${(e: Event) => {
                  this._updated_knob_settings!.screen_min_brightness =
                    parseInt((e.target as HTMLInputElement).value) *
                    (65535 / 100);
                }}"
                max="100"
                min="0"
              />
            </li>
          </div>
          <div class="gap-4 flex flex-col">
            <h2>Led ring</h2>
            <input
                  type="checkbox"
                  class="sr-only peer"
                  ?checked="${this._updated_knob_settings?.dim_screen}"
                  @change="${(e: Event) => {
                    this._updated_knob_settings!.dim_screen = (
                      e.target as HTMLInputElement
                    ).checked;
                  }}"
                  disabled
                />
                <div
                  class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-400 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-gray-500 after:border-gray-800 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-900"
                ></div>
              </label>
            <li>
              <input
                type="color"
                .value="#${this._updated_knob_settings?.led_color
                  .toString(16)
                  .padStart(6, '0')}"
                @change="${(e: Event) => {
                  let hex = (e.target as HTMLInputElement).value;

                  this._updated_knob_settings!.led_color = parseInt(
                    hex.replace('#', ''),
                    16,
                  );
                }}"
              />
            </li>
          </div>
          <div class="gap-4 flex flex-col">
            <h2>Beacon</h2>
            <li>
              <label class="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  class="sr-only peer"
                  ?checked="${this._updated_knob_settings?.beacon_enabled}"
                  @change="${(e: Event) => {
                    this._updated_knob_settings!.beacon_enabled = (
                      e.target as HTMLInputElement
                    ).checked;
                  }}"
                />
                <div
                  class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                ></div>
              </label>
            </li>
            <li>
              <input
                type="color"
                .value="#${this._updated_knob_settings?.beacon_color
                  .toString(16)
                  .padStart(6, '0')}"
                @change="${(e: Event) => {
                  let hex = (e.target as HTMLInputElement).value;

                  this._updated_knob_settings!.beacon_color = parseInt(
                    hex.replace('#', ''),
                    16,
                  );
                }}"
              />
            </li>
          </div>
        </div>
        <button @click=${this.save}>Save</button>
        <button>Sync</button>
      </div>
    `;
  }

  save() {
    asyncSaveKnobSettings(
      this.hass,
      this.knob.mac_address,
      this._updated_knob_settings!,
    );
  }
}
