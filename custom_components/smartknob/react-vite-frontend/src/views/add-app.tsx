import {
  AppListItem,
  AppSlug,
  EntitySelector,
  HomeAssistant,
  SelectOption,
  SelectSelector,
} from '@types';
import { getAsyncAppSlugs } from 'data/websockets';
import { subscribe } from 'events.ts';
import { useEffect, useRef, useState } from 'react';

const AddApp = ({
  hass,
  apps,
}: {
  hass: HomeAssistant;
  apps: AppListItem[];
}) => {
  const appSlugSelectorRef = useRef<any>(null);
  const entitySelectorRef = useRef<any>(null);

  // const appSlugs = [];
  const [appSlugs, setAppSlugs] = useState<AppSlug[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<AppSlug | undefined>(
    undefined,
  );

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

  const included_entity_ids: string[] = [...Object.values(hass.states)]
    .map((entity) => {
      if (
        !entity.entity_id.startsWith(selectedSlug?.domain ?? '') ||
        apps.find((app) => {
          if (
            selectedSlug?.slug == app.app.app_slug &&
            app.app.entity_id == entity.entity_id
          )
            return true;
          return false;
        })
      ) {
        return '';
      }
      return entity.entity_id;
    })
    .filter((e) => e != '')!;

  const entitySelector: EntitySelector = {
    entity: {
      include_entities: included_entity_ids,
    },
  };

  useEffect(() => {
    if (appSlugs.length == 0) {
      getAsyncAppSlugs(hass).then((res) => {
        if (res.success) {
          console.log(res);
          setAppSlugs(res.app_slugs);
        }
      });
    }

    if (appSlugSelectorRef.current) {
      let el: {
        hass: HomeAssistant;
        selector: SelectSelector;
        label: string;
      } & HTMLElement = appSlugSelectorRef.current;
      el.hass = hass;
      el.selector = slugSelector;
      el.label = 'Select an app';

      //TODO: make sure it only runs once.
      subscribe(el, 'value-changed', handleAppSlugChange);
    }

    if (entitySelectorRef.current) {
      let el: {
        hass: HomeAssistant;
        selector: EntitySelector;
        label: string;
      } & HTMLElement = entitySelectorRef.current;
      el.hass = hass;
      el.selector = entitySelector;
      el.label = 'Select an entity';

      //TODO: make sure it only runs once.
      el.addEventListener('value-changed', (e) => {
        console.log(e);
      });
    }
  }, [hass, appSlugs]);

  const handleAppSlugChange = (e: any) => {
    setSelectedSlug(appSlugs.find((slug) => slug.slug == e.detail.value));
    console.log(appSlugs);
  };

  return (
    <div className='container mx-auto p-4'>
      <ha-selector ref={appSlugSelectorRef} />
      <ha-selector ref={entitySelectorRef} />
    </div>
  );
};

export default AddApp;
