'use strict';
const baseTheme = require('./baseTheme.dev.cjs'), preflight = require('./preflight.dev.cjs'), rules = require('./rules.dev.cjs'), variants = require('./variants.dev.cjs');
module.exports = /** Allows to disable to tailwind preflight (default: `false` eg include the tailwind preflight ) */ /**
 * @experimental
 */ function({ colors , disablePreflight  } = {}) {
    return {
        // allow other preflight to run
        preflight: disablePreflight ? void 0 : preflight,
        theme: {
            ...baseTheme,
            colors: {
                inherit: 'inherit',
                current: 'currentColor',
                transparent: 'transparent',
                black: '#000',
                white: '#fff',
                ...colors
            }
        },
        variants,
        rules,
        finalize (rule) {
            return(// automatically add `content: ''` to before and after so you don’t have to specify it unless you want a different value
            // ignore global, preflight, and auto added rules
            rule.n && // only if there are declarations
            rule.d && // and it has a ::before or ::after selector
            rule.r.some((r)=>/^&::(before|after)$/.test(r)) && // there is no content property yet
            !/(^|;)content:/.test(rule.d) ? {
                ...rule,
                d: 'content:var(--tw-content);' + rule.d
            } : rule);
        }
    };
};
//# sourceMappingURL=base.dev.cjs.map
