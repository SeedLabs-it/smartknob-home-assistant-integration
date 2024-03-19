import { HomeAssistant } from 'custom-card-helpers';
import 'construct-style-sheets-polyfill';
// import axios from 'axios';
// import { twind, cssom, observe } from '@twind/core';
import config from '@/twind.config';
import { render } from 'react-dom';
// import generatedCss from '@/src/index.css?inline';
// import inline from '@twind/with-react/inline';
import React from 'react';

import install from '@twind/with-web-components';
import { loadHa } from 'load-ha-elements';
// import config from '../twind.config';

const withTwind = install(config);

export default function reactToCustomElementTailwind(
  reactComponent: React.ComponentType<any>,
): CustomElementConstructor {
  class SmartknobCustomElementRenderer extends withTwind(HTMLElement) {
    _hass: HomeAssistant | undefined;
    _oldHass: HomeAssistant | undefined;
    _narrow: boolean | undefined;
    _oldNarrow: boolean | undefined;
    shadow: ShadowRoot;

    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: 'open' });

      this.firstUpdated();
    }

    async firstUpdated() {
      await loadHa();
      this._render();
    }

    public set hass(hass: HomeAssistant) {
      this._oldHass = this._hass;
      this._hass = hass;

      if (this._oldHass !== this._hass) this._render();
    }

    public set narrow(narrow: boolean) {
      this._oldNarrow = this._narrow;
      this._narrow = narrow;

      if (this._oldNarrow !== this._narrow) this._render();
    }

    _render() {
      const el = React.createElement(reactComponent, {
        hass: this._hass,
        narrow: this._narrow,
      });

      render(el, this.shadow);
    }

    _deRender() {
      this.shadow.innerHTML = '';

      const el = React.createElement('', {});
      render(el, this.shadow);
    }
  }

  return SmartknobCustomElementRenderer;
}
