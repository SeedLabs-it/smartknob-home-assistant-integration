import presetTailwindBase from './base.js';
import { colors } from './_/colors-16fd59b8.js';
/** Allows to disable to tailwind preflight (default: `false` eg include the tailwind preflight ) */ function presetTailwind({ disablePreflight  } = {}) {
    return presetTailwindBase({
        colors,
        disablePreflight
    });
}
export { presetTailwind as default };
//# sourceMappingURL=preset-tailwind.js.map
