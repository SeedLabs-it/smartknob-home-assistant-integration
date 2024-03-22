import { mdiDelete, mdiDrag } from '@mdi/js';
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import install from '@twind/with-web-components';
import config from '../../../twind.config';

const withTwind = install(config);

@customElement('sk-reorderable-list-item')
export class SkReorderableListItem extends withTwind(LitElement) {
  static styles = css`
    :host(.over) {
      border-bottom: 4px solid var(--primary-color);
    }
    [draggable] {
      opacity: 1;
    }

    /* .actions {
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
    }*/
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
      <div
        class="flex flex-row flex-nowrap items-center justify-between select-none "
      >
        <slot></slot>
        <div class="flex items-center justify-center gap-1 cursor-pointer">
          <ha-svg-icon
            title="delete"
            class="text-[color:var(--error-color)]"
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
            class="cursor-grab"
            style=${this.isDraggable ? '' : 'display: none;'}
          ></ha-svg-icon>
        </div>
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
