import { App, AppSlug, HomeAssistant, Knob } from '../types';
export declare const getAsyncApps: (hass: HomeAssistant) => Promise<{
    success: any;
    apps: App[];
}>;
export declare const asyncSyncToKnob: (hass: HomeAssistant, mac_address: string) => Promise<unknown>;
export declare const asyncSaveApp: (hass: HomeAssistant, mac_address: string, app: App) => Promise<unknown>;
export declare const saveApps: (hass: HomeAssistant, apps: App[]) => Promise<unknown>;
export declare const getAsyncAppSlugs: (hass: HomeAssistant) => Promise<{
    success: any;
    app_slugs: AppSlug[];
}>;
export declare const getAsyncKnobs: (hass: HomeAssistant) => Promise<{
    success: any;
    knobs: Knob;
}>;
//# sourceMappingURL=websockets.d.ts.map