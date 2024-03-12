import theme from './baseTheme.browser.js';
import preflight from './preflight.browser.js';
import rules from './rules.browser.js';
import variants from './variants.browser.js';
/** Allows to disable to tailwind preflight (default: `false` eg include the tailwind preflight ) */ /**
 * @experimental
 */ function presetTailwindBase({ colors , disablePreflight  } = {}) {
    return {
        // allow other preflight to run
        preflight: disablePreflight ? void 0 : preflight,
        theme: {
            ...theme,
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
}
export { presetTailwindBase as default };
//# sourceMappingURL=base.browser.js.map
