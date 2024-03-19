const events = {} as any;

function subscribe(
  el: HTMLElement,
  eventName: string,
  callback: (e: any) => void,
) {
  if (events[eventName]) {
    unsubscribe(el, eventName, callback);
    unsubscribeAll(el);
  }
  el.addEventListener(eventName, callback);
  events[eventName] = eventName;
}

function unsubscribe(
  el: HTMLElement,
  eventName: string,
  callback: (e: Event) => void,
) {
  el.removeEventListener(eventName, callback);
  delete events[eventName];
}

function unsubscribeAll(el: HTMLElement) {
  for (const eventName in events) {
    el.removeEventListener(eventName, () => {});
    delete events[eventName];
  }
}

export { subscribe, unsubscribe, unsubscribeAll };
