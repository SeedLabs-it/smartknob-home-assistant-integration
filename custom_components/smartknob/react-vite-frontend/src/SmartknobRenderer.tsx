import { HomeAssistant } from 'custom-card-helpers';
import 'construct-style-sheets-polyfill';
import axios from 'axios';
import { twind, cssom, observe } from '@twind/core';
import config from '@/twind.config';
import { render } from 'react-dom';
// import generatedCss from '@/src/index.css?inline';
// import inline from '@twind/with-react/inline';
import React from 'react';

import install from '@twind/with-web-components';
// import config from '../twind.config';

const withTwind = install(config);

export default function reactToCustomElementTailwind(
  reactComponent: React.ComponentType<any>,
): CustomElementConstructor {
  // const renderSymbol = Symbol.for('smartknob.render');
  // const connectedSymbol = Symbol.for('smartknob.connected');
  // const contextSymbol = Symbol.for('smartknob.context');
  // const propsSymbol = Symbol.for('smartknob.props');

  class SmartknobCustomElementRenderer extends withTwind(HTMLElement) {
    _hass: HomeAssistant | undefined;
    _oldHass: HomeAssistant | undefined;
    shadow: ShadowRoot;
    _rerender_after_set_hass = true;

    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: 'open' });

      this._render();

      // const shadow = this.attachShadow({ mode: 'open' });
      // this.shadow.innerHTML = `<h1 class="text-3xl font-bold underline text-red-500">Hello world!</h1>`;
    }

    async injectStylesheets() {
      const adoptedStyleSheets = [] as CSSStyleSheet[];

      const generatedSheet = cssom(new CSSStyleSheet());
      // generatedSheet.target.replaceSync(generatedCss);
      adoptedStyleSheets.push(generatedSheet.target);

      const sheet = cssom(new CSSStyleSheet());
      const tw = twind(config, sheet);

      const styles = document.querySelector('head')?.querySelectorAll('style');

      if (styles) {
        styles.forEach((elem) => {
          if (elem.getAttribute('data-daisyui')) return;
          const om = cssom(new CSSStyleSheet());
          om.target.replaceSync(elem.innerHTML);
          adoptedStyleSheets.push(om.target);
        });
      }

      const getDaisyUIStyle = () => {
        return document.querySelector('head style[data-daisyui]');
      };

      const daisyStyle = getDaisyUIStyle();
      if (!daisyStyle) {
        const elem = document.createElement('style');
        elem.setAttribute('data-daisyui', 'true');
        elem.setAttribute('type', 'text/css');

        const daisyCDN =
          'https://cdn.jsdelivr.net/npm/daisyui@latest/dist/full.css';
        const res = await axios.get(daisyCDN);

        elem.innerHTML = res.data;
        document.head.appendChild(elem);
      }

      const daisySheet = getDaisyUIStyle();
      if (daisySheet instanceof HTMLStyleElement) {
        if (daisySheet.sheet !== null) {
          const stylesheet = new CSSStyleSheet();
          stylesheet.replaceSync(daisySheet.innerHTML);
          adoptedStyleSheets.push(stylesheet);
        }
      }

      adoptedStyleSheets.push(sheet.target);

      this.shadow.adoptedStyleSheets = adoptedStyleSheets;
      observe(tw, this.shadow);
    }

    public set hass(hass: HomeAssistant) {
      this._oldHass = this._hass;
      this._hass = hass;

      if (!this._oldHass || this._rerender_after_set_hass) this._render();
    }

    _render() {
      const el = React.createElement(reactComponent, {
        hass: this._hass,
        // narrow: true,
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
