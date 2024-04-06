import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../components/SkReorderableList/SkReorderableList.ts';
// import { selectSelector } from '../const';

import install from '@twind/with-web-components';
import config from '@/twind.config.ts';
import { HomeAssistant } from '@/src/types.ts';

const withTwind = install(config);

@customElement('app-form')
export class AppForm extends withTwind(LitElement) {
  @property({ type: Object }) hass!: HomeAssistant;

  connectedCallback(): void {
    super.connectedCallback();
  }

  render() {
    return html` <h2>SmartKnob Configuration</h2> `;
  }
}
