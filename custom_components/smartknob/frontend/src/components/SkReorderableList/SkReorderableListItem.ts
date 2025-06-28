import { mdiDelete, mdiDragHorizontalVariant } from '@mdi/js';
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import install from '@twind/with-web-components';
import config from '../../../twind.config';

const withTwind = install(config);

@customElement('sk-reorderable-list-item')
export class SkReorderableListItem extends withTwind(LitElement) {
  static styles = css`
    :host(.over-top) {
      border-top: 4px solid var(--primary-color);
    }

    :host(.over-bottom) {
      border-bottom: 4px solid var(--primary-color);
    }

    [draggable] {
      opacity: 1;
    }
  `;

  @property() app_id!: string;
  @property({ type: Number }) index!: number;
  @property({ type: Boolean }) isDraggable?: boolean = true;

  connectedCallback() {
    super.connectedCallback();

    this.addEventListener('dragstart', this.dragStart);
    this.addEventListener('dragenter', this.dragEnter);
    this.addEventListener('dragover', this.dragOver);
    this.addEventListener('dragleave', this.dragLeave);
    this.addEventListener('dragend', this.dragEnd);
    this.addEventListener('drop', this.handleDrop);

    // TODO: Look over this workaround for touch events
    this.addEventListener('touchstart', this.dragStart);
    this.addEventListener('touchleave', this.dragLeave);
    this.addEventListener('touchcancel', this.dragEnd);
    this.addEventListener('touchend', this.dragEnd);
  }

  render() {
    if (this.isDraggable) this.setAttribute('draggable', 'true');
    else this.setAttribute('draggable', 'false');
    this.setAttribute('draggable-id', this.app_id);
    return html`
      <div
        class="flex flex-row flex-nowrap items-center justify-between select-none relative"
      >
        <slot></slot>
        <div
          class="flex items-center justify-center gap-1 cursor-pointer pl-4 pr-2"
        >
          <ha-svg-icon
            title="delete"
            class="text-[color:var(--error-color)] p-2"
            style=${!this.isDraggable ? '' : 'display: none;'}
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
            .path=${mdiDragHorizontalVariant}
            class="cursor-grab bg-zinc-700 rounded-lg p-2"
            style=${this.isDraggable ? '' : 'display: none;'}
          ></ha-svg-icon>
        </div>
        <p class="absolute top-0 right-0 m-0 text-xs">${this.index + 1}</p>
      </div>
    `;
  }
  dragStart(e: any) {
    if (this.isDraggable === false) return;

    this.style.opacity = '0.1';

    e.dataTransfer?.setData('text/plain', this.app_id);
    e.dataTransfer!.effectAllowed = 'move';

    this.classList.add('draggable-content');
  }

  dragEnter(e: any) {
    e.preventDefault();
  }

  dragOver(e: any) {
    e.preventDefault();
    const target = e.target as HTMLElement;

    if (target) {
      const rect = target.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const height = rect.height;
      const half = height / 2;
      if (y < half) {
        target.classList.remove('over-bottom');
        target.classList.add('over-top');
      } else {
        target.classList.remove('over-top');
        target.classList.add('over-bottom');
      }
      e.dataTransfer!.dropEffect = 'move';
    }
  }

  dragLeave(e: any) {
    e.preventDefault();
    const target = e.target as HTMLElement;

    if (target) {
      target.classList.remove('over-top');
      target.classList.remove('over-bottom');
    }
  }

  dragEnd(e: any) {
    this.style.opacity = '1';
    const target = e.target as HTMLElement;
    if (target) {
      target.classList.remove('over-top');
      target.classList.remove('over-bottom');
      this.requestUpdate();
    }
  }

  handleDrop(e: any) {
    e.stopPropagation();
    e.preventDefault();
    const target = e.target as HTMLElement;
    if (target) {
      target.classList.remove('over-top');
      target.classList.remove('over-bottom');
    }
  }
}
