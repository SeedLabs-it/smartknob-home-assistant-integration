import './types';
import { LitElement } from 'lit';
import './view/app-form';
import { HomeAssistant } from './types';
export declare class SmartknobPanel extends LitElement {
    static styles: import("lit").CSSResult;
    hass: HomeAssistant;
    narrow: boolean;
    private _appSlugs;
    private _appList;
    private _knobs;
    private _currentTab;
    connectedCallback(): Promise<void>;
    firstUpdated(): Promise<void>;
    render(): import("lit-html").TemplateResult<1>;
    handleTabSelect(e: any): void;
}
//# sourceMappingURL=smartknob-panel.d.ts.map