'use strict';
const core = require('@twind/core');
// indirection wrapper to remove autocomplete functions from production bundles
function withAutocomplete$(rule, autocomplete) {
    return core.withAutocomplete(rule, autocomplete);
}
const variants = [
    [
        'sticky',
        '@supports ((position: -webkit-sticky) or (position:sticky))'
    ],
    [
        'motion-reduce',
        '@media (prefers-reduced-motion:reduce)'
    ],
    [
        'motion-safe',
        '@media (prefers-reduced-motion:no-preference)'
    ],
    [
        'print',
        '@media print'
    ],
    [
        '(portrait|landscape)',
        ({ 1: $1  })=>`@media (orientation:${$1})`
    ],
    [
        'contrast-(more|less)',
        ({ 1: $1  })=>`@media (prefers-contrast:${$1})`
    ],
    [
        '(first-(letter|line)|placeholder|backdrop|before|after)',
        ({ 1: $1  })=>`&::${$1}`
    ],
    [
        '(marker|selection)',
        ({ 1: $1  })=>`& *::${$1},&::${$1}`
    ],
    [
        'file',
        '&::file-selector-button'
    ],
    [
        '(first|last|only)',
        ({ 1: $1  })=>`&:${$1}-child`
    ],
    [
        'even',
        '&:nth-child(2n)'
    ],
    [
        'odd',
        '&:nth-child(odd)'
    ],
    [
        'open',
        '&[open]'
    ],
    // All other pseudo classes are already supported by twind
    [
        '(aria|data)-',
        withAutocomplete$(({ 1: $1 , /* aria or data */ $$  }, /* everything after the dash */ context)=>$$ && `&[${$1}-${// aria-asc or data-checked -> from theme
            context.theme($1, $$) || // aria-[...] or data-[...]
            core.arbitrary($$, '', context) || // default handling
            `${$$}="true"`}]`, ({ 1: $1  }, { theme  })=>[
                ...new Set([
                    ...'aria' == $1 ? [
                        'checked',
                        'disabled',
                        'expanded',
                        'hidden',
                        'pressed',
                        'readonly',
                        'required',
                        'selected'
                    ] : [],
                    ...Object.keys(theme($1) || {})
                ])
            ].map((key)=>({
                    suffix: key,
                    label: `&[${$1}-${theme($1, key) || `${key}="true"`}]`,
                    theme: {
                        section: $1,
                        key
                    }
                })).concat([
                {
                    suffix: '[',
                    label: `&[${$1}-…]`
                }
            ]))
    ],
    /* Styling based on parent and peer state */ // Groups classes like: group-focus and group-hover
    // these need to add a marker selector with the pseudo class
    // => '.group:focus .group-focus:selector'
    [
        '((group|peer)(~[^-[]+)?)(-\\[(.+)]|[-[].+?)(\\/.+)?',
        withAutocomplete$(({ 2: type , 3: name = '' , 4: $4 , 5: $5 = '' , 6: label = name  }, { e , h , v  })=>{
            let selector = core.normalize($5) || ('[' == $4[0] ? $4 : v($4.slice(1)));
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            return `${(selector.includes('&') ? selector : '&' + selector).replace(/&/g, `:merge(.${e(h(type + label))})`)}${'p' == type[0] ? '~' : ' '}&`;
        }, (_, { variants  })=>Object.entries(variants).filter(([, selector])=>/^&(\[|:[^:])/.test(selector)).flatMap(([variant, selector])=>[
                    {
                        prefix: 'group-',
                        suffix: variant,
                        label: `${selector.replace('&', '.group')} &`,
                        modifiers: []
                    },
                    {
                        prefix: 'peer-',
                        suffix: variant,
                        label: `${selector.replace('&', '.peer')} &`,
                        modifiers: []
                    }
                ]))
    ],
    // direction variants
    [
        '(ltr|rtl)',
        withAutocomplete$(({ 1: $1  })=>`[dir="${$1}"] &`, ({ 1: $1  })=>[
                {
                    prefix: $1,
                    suffix: '',
                    label: `[dir="${$1}"] &`
                }
            ])
    ],
    [
        'supports-',
        withAutocomplete$(({ $$  }, /* everything after the dash */ context)=>{
            $$ && ($$ = context.theme('supports', $$) || core.arbitrary($$, '', context));
            if ($$) return $$.includes(':') || ($$ += ':var(--tw)'), /^\w*\s*\(/.test($$) || ($$ = `(${$$})`), // Chrome has a bug where `(condtion1)or(condition2)` is not valid
            // But `(condition1) or (condition2)` is supported.
            `@supports ${$$.replace(/\b(and|or|not)\b/g, ' $1 ').trim()}`;
        }, (_, { theme  })=>Object.keys(theme('supports') || {}).map((key)=>({
                    suffix: key,
                    theme: {
                        section: 'supports',
                        key
                    }
                })).concat([
                {
                    suffix: '[',
                    label: `@supports …`
                }
            ]))
    ],
    [
        'max-',
        withAutocomplete$(({ $$  }, context)=>{
            $$ && ($$ = context.theme('screens', $$) || core.arbitrary($$, '', context));
            if ('string' == typeof $$) return `@media not all and (min-width:${$$})`;
        }, (_, { theme  })=>Object.entries(theme('screens') || {}).filter(([, value])=>'string' == typeof value).map(([key, value])=>({
                    suffix: key,
                    label: `@media not all and (min-width:${value})`,
                    theme: {
                        section: 'screens',
                        key
                    }
                })).concat([
                {
                    suffix: '[',
                    label: `@media not all and (min-width: …)`
                }
            ]))
    ],
    [
        'min-',
        withAutocomplete$(({ $$  }, context)=>{
            return $$ && ($$ = core.arbitrary($$, '', context)), $$ && `@media (min-width:${$$})`;
        }, ()=>[
                {
                    suffix: '[',
                    label: `@media (min-width: …)`
                }
            ])
    ],
    // Arbitrary variants
    [
        /^\[(.+)]$/,
        ({ 1: $1  })=>/[&@]/.test($1) && core.normalize($1).replace(/[}]+$/, '').split('{')
    ]
];
module.exports = variants;
//# sourceMappingURL=variants.dev.cjs.map
