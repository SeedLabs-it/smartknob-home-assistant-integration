import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import '../components/SkReorderableList/SkReorderableList.ts';
// import { selectSelector } from '../const';

import install from '@twind/with-web-components';
import config from '../../twind.config.ts';

const withTwind = install(config);

@customElement('config-view')
export class Config extends withTwind(LitElement) {
  render() {
    return html` <div>config</div> `;
  }
}
