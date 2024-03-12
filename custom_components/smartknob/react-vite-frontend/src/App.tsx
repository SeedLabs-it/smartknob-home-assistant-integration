import {} from 'custom-card-helpers';
import { useEffect, useState } from 'react';
import { HomeAssistant, SelectOption, SelectSelector } from './types';
import { loadHa } from './load-ha-elements';

import config from '@/twind.config';
import { twind, cssom, observe } from '@twind/core';
import axios from 'axios';
import generatedCss from '../src/index.css?inline';
import 'construct-style-sheets-polyfill';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['ha-selector']: any;
      ['ha-top-app-bar-fixed']: any;
      ['ha-menu-button']: any;
      ['ha-select']: any;
      ['mwc-list-item']: any;
    }
  }
}

const HelloApp = ({
  hass,
  narrow,
}: {
  hass: HomeAssistant;
  narrow: boolean;
}) => {
  let [load_state, setLoadState] = useState(false);

  // setConfig (config: Partial<ConfigState>) {
  //   const inSetup = Object.keys(this._oldConfig).length === 0
  //   const pluginsConfigHasChanged = config.plugins !== this._oldConfig.plugins

  //   this._oldConfig = this._config
  //   this._config = fulfillWithDefaults(config)

  //   dispatchCardEvent(CardEvents.CONFIG_RECEIVED, { config })
  //   if (this._dispatch_config_setup_event && !Object.keys(this._oldConfig).length)
  //     dispatchCardEvent(CardEvents.CONFIG_SETUP, { config })

  //   if (pluginsConfigHasChanged || inSetup) {
  //     this.injectStylesheets(this._config)
  //   }

  //   if (!this._oldConfig || this._rerender_after_set_config) this._render(true)
  // }

  useEffect(() => {
     const injectStylesheets = async ({ plugins }: any) => {
      const adoptedStyleSheets = [] as CSSStyleSheet[]

      const generatedSheet = cssom(new CSSStyleSheet())
      generatedSheet.target.replaceSync(generatedCss)
      adoptedStyleSheets.push(generatedSheet.target)

      const sheet = cssom(new CSSStyleSheet())
      const tw = twind(config, sheet)

      const styles = document.querySelector('head')?.querySelectorAll('style')

      if (styles) {
        styles.forEach(elem => {
          if (elem.getAttribute('data-daisyui')) return
          const om = cssom(new CSSStyleSheet())
          om.target.replaceSync(elem.innerHTML)
          adoptedStyleSheets.push(om.target)
        })
      }

      const getDaisyUIStyle = () => {
        return document.querySelector('head style[data-daisyui]')
      }

      if (false || plugins.daisyui.enabled) {
        const daisyStyle = getDaisyUIStyle()
        if (!daisyStyle) {
          const elem = document.createElement('style')
          elem.setAttribute('data-daisyui', 'true')
          elem.setAttribute('type', 'text/css')

          const daisyCDN = plugins.daisyui.url ?? "https://cdn.jsdelivr.net/npm/daisyui@latest/dist/full.css"
          const res = await axios.get(daisyCDN)

          elem.innerHTML = res.data
          document.head.appendChild(elem)
        }

        const daisySheet = getDaisyUIStyle()
        if (daisySheet instanceof HTMLStyleElement) {
          if (daisySheet.sheet !== null) {
            const stylesheet = new CSSStyleSheet()
            stylesheet.replaceSync(daisySheet.innerHTML)
            adoptedStyleSheets.push(stylesheet)
          }
        }
      }

      adoptedStyleSheets.push(sheet.target)

      this.shadow.adoptedStyleSheets = adoptedStyleSheets

    loadHa().then(() => {
      console.log('loadHa done');
      setLoadState(true);
    });
    console.log('HelloApp mounted');

    if (narrow) console.log('narrow');
  }, []);

  const options: SelectOption[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ];

  const selectSelector: SelectSelector = {
    select: {
      custom_value: false,
      mode: 'dropdown',
      options,
    },
  };

  if (!load_state) {
    return <div>Loading...</div>;
  }

  return (
    <div className='container mx-auto bg-red-300'>
      <p className='text-yellow-700'>seedlabs.it</p>
      <h2>Smart Knob - DevKit v0.1</h2>
      {hass.states['light.led_strip'].attributes.friendly_name}
      <ha-select
        hass={hass}
        selector={selectSelector}
        required
        label='Select Option'
      >
        <mwc-list-item value={'cool value'}>{'cool text'}</mwc-list-item>
      </ha-select>
      <ha-selector
        hass={hass}
        selector={selectSelector}
        required
        label='Select Option'
      ></ha-selector>
    </div>
  );
};

export default HelloApp;
