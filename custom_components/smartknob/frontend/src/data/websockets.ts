import { App, AppSlug, HomeAssistant, KnobData } from '../types';

export const getAsyncApps = (hass: HomeAssistant) => {
  return hass.callApi<{ success; apps: App[] }>('GET', 'smartknob/apps');
};

export const asyncSyncToKnob = async (
  hass: HomeAssistant,
  mac_address: string,
) => {
  return await hass.callApi('POST', 'smartknob/knob/sync', {
    mac_address,
  });
};

export const asyncSaveApp = async (
  hass: HomeAssistant,
  mac_address: string,
  app: App,
) => {
  return await hass.callApi('POST', 'smartknob/apps', {
    mac_address,
    apps: [
      {
        app_id: app.app_id,
        app_slug: app.app_slug,
        entity_id: app.entity_id,
        friendly_name: app.friendly_name,
      },
    ],
  });
};

export const asyncSaveApps = async (
  hass: HomeAssistant,
  mac_address: string,
  apps: App[],
) => {
  const _apps: {}[] = [];
  for (const app of apps) {
    _apps.push({
      app_id: app.app_id,
      app_slug: app.app_slug,
      entity_id: app.entity_id,
      friendly_name: app.friendly_name,
    });
  }

  return await hass.callApi('PUT', 'smartknob/apps', {
    mac_address,
    apps: _apps,
  });
};

//! WTF ?? why does this still return a promise what am i missing?
export const getAsyncAppSlugs = async (hass: HomeAssistant) => {
  const res = await hass.callApi<{ success; app_slugs: AppSlug[] }>(
    'GET',
    'smartknob/app_slugs',
  );

  if (res.success != 'success') console.log("ERROR: Couldn't get app slugs");

  return res;
};

export const getAsyncKnobs = async (hass: HomeAssistant) => {
  const res = await hass.callApi<{ success; knobs: KnobData[] }>(
    'GET',
    'smartknob/knobs',
  );
  if (res.success != true) console.log("ERROR: Couldn't get knobs");

  return res;
};
