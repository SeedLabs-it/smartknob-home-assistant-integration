import './types';
import { html, css, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import './view/app-form';
import {
  AppListItem,
  AppSlug,
  HomeAssistant,
  KnobData,
  SelectSelector,
  Tab,
} from './types';
import { loadHa } from './load-ha-elements';
import { getAsyncAppSlugs, getAsyncKnobs } from './data/websockets';
import { DOMAIN, TABS } from './const';

import install from '@twind/with-web-components';
import config from '../twind.config';

const withTwind = install(config);

@customElement('smartknob-panel')
// @install(config)
export class SmartknobPanel extends withTwind(LitElement) {
  static styles = css`
    ha-tabs {
      --paper-tabs-selection-bar-color: var(
        --app-header-selection-bar-color,
        var(--app-header-text-color, #fff)
      );
    }
  `;

  @property({ type: Object }) public hass!: HomeAssistant;
  @property({ type: Boolean }) public narrow!: boolean;
  @state() private _knobs: KnobData[] = [];
  @state() private _selectedKnob: KnobData | undefined = undefined;
  @state() private _currentTab: Tab = TABS[0];
  @state() private _appSlugs: AppSlug[] = [];
  @state() private _appList: AppListItem[] = [];

  async connectedCallback() {
    const loadedKnobs = (await getAsyncKnobs(this.hass)).knobs;
    const loadedAppSlugs = (await getAsyncAppSlugs(this.hass)).app_slugs;

    this._selectedKnob = loadedKnobs[0];
    this._knobs = loadedKnobs;
    this._appSlugs = loadedAppSlugs;

    this.setAppList();

    super.connectedCallback();

    this.requestUpdate();
  }

  async firstUpdated() {
    await loadHa();

    this.requestUpdate();
  }

  render() {
    const knobSelector: SelectSelector = {
      select: {
        custom_value: false,
        mode: 'dropdown',
        options: this._knobs.map((knob) => {
          return {
            value: knob.mac_address,
            label: knob.name != '' ? knob.name : knob.mac_address,
          };
        }),
      },
    };

    if (
      !customElements.get('ha-panel-config') ||
      !customElements.get('ha-menu-button')
    )
      return html`
        <h1 style="text-align:center;">
          Waiting for init message from SmartKnob...
        </h1>
      `;

    const entities = [...Object.values(this.hass.states)];

    return html`<div>
      <div>
        <div
          class="px-4 bg-[color:var(--app-header-background-color)] text-[color: var(--text-primary-color);]"
        >
          <div class="flex py-4 items-center gap-2 w-full">
            <ha-menu-button
              .hass=${this.hass}
              .narrow=${this.narrow}
            ></ha-menu-button>
            <h2 class="m-0">SmartKnob</h2>
          </div>
          <div class="flex justify-between">
            <ha-tabs
              scrollable
              attr-for-selected="tab-name"
              .selected=${this._currentTab.tabId}
              @iron-activate=${this.handleTabSelect}
              class="w-full pt-6"
            >
              ${TABS.map(
                (tab) =>
                  html`<paper-tab tab-name=${tab.tabId}
                    >${tab.tabName}</paper-tab
                  >`,
              )}
            </ha-tabs>
            <ha-selector
              .hass=${this.hass}
              .label=${'Select Knob'}
              .value=${this._selectedKnob?.mac_address}
              .selector=${knobSelector}
              @value-changed=${(val) => {
                this._selectedKnob = this._knobs.find(
                  (knob) => knob.mac_address == val.detail.value,
                );
                this.setAppList();
                this.requestUpdate();
              }}
              class="mb-4"
            ></ha-selector>
          </div>
        </div>
        <div class="p-6 max-w-4xl mx-auto">
          <app-form
            .hass=${this.hass}
            .entities=${entities}
            .appSlugs=${this._appSlugs}
            .apps=${this._appList}
            .mac_address=${this._selectedKnob?.mac_address ??
            this._knobs[0].mac_address}
          ></app-form>
        </div>
      </div>
    </div>`;
  }

  handleTabSelect(e: any) {
    const newTab = e.detail.item.getAttribute('tab-name');
    const pathName = window.location.origin;
    if (!pathName.endsWith(newTab)) {
      history.replaceState(null, '', `${pathName}/${DOMAIN}/${newTab}`);

      // window.dispatchEvent(new Event('location-changed'));
      this.requestUpdate();
    } else {
      this.scrollTo(0, 0);
    }
  }

  setAppList() {
    var __appList: AppListItem[] = [];
    for (const app of this._selectedKnob?.apps ?? []) {
      const _appSlug =
        this._appSlugs.find((a) => a.slug == app.app_slug) ?? this._appSlugs[0];

      const _entity =
        [...Object.values(this.hass.states)].find(
          (e) => e.entity_id == app.entity_id,
        ) ?? null;

      __appList.push({
        app: {
          app_id: app.app_id,
          app_slug: app.app_slug,
          entity_id: app.entity_id,
          friendly_name: app.friendly_name,
        },
        app_slug: _appSlug,
        entity: _entity,
      });
    }
    this._appList = __appList;
  }
}
