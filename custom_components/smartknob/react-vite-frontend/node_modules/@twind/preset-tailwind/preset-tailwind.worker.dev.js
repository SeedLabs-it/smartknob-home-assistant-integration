import presetTailwindBase from './base.worker.dev.js';
import { c as colors } from './_/colors-e5e84df2.js';
/** Allows to disable to tailwind preflight (default: `false` eg include the tailwind preflight ) */ function presetTailwind({ disablePreflight  } = {}) {
    return presetTailwindBase({
        colors,
        disablePreflight
    });
}
export { presetTailwind as default };
//# sourceMappingURL=preset-tailwind.worker.dev.js.map
