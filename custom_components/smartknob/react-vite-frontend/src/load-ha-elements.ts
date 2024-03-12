export const loadHa = async () => {
  if (customElements.get('ha-selector-entity')) return;

  await customElements.whenDefined('partial-panel-resolver');
  // // eslint-disable-next-line
  const ppr = document.createElement('partial-panel-resolver') as any;
  ppr.hass = {
    panels: [
      {
        url_path: 'tmp',
        component_name: 'config',
      },
    ],
  };
  ppr._updateRoutes();
  await ppr.routerOptions.routes.tmp.load();

  await customElements.whenDefined('ha-panel-config');

  // eslint-disable-next-line
  const cpr = document.createElement('ha-panel-config') as any;
  await cpr.routerOptions.routes.automation.load();
  // await customElements.whenDefined('ha-selector-entity');
};
