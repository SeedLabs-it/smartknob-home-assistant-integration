import { mdiDelete, mdiDrag } from '@mdi/js';
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import {
  AppListItem,
  AppSlug,
  HomeAssistant,
  SelectOption,
  SelectSelector,
} from '../types';
import { asyncSaveApps } from '../data/websockets';
import { HassEntity } from 'home-assistant-js-websocket';

@customElement('sk-reorderable-list')
export class SkReorderableList extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    :host > * {
      padding: 12px;
    }
    :host > :nth-child(odd) {
      background-color: var(--secondary-background-color);
    }
    :host > :nth-child(even) {
      background-color: var(--primary-background-color);
    }

    .list-item {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      gap: 12px;
    }
    .list-item .index {
      width: 32px;
      text-align: center;
    }
  `;

  @property({ type: Object }) public hass!: HomeAssistant;
  @property({ type: Array }) public appSlugs!: AppSlug[];
  @property({ type: Array }) public entities!: HassEntity[];
  @property({ type: Array }) apps: AppListItem[] = [];
  @property({ type: Boolean }) sortable: boolean = false;
  @property({ type: String }) mac_address!: string;

  render() {
    const options: SelectOption[] = this.appSlugs.map((slug) => {
      return {
        value: slug.slug,
        label: slug.friendly_name,
      };
    });

    const selectSelector: SelectSelector = {
      select: {
        custom_value: false,
        mode: 'dropdown',
        options,
      },
    };

    return html`
      ${this.apps.map((item, index) => {
        const entitySelectorDisabled = () => {
          if (item.app_slug?.slug == 'stopwatch') return true;
          return false;
        };

        return html`<sk-reorderable-list-item
          .app_id=${item.app.app_id}
          .isDraggable=${this.sortable}
          @drop="${this.drop}"
          @delete="${() => {
            // TODO show confirmation dialog before deletion
            this.apps = this.apps.filter(
              (app) => app.app.app_id !== item.app.app_id,
            );
            asyncSaveApps(
              this.hass,
              this.mac_address,
              this.apps.map((item) => item.app),
            );
            this.requestUpdate();
          }}"
        >
          <div class="list-item">
            <div class="index">${index + 1}</div>
            <ha-selector
              .hass=${this.hass}
              .selector=${selectSelector}
              .required=${true}
              .label=${'Select App'}
              .value=${item.app_slug.slug}
            ></ha-selector>
            <ha-selector
              .hass=${this.hass}
              .selector="${{
                entity: {
                  include_entities: this.entities.map((entity) => {
                    if (!entity.entity_id.startsWith(item.app_slug.domain))
                      return '';

                    return entity.entity_id;
                  }),
                },
              }}"
              }}
              .required=${item.app_slug?.slug == 'stopwatch' ? false : true}
              .disabled=${entitySelectorDisabled()}
              .value=${item.entity?.entity_id}
            ></ha-selector>
          </div>
        </sk-reorderable-list-item> `;
      })}
    `;
  }

  drop(e: any) {
    e.target.classList.remove('over');
    const draggableId = e.dataTransfer?.getData('text/plain');
    const dropId = e.target.getAttribute('draggable-id');

    this.apps = this.reorderItems(this.apps, draggableId, dropId);

    asyncSaveApps(
      this.hass,
      this.mac_address,
      this.apps.map((item) => item.app),
    );
    this.requestUpdate();
  }

  reorderItems(
    items: AppListItem[],
    draggedId: string,
    dropId: string,
  ): AppListItem[] {
    const draggableIndex = items.findIndex(
      (item) => item.app.app_id === draggedId,
    );
    const dropIndex = items.findIndex((item) => item.app.app_id === dropId);

    const [draggedItem] = items.splice(draggableIndex, 1);
    items.splice(
      draggableIndex < dropIndex ? dropIndex : dropIndex,
      0,
      draggedItem,
    );

    return items;
  }
}

@customElement('sk-reorderable-list-item')
export class SkReorderableListItem extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: space-between;
      user-select: none;
      height: 48px;
    }
    :host(.over) {
      border-bottom: 4px solid var(--primary-color);
    }
    [draggable] {
      opacity: 1;
    }

    .actions {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      cursor: pointer;
    }

    .actions .delete {
      color: var(--error-color);
    }

    .actions .sort {
      cursor: grab;
    }
  `;

  @property() app_id!: string;
  @property({ type: Boolean }) isDraggable?: boolean = true;

  connectedCallback() {
    super.connectedCallback();

    this.addEventListener('dragstart', this.dragStart);
    this.addEventListener('dragenter', this.dragEnter);
    this.addEventListener('dragover', this.dragOver);
    this.addEventListener('dragleave', this.dragLeave);
    this.addEventListener('dragend', this.dragEnd);
  }

  render() {
    if (this.isDraggable) this.setAttribute('draggable', 'true');
    else this.removeAttribute('draggable');
    this.setAttribute('draggable-id', this.app_id);
    return html`
      <slot></slot>
      <div class="actions">
        <ha-svg-icon
          title="delete"
          class="delete"
          .path=${mdiDelete}
          @click=${() => {
            this.dispatchEvent(
              new CustomEvent('delete', {
                detail: { id: this.app_id },
                bubbles: true,
                composed: true,
              }),
            );
          }}
        ></ha-svg-icon>
        <ha-svg-icon
          title="draggable"
          .path=${mdiDrag}
          class="sort"
          style=${this.isDraggable ? '' : 'display: none;'}
        ></ha-svg-icon>
      </div>
    `;
  }
  dragStart(e: any) {
    this.style.opacity = '0.4';
    e.dataTransfer?.setData('text/plain', this.id);
    e.dataTransfer!.effectAllowed = 'move';

    this.classList.add('draggable-content');
    e.target.classList.add('over');
  }

  dragEnter(e: any) {
    e.preventDefault();
    e.target.classList.add('over');
  }

  dragOver(e: any) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  dragLeave(e: any) {
    e.preventDefault();
    e.target.classList.remove('over');
  }

  dragEnd(e: any) {
    this.style.opacity = '1';
    e.target.classList.remove('over');
    this.requestUpdate();
  }
}
