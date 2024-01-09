import { LitElement } from 'lit';
import { AppListItem, AppSlug, HomeAssistant } from '../types';
import { HassEntity } from 'home-assistant-js-websocket';
export declare class SkReorderableList extends LitElement {
    static styles: import("lit").CSSResult;
    hass: HomeAssistant;
    appSlugs: AppSlug[];
    entities: HassEntity[];
    apps: AppListItem[];
    sortable: boolean;
    render(): import("lit-html").TemplateResult<1>;
    drop(e: any): void;
    reorderItems(items: AppListItem[], draggedId: string, dropId: string): AppListItem[];
}
export declare class SkReorderableListItem extends LitElement {
    static styles: import("lit").CSSResult;
    app_id: string;
    isDraggable?: boolean;
    connectedCallback(): void;
    render(): import("lit-html").TemplateResult<1>;
    dragStart(e: any): void;
    dragEnter(e: any): void;
    dragOver(e: any): void;
    dragLeave(e: any): void;
    dragEnd(e: any): void;
}
//# sourceMappingURL=SkReorderableList.d.ts.map