import {} from 'custom-card-helpers';
import { useEffect, useRef, useState } from 'react';
import { HomeAssistant } from './types';
import AddApp from 'views/add-app';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['ha-selector']: any;
      ['ha-menu-button']: any;
      ['ha-tabs']: any;
      ['paper-tab']: any;
    }
  }
}

const SmartknobIntegration = ({
  hass,
  narrow,
}: {
  hass: HomeAssistant;
  narrow: boolean;
}) => {
  const menuButtonRef = useRef<any>(null);
  const tabsRef = useRef<any>(null);

  const [currentTabId, setCurrentTabId] = useState<string>('setup');

  const handleTabSelect = (e: any) => {
    setCurrentTabId(e.target.getAttribute('tab-id'));
  };

  const tabs = [
    {
      tabId: 'setup',
      tabName: 'Setup',
    },
    {
      tabId: 'configuration',
      tabName: 'Configuration',
    },
  ];

  useEffect(() => {
    // setDomain(selectedSlug);
    if (menuButtonRef.current) {
      let el: {
        hass: HomeAssistant;
        narrow: boolean;
        dockedSidebar: boolean;
      } & HTMLElement = menuButtonRef.current;
      el.hass = hass;
      el.narrow = narrow;
      el.dockedSidebar = true;
    }

    if (tabsRef.current) {
      let el: {
        attrForSelected: string;
      } & HTMLElement = tabsRef.current;
      el.attrForSelected = 'tab-id';
      el.style.setProperty(
        '--paper-tabs-selection-bar-color',
        'var(--app-header-selection-bar-color, var(--app-header-text-color, #fff))',
      );
    }
  }, [hass, narrow]);

  return (
    <>
      <div className='px-4 bg-[color:var(--app-header-background-color)]'>
        <div className='flex px-4 items-center gap-2 text-xl h-[var(--header-height)]'>
          <ha-menu-button ref={menuButtonRef}></ha-menu-button>
          <h2 className='m-0'>Smartknob</h2>
        </div>
        <ha-tabs
          ref={tabsRef}
          onClick={handleTabSelect}
          selected={currentTabId}
          scrollable
        >
          {tabs.map((tab) => (
            <paper-tab tab-id={tab.tabId}>{tab.tabName}</paper-tab>
          ))}
        </ha-tabs>
      </div>
      <AddApp hass={hass} apps={[]} />
    </>
  );
};

export default SmartknobIntegration;
