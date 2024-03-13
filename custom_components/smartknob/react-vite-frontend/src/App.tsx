import {} from 'custom-card-helpers';
import { useEffect, useState } from 'react';
import { HomeAssistant, SelectOption, SelectSelector } from './types';
import { loadHa } from './load-ha-elements';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['ha-selector-select']: any;
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

  useEffect(() => {
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
    return <div className='text-yellow-700'>Loading... fuck yea!!!!</div>;
  }

  // return <div className='text-red-500'>Loading... fuck yea lol!!!!</div>;

  return (
    <div className='container mx-auto bg-red-300 text-black'>
      <p className='text-yellow-700'>seedlabs.it</p>
      <h2>Smart Knob - DevKit v0.1</h2>
      <p>
        STATE OF {hass.states['light.led_strip'].entity_id}:{' '}
        {hass.states['light.led_strip'].attributes.friendly_name}
      </p>
      <p>HASS language: {hass.language}</p>
      <ha-select
        hass={hass}
        selector={selectSelector}
        required
        label='Select Option'
        class='bg-red-500'
      >
        <mwc-list-item value={'cool value'}>{'cool text'}</mwc-list-item>
      </ha-select>
      <ha-selector-select
        hass={hass}
        selector={selectSelector}
        required
        label='Select Option'
      ></ha-selector-select>
    </div>
  );
};

export default HelloApp;
