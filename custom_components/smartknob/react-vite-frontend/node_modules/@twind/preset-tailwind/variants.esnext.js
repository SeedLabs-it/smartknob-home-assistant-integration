import { normalize, arbitrary } from '@twind/core';
// indirection wrapper to remove autocomplete functions from production bundles
let variants = [
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
        ({ 1: $1 , /* aria or data */ $$  }, /* everything after the dash */ context)=>$$ && `&[${$1}-${// aria-asc or data-checked -> from theme
            context.theme($1, $$) || // aria-[...] or data-[...]
            arbitrary($$, '', context) || // default handling
            `${$$}="true"`}]`
    ],
    /* Styling based on parent and peer state */ // Groups classes like: group-focus and group-hover
    // these need to add a marker selector with the pseudo class
    // => '.group:focus .group-focus:selector'
    [
        '((group|peer)(~[^-[]+)?)(-\\[(.+)]|[-[].+?)(\\/.+)?',
        ({ 2: type , 3: name = '' , 4: $4 , 5: $5 = '' , 6: label = name  }, { e , h , v  })=>{
            let selector = normalize($5) || ('[' == $4[0] ? $4 : v($4.slice(1)));
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            return `${(selector.includes('&') ? selector : '&' + selector).replace(/&/g, `:merge(.${e(h(type + label))})`)}${'p' == type[0] ? '~' : ' '}&`;
        }
    ],
    // direction variants
    [
        '(ltr|rtl)',
        ({ 1: $1  })=>`[dir="${$1}"] &`
    ],
    [
        'supports-',
        ({ $$  }, /* everything after the dash */ context)=>{
            $$ &&= context.theme('supports', $$) || arbitrary($$, '', context);
            if ($$) return $$.includes(':') || ($$ += ':var(--tw)'), /^\w*\s*\(/.test($$) || ($$ = `(${$$})`), // Chrome has a bug where `(condtion1)or(condition2)` is not valid
            // But `(condition1) or (condition2)` is supported.
            `@supports ${$$.replace(/\b(and|or|not)\b/g, ' $1 ').trim()}`;
        }
    ],
    [
        'max-',
        ({ $$  }, context)=>{
            $$ &&= context.theme('screens', $$) || arbitrary($$, '', context);
            if ('string' == typeof $$) return `@media not all and (min-width:${$$})`;
        }
    ],
    [
        'min-',
        ({ $$  }, context)=>{
            return ($$ &&= arbitrary($$, '', context)) && `@media (min-width:${$$})`;
        }
    ],
    // Arbitrary variants
    [
        /^\[(.+)]$/,
        ({ 1: $1  })=>/[&@]/.test($1) && normalize($1).replace(/[}]+$/, '').split('{')
    ]
];
export { variants as default };
//# sourceMappingURL=variants.esnext.js.map
