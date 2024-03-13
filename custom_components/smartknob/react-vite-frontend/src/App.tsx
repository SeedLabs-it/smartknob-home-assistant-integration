import {} from 'custom-card-helpers';
import { useEffect, useRef } from 'react';
import { HomeAssistant, SelectOption, SelectSelector } from './types';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['ha-selector']: any;
      ['ha-top-app-bar-fixed']: any;
      ['ha-menu-button']: any;
      ['ha-select']: any;
      ['mwc-list-item']: any;
      ['ha-selector-select']: any;
      ['ha-sortable']: any;
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
  const selectorRef = useRef<any>(null);
  const appSlugs = [
    { slug: 'dimmer', friendly_name: 'Dimmer' },
    { slug: 'stopwatch', friendly_name: 'Stopwatch' },
    { slug: 'light', friendly_name: 'Light' },
    { slug: 'led_strip', friendly_name: 'LED Strip' },
    { slug: 'fan', friendly_name: 'Fan' },
  ];

  const options: SelectOption[] = appSlugs.map((slug) => {
    return {
      value: slug.slug,
      label: slug.friendly_name,
    };
  });

  const slugSelector: SelectSelector = {
    select: {
      custom_value: false,
      mode: 'dropdown',
      options,
    },
  };

  useEffect(() => {
    if (selectorRef.current) {
      let el: {
        hass: HomeAssistant;
        selector: SelectSelector;
        label: string;
      } & HTMLElement = selectorRef.current;
      el.hass = hass;
      el.selector = slugSelector;
      el.label = 'Select an app';
    }

    if (narrow) console.log('narrow');
  }, []);

  return (
    <div className='container mx-auto'>
      <p className=''>seedlabs.it</p>
      <h2>Smart Knob - DevKit v0.1</h2>
      <p>
        STATE OF {hass.states['light.led_strip'].entity_id}:{' '}
        {hass.states['light.led_strip'].attributes.friendly_name}
      </p>
      <p>HASS language: {hass.language}</p>
      <ha-selector ref={selectorRef} />
    </div>
  );
};

export default HelloApp;
