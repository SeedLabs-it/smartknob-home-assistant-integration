import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import {
  AppListItem,
  AppSlug,
  HomeAssistant,
  SelectOption,
  SelectSelector,
} from '../../types';
import { asyncSaveApps } from '../../data/websockets';
import { HassEntity } from 'home-assistant-js-websocket';
import './SkReorderableListItem';

import install from '@twind/with-web-components';
import config from '../../../twind.config';

const withTwind = install(config);

@customElement('sk-reorderable-list')
export class SkReorderableList extends withTwind(LitElement) {
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
          .index=${index}
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
          class="flex flex-col justify-between h-full py-2 my-2 odd:bg-zinc-800 even:bg-zinc-900 rounded-lg px-2"
        >
          <div class="flex md:flex-row flex-col flex-nowrap gap-2 w-full">
            <ha-selector
              .hass=${this.hass}
              .selector=${selectSelector}
              .required=${true}
              .label=${'Select App'}
              .value=${item.app_slug.slug}
              class="w-full"
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
              .required=${item.app_slug?.slug == 'stopwatch' ? false : true}
              .disabled=${entitySelectorDisabled()}
              .value=${item.entity?.entity_id}
              class="w-full"
            ></ha-selector>
          </div>
        </sk-reorderable-list-item> `;
      })}
    `;
  }

  drop(e: any) {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;
    const half = height / 2;

    const dropId = e.target.getAttribute('draggable-id');
    const draggableId = e.dataTransfer.getData('text/plain');

    var dropIndex = this.apps.findIndex((item) => item.app.app_id === dropId);
    const draggableIndex = this.apps.findIndex(
      (item) => item.app.app_id === draggableId,
    );

    if (y < half) {
      dropIndex = dropIndex - 1;
      this.apps = this.reorderItems(this.apps, draggableIndex, dropIndex);
    } else {
      this.apps = this.reorderItems(this.apps, draggableIndex, dropIndex);
    }

    asyncSaveApps(
      this.hass,
      this.mac_address,
      this.apps.map((item) => item.app),
    );

    this.requestUpdate();
  }

  reorderItems(
    items: AppListItem[],
    draggedIndex: number,
    droppedIndex: number,
  ): AppListItem[] {
    if (droppedIndex < 0) droppedIndex = 0;

    const draggedItem = items[draggedIndex];

    items.splice(draggedIndex, 1);
    items.splice(droppedIndex, 0, draggedItem);

    return items;
  }
}
