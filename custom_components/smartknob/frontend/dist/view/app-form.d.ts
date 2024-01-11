import { LitElement } from 'lit';
import { AppListItem, AppSlug, HomeAssistant } from '../types';
import { HassEntity } from 'home-assistant-js-websocket';
import '../components/SkReorderableList';
export declare class AppForm extends LitElement {
    static styles: import("lit").CSSResult;
    hass: HomeAssistant;
    entities: HassEntity[];
    appSlugs: AppSlug[];
    apps: AppListItem[];
    mac_address: String;
    private _selectedSlug;
    private _selectedEntity;
    private _domain;
    private _sortable;
    connectedCallback(): void;
    render(): import("lit-html").TemplateResult<1>;
    handleSubmit: (e: Event) => void;
    listApps(): import("lit-html").TemplateResult<1>;
    appSlugChanged(e: any): void;
    entityChanged(e: any): void;
}
//# sourceMappingURL=app-form.d.ts.map