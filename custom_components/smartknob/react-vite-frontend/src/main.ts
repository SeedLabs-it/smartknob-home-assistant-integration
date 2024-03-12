import r2wc from '@r2wc/react-to-web-component';
import App from './App';
// import { loadHa } from './load-ha-elements';

// loadHa();

const HelloWC = r2wc(App, {
  props: { hass: 'string', narrow: 'boolean' },
});

customElements.define('hello-wc', HelloWC);
