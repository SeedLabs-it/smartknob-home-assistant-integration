'use strict';
const base = require('./base.dev.cjs'), colors = require('./_/colors-c941ebd8.cjs');
module.exports = /** Allows to disable to tailwind preflight (default: `false` eg include the tailwind preflight ) */ function({ disablePreflight  } = {}) {
    return base({
        colors: colors.colors,
        disablePreflight
    });
};
//# sourceMappingURL=preset-tailwind.dev.cjs.map
