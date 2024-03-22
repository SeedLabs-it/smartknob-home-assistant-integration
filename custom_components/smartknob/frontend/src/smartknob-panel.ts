import './types';
import { html, css, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators';

import './view/app-form';
import { AppListItem, AppSlug, HomeAssistant, Knob, Tab } from './types';
import { loadHa } from './load-ha-elements';
import { getAsyncAppSlugs, getAsyncKnobs } from './data/websockets';
import { DOMAIN, TABS } from './const';

@customElement('smartknob-panel')
export class SmartknobPanel extends LitElement {
  static styles = css`
    .header {
      /* display: flex;
      align-items: center;
      justify-content: space-between; */
      padding: 0 16px;
      background-color: var(--app-header-background-color);
      color: var(--text-primary-color);
    }

    .header h2 {
      margin: 0;
    }

    .header .toolbar {
      padding: 16px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .header ha-tabs {
      --paper-tabs-selection-bar-color: var(
        --app-header-selection-bar-color,
        var(--app-header-text-color, #fff)
      );
    }

    .content {
      padding: 24px;
    }
  `;

  @property({ type: Object }) public hass!: HomeAssistant;
  @property({ type: Boolean }) public narrow!: boolean;
  @state() private _appSlugs: AppSlug[] = [];
  @state() private _appList: AppListItem[] = [];
  @state() private _knobs: Knob = {};
  @state() private _currentTab: Tab = TABS[0];

  async connectedCallback() {
    const loadedKnobs = (await getAsyncKnobs(this.hass)).knobs;

    const loadedAppSlugs = (await getAsyncAppSlugs(this.hass)).app_slugs;

    const __appList: AppListItem[] = [];

    for (const knob in loadedKnobs) {
      for (const app of loadedKnobs[knob].apps) {
        const _appSlug =
          loadedAppSlugs.find((a) => a.slug == app.app_slug) ??
          loadedAppSlugs[0];

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
    }
    this._appList = __appList;
    this._appSlugs = loadedAppSlugs;

    this._knobs = loadedKnobs;

    super.connectedCallback();

    this.requestUpdate();
  }

  async firstUpdated() {
    await loadHa();

    this.requestUpdate();
  }

  render() {
    if (
      !customElements.get('ha-panel-config') ||
      !customElements.get('ha-menu-button')
    )
      return html` loading... `;

    const entities = [...Object.values(this.hass.states)];

    return html`<div>
      <div>
        <div class="header">
          <div class="toolbar">
            <ha-menu-button
              .hass=${this.hass}
              .narrow=${this.narrow}
            ></ha-menu-button>
            <h2>SmartKnob</h2>
          </div>
          <ha-tabs
            scrollable
            attr-for-selected="tab-name"
            .selected=${this._currentTab.tabId}
            @iron-activate=${this.handleTabSelect}
          >
            ${TABS.map(
              (tab) =>
                html`<paper-tab tab-name=${tab.tabId}
                  >${tab.tabName}</paper-tab
                >`,
            )}
          </ha-tabs>
        </div>
        <div class="content">
          <app-form
            .hass=${this.hass}
            .entities=${entities}
            .appSlugs=${this._appSlugs}
            .apps=${this._appList}
            .mac_address=${this._knobs[Object.keys(this._knobs)[0]].mac_address}
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
}
