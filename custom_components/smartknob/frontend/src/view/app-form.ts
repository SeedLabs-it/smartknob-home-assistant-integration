import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {
  AppListItem,
  AppSlug,
  EntitySelector,
  HomeAssistant,
  SelectOption,
  SelectSelector,
} from '../types';
import { HassEntity } from 'home-assistant-js-websocket';
import '../components/SkReorderableList';
import { mdiPlus, mdiSort } from '@mdi/js';
import { asyncSaveApp, asyncSyncToKnob } from '../data/websockets';
// import { selectSelector } from '../const';

@customElement('app-form')
export class AppForm extends LitElement {
  static styles = css`
    :host {
      display: block;
      max-width: 600px;
    }
    ha-selector {
      min-width: 200px;
      width: 100%;
    }

    .add-app {
      width: 100%;
      display: flex;
      gap: 12px;
      padding-bottom: 12px;
      align-items: center;
    }

    .btn {
      height: 100%;
      aspect-ratio: 1/1;
    }
  `;

  @property({ type: Object }) hass!: HomeAssistant;
  @property({ type: Array }) entities!: HassEntity[];
  @property({ type: Array }) appSlugs!: AppSlug[];
  @property({ type: Array }) apps!: AppListItem[];
  @property({ type: String }) mac_address!: string;

  @state() private _selectedSlug: AppSlug | null = null;
  @state() private _selectedEntity: HassEntity | null = null;
  @state() private _domain: string = '';
  @state() private _sortable: boolean = false;

  connectedCallback(): void {
    super.connectedCallback();
    this._selectedSlug = this.appSlugs[0];
    this._domain = this._selectedSlug.domain;
  }

  render() {
    const options: SelectOption[] = this.appSlugs.map((slug) => {
      return {
        value: slug.slug,
        label: slug.friendly_name,
      };
    });

    const slugSelector: SelectSelector = {
      select: {
        custom_value: false,
        mode: 'dropdown',
        options,
      },
    };

    const included_entity_ids: string[] = this.entities
      .map((entity) => {
        if (
          !entity.entity_id.startsWith(this._domain) ||
          this.apps.find((app) => {
            if (
              this._selectedSlug?.slug == app.app.app_slug &&
              app.app.entity_id == entity.entity_id
            )
              return true;
            return false;
          })
        ) {
          return '';
        }
        return entity.entity_id;
      })
      .filter((e) => e != '')!;

    const entitySelector: EntitySelector = {
      entity: {
        include_entities: included_entity_ids,
      },
    };

    const entitySelectorDisabled = () => {
      if (this._selectedSlug?.slug == 'stopwatch') return true;
      return false;
    };

    return html`
      <button
        @click=${() => {
          asyncSyncToKnob(this.hass, this.mac_address);
        }}
      >
        Sync to KNOB
      </button>
      <form class="add-app" @submit=${this.handleSubmit}>
        <ha-selector
          .hass=${this.hass}
          .selector=${slugSelector}
          .required=${true}
          .label=${'Select App'}
          .value=${this._selectedSlug?.slug}
          @value-changed=${this.appSlugChanged}
        ></ha-selector>
        <ha-selector
          .hass=${this.hass}
          .selector=${entitySelector}
          .required=${this._selectedSlug?.slug == 'stopwatch' ? false : true}
          .disabled=${entitySelectorDisabled()}
          .value=${this._selectedEntity?.attributes.friendly_name}
          @value-changed=${this.entityChanged}
        ></ha-selector>

        <button type="submit" class="btn">
          <ha-svg-icon title="submit" .path=${mdiPlus}></ha-svg-icon>
        </button>
        <button
          @click=${(e: any) => {
            e.preventDefault();
            this._sortable = !this._sortable;
          }}
          class="btn reorder-btn"
        >
          <ha-svg-icon title="reorder" .path=${mdiSort}></ha-svg-icon>
        </button>
      </form>

      <sk-reorderable-list
        .hass=${this.hass}
        .appSlugs=${this.appSlugs}
        .apps="${this.apps}"
        .sortable=${this._sortable}
        .entities=${this.entities}
        .mac_address=${this.mac_address}
      ></sk-reorderable-list>
    `;
  }
  handleSubmit = (e: Event) => {
    e.preventDefault();
    //! VALIDATE INPUTS
    if (!this._selectedSlug) return; //TODO HANDLE

    const appListItem: AppListItem = {
      app: {
        app_id: `${this._selectedSlug.slug}-${
          this._selectedEntity
            ? this._selectedEntity.entity_id
            : Math.random().toString(16).slice(0, 8)
        }`,
        app_slug: this._selectedSlug.slug,
        entity_id: this._selectedEntity ? this._selectedEntity.entity_id : '',
        friendly_name: this._selectedEntity
          ? this._selectedEntity.attributes.friendly_name ?? ''
          : this._selectedSlug.friendly_name,
      },
      app_slug: this._selectedSlug,
      entity: this._selectedEntity,
    };
    if (
      !this.apps.find(
        (appEntity) =>
          appEntity.app_slug == appListItem.app_slug &&
          appEntity.entity == appListItem.entity,
      )
    )
      this.apps.push(appListItem);
    this.apps = [...this.apps]; //TODO VALIDATE DATA _entity could be null for example

    asyncSaveApp(this.hass, this.mac_address, appListItem.app); //SAVE TO STORAGE --- FIX!!!!! HARDCODED MAC ADDRESS TO TEST FOR NOW

    this.requestUpdate();
  };

  listApps() {
    return html`${this.apps.map((app) => {
      const id = `${app.app_slug.slug}-${app.entity!.entity_id}`;
      return html`<li .id="${id}">
        ${app.app_slug.friendly_name} - ${app.entity!.attributes.friendly_name}
      </li>`;
    })}`;
  }

  appSlugChanged(e: any) {
    //TODO CREATE TYPE MATCHING EVENT LOOK AT COMMENTED TYPE UP TOP ETC https://github.com/home-assistant/frontend/blob/dev/src/common/dom/fire_event.ts#L60
    //!https://github.com/home-assistant/frontend/blob/dev/src/common/dom/fire_event.ts#L60
    this._selectedSlug =
      this.appSlugs.find((app) => app.slug == e.detail.value) ?? null;
    this._domain = this._selectedSlug?.domain ?? '';
    this._selectedEntity = null;
    this.requestUpdate();
  }

  entityChanged(e: any) {
    //TODO CREATE TYPE MATCHING EVENT LOOK AT COMMENTED TYPE UP TOP ETC
    //! https://github.com/home-assistant/frontend/blob/dev/src/common/dom/fire_event.ts#L60
    this._selectedEntity =
      Object.values(this.hass.states).find(
        (entity) => entity.entity_id == e.detail.value,
      ) ?? null;
  }
}
