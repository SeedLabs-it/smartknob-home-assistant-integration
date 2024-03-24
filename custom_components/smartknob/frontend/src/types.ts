/* eslint-disable  @typescript-eslint/no-explicit-any */
import {
  MessageBase,
  Connection,
  HassEntities,
  HassServices,
  HassEntity,
} from 'home-assistant-js-websocket';

declare global {
  interface HTMLElementTagNameMap {
    'ha-menu-button': HTMLElement;
    'ha-selector': HTMLElement;
    'ha-selector-select': HTMLElement;
  }
}

//MY CUSTOM TYPES
export interface AppSlug {
  slug: string;
  friendly_name: string;
  domain: string;
  supported_features: string;
}

export interface App {
  app_id: string;
  app_slug: string;
  entity_id: string;
  friendly_name: string;
}

export interface AppListItem {
  app: App;
  app_slug: AppSlug;
  entity: HassEntity | null;
}

export interface Tab {
  tabId: string;
  tabName: string;
}

// export interface Knob {
//   [mac_address: string]: KnobData;
// }

export type Knobs = Record<string, KnobData>;

export interface KnobData {
  mac_address: string;
  apps: App[];
}

//MY CUSTOM TYPES

export interface ServiceCallRequest {
  domain: string;
  service: string;
  serviceData?: Record<string, any>;
  target?: {
    entity_id?: string | string[];
    device_id?: string | string[];
    area_id?: string | string[];
  };
}

export interface HomeAssistant {
  connection: Connection;
  language: string;
  panels: {
    [name: string]: {
      component_name: string;
      config: { [key: string]: any } | null;
      icon: string | null;
      title: string | null;
      url_path: string;
    };
  };
  states: HassEntities;
  services: HassServices;
  localize: (key: string, ...args: any[]) => string;
  translationMetadata: {
    fragments: string[];
    translations: {
      [lang: string]: {
        nativeName: string;
        isRTL: boolean;
        fingerprints: { [fragment: string]: string };
      };
    };
  };
  callApi: <T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    parameters?: { [key: string]: any },
  ) => Promise<T>;
  callService: (
    domain: ServiceCallRequest['domain'],
    service: ServiceCallRequest['service'],
    serviceData?: ServiceCallRequest['serviceData'],
    target?: ServiceCallRequest['target'],
  ) => Promise<void>;
  callWS: <T>(msg: MessageBase) => Promise<T>;
}

interface EntitySelectorFilter {
  integration?: string;
  domain?: string | readonly string[];
  device_class?: string | readonly string[];
  supported_features?: number | [number];
}

export interface EntitySelector {
  entity: {
    multiple?: boolean;
    include_entities?: string[];
    exclude_entities?: string[];
    filter?: EntitySelectorFilter | readonly EntitySelectorFilter[];
  } | null;
}

export interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
}

export interface SelectSelector {
  select: {
    multiple?: boolean;
    custom_value?: boolean;
    mode?: 'list' | 'dropdown';
    options: readonly string[] | readonly SelectOption[];
    translation_key?: string;
    sort?: boolean;
    reorder?: boolean;
  } | null;
}
