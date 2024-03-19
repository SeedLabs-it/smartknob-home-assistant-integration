// import r2wc from '@r2wc/react-to-web-component';
import SmartknobIntegration from './App';
import reactToCustomElementTailwind from 'SmartknobRenderer';

customElements.define(
  'smartknob-integration',
  reactToCustomElementTailwind(SmartknobIntegration),
);
