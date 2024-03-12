var // indirection wrapper to remove autocomplete functions from production bundles
rule, rule1, rule2, rule3, rule4, rule5, rule6, rule7, rule8, rule9, rule10, rule11, rule12, rule13, rule14, rule15, rule16, rule17;
import { match, arbitrary, matchTheme, mql, asArray, matchColor, toColorValue, toCSS, withAutocomplete } from '@twind/core';
let rules = [
    /* arbitrary properties: [paint-order:markers] */ match('\\[([-\\w]+):(.+)]', ({ 1: $1 , 2: $2  }, context)=>({
            '@layer overrides': {
                '&': {
                    [$1]: arbitrary(`[${$2}]`, '', context)
                }
            }
        })),
    (rule = /* Styling based on parent and peer state */ match('(group|peer)([~/][^-[]+)?', ({ input  }, { h  })=>[
            {
                c: h(input)
            }
        ]), withAutocomplete(rule, ()=>[
            'group',
            'peer'
        ])),
    /* LAYOUT */ matchTheme('aspect-', 'aspectRatio'),
    match('container', (_, { theme  })=>{
        let { screens =theme('screens') , center , padding  } = theme('container'), rules = {
            width: '100%',
            marginRight: center && 'auto',
            marginLeft: center && 'auto',
            ...paddingFor('xs')
        };
        for(let screen in screens){
            let value = screens[screen];
            'string' == typeof value && (rules[mql(value)] = {
                '&': {
                    maxWidth: value,
                    ...paddingFor(screen)
                }
            });
        }
        return rules;
        function paddingFor(screen) {
            let value = padding && ('string' == typeof padding ? padding : padding[screen] || padding.DEFAULT);
            if (value) return {
                paddingRight: value,
                paddingLeft: value
            };
        }
    }),
    // Content
    matchTheme('content-', 'content', ({ _  })=>({
            '--tw-content': _,
            content: 'var(--tw-content)'
        })),
    // Box Decoration Break
    match('(?:box-)?decoration-(slice|clone)', 'boxDecorationBreak'),
    // Box Sizing
    match('box-(border|content)', 'boxSizing', ({ 1: $1  })=>$1 + '-box'),
    // Display
    match('hidden', {
        display: 'none'
    }),
    // Table Layout
    match('table-(auto|fixed)', 'tableLayout'),
    match([
        '(block|flex|table|grid|inline|contents|flow-root|list-item)',
        '(inline-(block|flex|table|grid))',
        '(table-(caption|cell|column|row|(column|row|footer|header)-group))'
    ], 'display'),
    // Floats
    '(float)-(left|right|none)',
    // Clear
    '(clear)-(left|right|none|both)',
    // Overflow
    '(overflow(?:-[xy])?)-(auto|hidden|clip|visible|scroll)',
    // Isolation
    '(isolation)-(auto)',
    // Isolation
    match('isolate', 'isolation'),
    // Object Fit
    match('object-(contain|cover|fill|none|scale-down)', 'objectFit'),
    // Object Position
    matchTheme('object-', 'objectPosition'),
    match('object-(top|bottom|center|(left|right)(-(top|bottom))?)', 'objectPosition', spacify),
    // Overscroll Behavior
    match('overscroll(-[xy])?-(auto|contain|none)', ({ 1: $1 = '' , 2: $2  })=>({
            ['overscroll-behavior' + $1]: $2
        })),
    // Position
    match('(static|fixed|absolute|relative|sticky)', 'position'),
    // Top / Right / Bottom / Left
    matchTheme('-?inset(-[xy])?(?:$|-)', 'inset', ({ 1: $1 , _  })=>({
            top: '-x' != $1 && _,
            right: '-y' != $1 && _,
            bottom: '-x' != $1 && _,
            left: '-y' != $1 && _
        })),
    matchTheme('-?(top|bottom|left|right)(?:$|-)', 'inset'),
    // Visibility
    match('(visible|collapse)', 'visibility'),
    match('invisible', {
        visibility: 'hidden'
    }),
    // Z-Index
    matchTheme('-?z-', 'zIndex'),
    /* FLEXBOX */ // Flex Direction
    match('flex-((row|col)(-reverse)?)', 'flexDirection', columnify),
    match('flex-(wrap|wrap-reverse|nowrap)', 'flexWrap'),
    matchTheme('(flex-(?:grow|shrink))(?:$|-)'),
    /*, 'flex-grow' | flex-shrink */ matchTheme('(flex)-'),
    /*, 'flex' */ matchTheme('grow(?:$|-)', 'flexGrow'),
    matchTheme('shrink(?:$|-)', 'flexShrink'),
    matchTheme('basis-', 'flexBasis'),
    matchTheme('-?(order)-'),
    withAutocomplete(/*, 'order' */ '-?(order)-(\\d+)', ()=>range({
            end: 12
        })),
    /* GRID */ // Grid Template Columns
    matchTheme('grid-cols-', 'gridTemplateColumns'),
    (rule1 = match('grid-cols-(\\d+)', 'gridTemplateColumns', gridTemplate), withAutocomplete(rule1, ()=>range({
            end: 6
        }))),
    // Grid Column Start / End
    matchTheme('col-', 'gridColumn'),
    (rule2 = match('col-(span)-(\\d+)', 'gridColumn', span), withAutocomplete(rule2, ()=>range({
            end: 12
        }))),
    matchTheme('col-start-', 'gridColumnStart'),
    (rule3 = match('col-start-(auto|\\d+)', 'gridColumnStart'), withAutocomplete(rule3, ({ 1: $1  })=>'auto' === $1 ? [
            ''
        ] : range({
            end: 13
        }))),
    matchTheme('col-end-', 'gridColumnEnd'),
    (rule4 = match('col-end-(auto|\\d+)', 'gridColumnEnd'), withAutocomplete(rule4, ({ 1: $1  })=>'auto' === $1 ? [
            ''
        ] : range({
            end: 13
        }))),
    // Grid Template Rows
    matchTheme('grid-rows-', 'gridTemplateRows'),
    (rule5 = match('grid-rows-(\\d+)', 'gridTemplateRows', gridTemplate), withAutocomplete(rule5, ()=>range({
            end: 6
        }))),
    // Grid Row Start / End
    matchTheme('row-', 'gridRow'),
    (rule6 = match('row-(span)-(\\d+)', 'gridRow', span), withAutocomplete(rule6, ()=>range({
            end: 6
        }))),
    matchTheme('row-start-', 'gridRowStart'),
    (rule7 = match('row-start-(auto|\\d+)', 'gridRowStart'), withAutocomplete(rule7, ({ 1: $1  })=>'auto' === $1 ? [
            ''
        ] : range({
            end: 7
        }))),
    matchTheme('row-end-', 'gridRowEnd'),
    (rule8 = match('row-end-(auto|\\d+)', 'gridRowEnd'), withAutocomplete(rule8, ({ 1: $1  })=>'auto' === $1 ? [
            ''
        ] : range({
            end: 7
        }))),
    // Grid Auto Flow
    match('grid-flow-((row|col)(-dense)?)', 'gridAutoFlow', (match)=>spacify(columnify(match))),
    match('grid-flow-(dense)', 'gridAutoFlow'),
    // Grid Auto Columns
    matchTheme('auto-cols-', 'gridAutoColumns'),
    // Grid Auto Rows
    matchTheme('auto-rows-', 'gridAutoRows'),
    // Gap
    matchTheme('gap-x(?:$|-)', 'gap', 'columnGap'),
    matchTheme('gap-y(?:$|-)', 'gap', 'rowGap'),
    matchTheme('gap(?:$|-)', 'gap'),
    withAutocomplete(/* BOX ALIGNMENT */ // Justify Items
    // Justify Self
    '(justify-(?:items|self))-', ({ 1: $1  })=>$1.endsWith('-items-') ? [
            'start',
            'end',
            'center',
            'stretch'
        ] : /* '-self-' */ [
            'auto',
            'start',
            'end',
            'center',
            'stretch'
        ]),
    (rule9 = // Justify Content
    match('justify-', 'justifyContent', convertContentValue), withAutocomplete(rule9, ()=>[
            'start',
            'end',
            'center',
            'between',
            'around',
            'evenly'
        ])),
    (rule10 = // Align Content
    // Align Items
    // Align Self
    match('(content|items|self)-', (match)=>({
            ['align-' + match[1]]: convertContentValue(match)
        })), withAutocomplete(rule10, ({ 1: $1  })=>'content' == $1 ? [
            'center',
            'start',
            'end',
            'between',
            'around',
            'evenly',
            'stretch',
            'baseline'
        ] : 'items' == $1 ? [
            'start',
            'end',
            'center',
            'stretch',
            'baseline'
        ] : /* $1 == 'self' */ [
            'auto',
            'start',
            'end',
            'center',
            'stretch',
            'baseline'
        ])),
    (rule11 = // Place Content
    // Place Items
    // Place Self
    match('(place-(content|items|self))-', ({ 1: $1 , $$  })=>({
            [$1]: ('wun'.includes($$[3]) ? 'space-' : '') + $$
        })), withAutocomplete(rule11, ({ 2: $2  })=>'content' == $2 ? [
            'center',
            'start',
            'end',
            'between',
            'around',
            'evenly',
            'stretch',
            'baseline'
        ] : 'items' == $2 ? [
            'start',
            'end',
            'center',
            'stretch',
            'baseline'
        ] : /* $2 == 'self' */ [
            'auto',
            'start',
            'end',
            'center',
            'stretch',
            'baseline'
        ])),
    /* SPACING */ // Padding
    matchTheme('p([xytrbl])?(?:$|-)', 'padding', edge('padding')),
    // Margin
    matchTheme('-?m([xytrbl])?(?:$|-)', 'margin', edge('margin')),
    // Space Between
    matchTheme('-?space-(x|y)(?:$|-)', 'space', ({ 1: $1 , _  })=>({
            '&>:not([hidden])~:not([hidden])': {
                [`--tw-space-${$1}-reverse`]: '0',
                ['margin-' + ({
                    y: 'top',
                    x: 'left'
                })[$1]]: `calc(${_} * calc(1 - var(--tw-space-${$1}-reverse)))`,
                ['margin-' + ({
                    y: 'bottom',
                    x: 'right'
                })[$1]]: `calc(${_} * var(--tw-space-${$1}-reverse))`
            }
        })),
    match('space-(x|y)-reverse', ({ 1: $1  })=>({
            '&>:not([hidden])~:not([hidden])': {
                [`--tw-space-${$1}-reverse`]: '1'
            }
        })),
    /* SIZING */ // Width
    matchTheme('w-', 'width'),
    // Min-Width
    matchTheme('min-w-', 'minWidth'),
    // Max-Width
    matchTheme('max-w-', 'maxWidth'),
    // Height
    matchTheme('h-', 'height'),
    // Min-Height
    matchTheme('min-h-', 'minHeight'),
    // Max-Height
    matchTheme('max-h-', 'maxHeight'),
    /* TYPOGRAPHY */ // Font Weight
    matchTheme('font-', 'fontWeight'),
    // Font Family
    matchTheme('font-', 'fontFamily', ({ _  })=>{
        return 'string' == typeof (_ = asArray(_))[1] ? {
            fontFamily: join(_)
        } : {
            fontFamily: join(_[0]),
            ..._[1]
        };
    }),
    // Font Smoothing
    match('antialiased', {
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale'
    }),
    match('subpixel-antialiased', {
        WebkitFontSmoothing: 'auto',
        MozOsxFontSmoothing: 'auto'
    }),
    // Font Style
    match('italic', 'fontStyle'),
    match('not-italic', {
        fontStyle: 'normal'
    }),
    // Font Variant Numeric
    match('(ordinal|slashed-zero|(normal|lining|oldstyle|proportional|tabular)-nums|(diagonal|stacked)-fractions)', ({ 1: $1 , 2: $2 = '' , 3: $3  })=>// normal-nums
        'normal' == $2 ? {
            fontVariantNumeric: 'normal'
        } : {
            ['--tw-' + ($3 ? // diagonal-fractions, stacked-fractions
            'numeric-fraction' : 'pt'.includes($2[0]) ? // proportional-nums, tabular-nums
            'numeric-spacing' : $2 ? // lining-nums, oldstyle-nums
            'numeric-figure' : // ordinal, slashed-zero
            $1)]: $1,
            fontVariantNumeric: 'var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction)',
            ...asDefaults({
                '--tw-ordinal': 'var(--tw-empty,/*!*/ /*!*/)',
                '--tw-slashed-zero': 'var(--tw-empty,/*!*/ /*!*/)',
                '--tw-numeric-figure': 'var(--tw-empty,/*!*/ /*!*/)',
                '--tw-numeric-spacing': 'var(--tw-empty,/*!*/ /*!*/)',
                '--tw-numeric-fraction': 'var(--tw-empty,/*!*/ /*!*/)'
            })
        }),
    // Letter Spacing
    matchTheme('tracking-', 'letterSpacing'),
    // Line Height
    matchTheme('leading-', 'lineHeight'),
    // List Style Position
    match('list-(inside|outside)', 'listStylePosition'),
    // List Style Type
    matchTheme('list-', 'listStyleType'),
    (rule12 = match('list-', 'listStyleType'), withAutocomplete(rule12, ()=>[
            'none',
            'disc',
            'decimal'
        ])),
    // Placeholder Opacity
    matchTheme('placeholder-opacity-', 'placeholderOpacity', ({ _  })=>({
            '&::placeholder': {
                '--tw-placeholder-opacity': _
            }
        })),
    // Placeholder Color
    matchColor('placeholder-', {
        property: 'color',
        selector: '&::placeholder'
    }),
    // Text Alignment
    match('text-(left|center|right|justify|start|end)', 'textAlign'),
    match('text-(ellipsis|clip)', 'textOverflow'),
    // Text Opacity
    matchTheme('text-opacity-', 'textOpacity', '--tw-text-opacity'),
    // Text Color
    matchColor('text-', {
        property: 'color'
    }),
    // Font Size
    matchTheme('text-', 'fontSize', ({ _  })=>'string' == typeof _ ? {
            fontSize: _
        } : {
            fontSize: _[0],
            ...'string' == typeof _[1] ? {
                lineHeight: _[1]
            } : _[1]
        }),
    // Text Indent
    matchTheme('indent-', 'textIndent'),
    // Text Decoration
    match('(overline|underline|line-through)', 'textDecorationLine'),
    match('no-underline', {
        textDecorationLine: 'none'
    }),
    // Text Underline offset
    matchTheme('underline-offset-', 'textUnderlineOffset'),
    // Text Decoration Color
    matchColor('decoration-', {
        section: 'textDecorationColor',
        opacityVariable: false,
        opacitySection: 'opacity'
    }),
    // Text Decoration Thickness
    matchTheme('decoration-', 'textDecorationThickness'),
    (rule13 = // Text Decoration Style
    match('decoration-', 'textDecorationStyle'), withAutocomplete(rule13, ()=>[
            'solid',
            'double',
            'dotted',
            'dashed',
            'wavy'
        ])),
    // Text Transform
    match('(uppercase|lowercase|capitalize)', 'textTransform'),
    match('normal-case', {
        textTransform: 'none'
    }),
    // Text Overflow
    match('truncate', {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
    }),
    (rule14 = // Vertical Alignment
    match('align-', 'verticalAlign'), withAutocomplete(rule14, ()=>[
            'baseline',
            'top',
            'middle',
            'bottom',
            'text-top',
            'text-bottom',
            'sub',
            'super'
        ])),
    (rule15 = // Whitespace
    match('whitespace-', 'whiteSpace'), withAutocomplete(rule15, ()=>[
            'normal',
            'nowrap',
            'pre',
            'pre-line',
            'pre-wrap'
        ])),
    // Word Break
    match('break-normal', {
        wordBreak: 'normal',
        overflowWrap: 'normal'
    }),
    match('break-words', {
        overflowWrap: 'break-word'
    }),
    match('break-all', {
        wordBreak: 'break-all'
    }),
    match('break-keep', {
        wordBreak: 'keep-all'
    }),
    // Caret Color
    matchColor('caret-', {
        // section: 'caretColor',
        opacityVariable: false,
        opacitySection: 'opacity'
    }),
    // Accent Color
    matchColor('accent-', {
        // section: 'accentColor',
        opacityVariable: false,
        opacitySection: 'opacity'
    }),
    // Gradient Color Stops
    match('bg-gradient-to-([trbl]|[tb][rl])', 'backgroundImage', ({ 1: $1  })=>`linear-gradient(to ${position($1, ' ')},var(--tw-gradient-stops))`),
    matchColor('from-', {
        section: 'gradientColorStops',
        opacityVariable: false,
        opacitySection: 'opacity'
    }, ({ _  })=>({
            '--tw-gradient-from': _.value,
            '--tw-gradient-to': _.color({
                opacityValue: '0'
            }),
            '--tw-gradient-stops': "var(--tw-gradient-from),var(--tw-gradient-to)"
        })),
    matchColor('via-', {
        section: 'gradientColorStops',
        opacityVariable: false,
        opacitySection: 'opacity'
    }, ({ _  })=>({
            '--tw-gradient-to': _.color({
                opacityValue: '0'
            }),
            '--tw-gradient-stops': `var(--tw-gradient-from),${_.value},var(--tw-gradient-to)`
        })),
    matchColor('to-', {
        section: 'gradientColorStops',
        property: '--tw-gradient-to',
        opacityVariable: false,
        opacitySection: 'opacity'
    }),
    /* BACKGROUNDS */ // Background Attachment
    match('bg-(fixed|local|scroll)', 'backgroundAttachment'),
    // Background Origin
    match('bg-origin-(border|padding|content)', 'backgroundOrigin', ({ 1: $1  })=>$1 + '-box'),
    // Background Repeat
    match([
        'bg-(no-repeat|repeat(-[xy])?)',
        'bg-repeat-(round|space)'
    ], 'backgroundRepeat'),
    (rule16 = // Background Blend Mode
    match('bg-blend-', 'backgroundBlendMode'), withAutocomplete(rule16, ()=>[
            'normal',
            'multiply',
            'screen',
            'overlay',
            'darken',
            'lighten',
            'color-dodge',
            'color-burn',
            'hard-light',
            'soft-light',
            'difference',
            'exclusion',
            'hue',
            'saturation',
            'color',
            'luminosity'
        ])),
    // Background Clip
    match('bg-clip-(border|padding|content|text)', 'backgroundClip', ({ 1: $1  })=>$1 + ('text' == $1 ? '' : '-box')),
    // Background Opacity
    matchTheme('bg-opacity-', 'backgroundOpacity', '--tw-bg-opacity'),
    // Background Color
    // bg-${backgroundColor}/${backgroundOpacity}
    matchColor('bg-', {
        section: 'backgroundColor'
    }),
    // Background Image
    // supported arbitrary types are: length, color, angle, list
    matchTheme('bg-', 'backgroundImage'),
    // Background Position
    matchTheme('bg-', 'backgroundPosition'),
    match('bg-(top|bottom|center|(left|right)(-(top|bottom))?)', 'backgroundPosition', spacify),
    // Background Size
    matchTheme('bg-', 'backgroundSize'),
    /* BORDERS */ // Border Radius
    matchTheme('rounded(?:$|-)', 'borderRadius'),
    matchTheme('rounded-([trbl]|[tb][rl])(?:$|-)', 'borderRadius', ({ 1: $1 , _  })=>{
        let corners = {
            t: [
                'tl',
                'tr'
            ],
            r: [
                'tr',
                'br'
            ],
            b: [
                'bl',
                'br'
            ],
            l: [
                'bl',
                'tl'
            ]
        }[$1] || [
            $1,
            $1
        ];
        return {
            [`border-${position(corners[0])}-radius`]: _,
            [`border-${position(corners[1])}-radius`]: _
        };
    }),
    // Border Collapse
    match('border-(collapse|separate)', 'borderCollapse'),
    // Border Opacity
    matchTheme('border-opacity(?:$|-)', 'borderOpacity', '--tw-border-opacity'),
    // Border Style
    match('border-(solid|dashed|dotted|double|none)', 'borderStyle'),
    // Border Spacing
    matchTheme('border-spacing(-[xy])?(?:$|-)', 'borderSpacing', ({ 1: $1 , _  })=>({
            ...asDefaults({
                '--tw-border-spacing-x': '0',
                '--tw-border-spacing-y': '0'
            }),
            ['--tw-border-spacing' + ($1 || '-x')]: _,
            ['--tw-border-spacing' + ($1 || '-y')]: _,
            'border-spacing': 'var(--tw-border-spacing-x) var(--tw-border-spacing-y)'
        })),
    // Border Color
    matchColor('border-([xytrbl])-', {
        section: 'borderColor'
    }, edge('border', 'Color')),
    matchColor('border-'),
    // Border Width
    matchTheme('border-([xytrbl])(?:$|-)', 'borderWidth', edge('border', 'Width')),
    matchTheme('border(?:$|-)', 'borderWidth'),
    // Divide Opacity
    matchTheme('divide-opacity(?:$|-)', 'divideOpacity', ({ _  })=>({
            '&>:not([hidden])~:not([hidden])': {
                '--tw-divide-opacity': _
            }
        })),
    // Divide Style
    match('divide-(solid|dashed|dotted|double|none)', ({ 1: $1  })=>({
            '&>:not([hidden])~:not([hidden])': {
                borderStyle: $1
            }
        })),
    // Divide Width
    match('divide-([xy]-reverse)', ({ 1: $1  })=>({
            '&>:not([hidden])~:not([hidden])': {
                ['--tw-divide-' + $1]: '1'
            }
        })),
    matchTheme('divide-([xy])(?:$|-)', 'divideWidth', ({ 1: $1 , _  })=>{
        let edges = {
            x: 'lr',
            y: 'tb'
        }[$1];
        return {
            '&>:not([hidden])~:not([hidden])': {
                [`--tw-divide-${$1}-reverse`]: '0',
                [`border-${position(edges[0])}Width`]: `calc(${_} * calc(1 - var(--tw-divide-${$1}-reverse)))`,
                [`border-${position(edges[1])}Width`]: `calc(${_} * var(--tw-divide-${$1}-reverse))`
            }
        };
    }),
    // Divide Color
    matchColor('divide-', {
        // section: $0.replace('-', 'Color') -> 'divideColor'
        property: 'borderColor',
        // opacityVariable: '--tw-border-opacity',
        // opacitySection: section.replace('Color', 'Opacity') -> 'divideOpacity'
        selector: '&>:not([hidden])~:not([hidden])'
    }),
    // Ring Offset Opacity
    matchTheme('ring-opacity(?:$|-)', 'ringOpacity', '--tw-ring-opacity'),
    // Ring Offset Color
    matchColor('ring-offset-', {
        // section: 'ringOffsetColor',
        property: '--tw-ring-offset-color',
        opacityVariable: false
    }),
    // opacitySection: section.replace('Color', 'Opacity') -> 'ringOffsetOpacity'
    // Ring Offset Width
    matchTheme('ring-offset(?:$|-)', 'ringOffsetWidth', '--tw-ring-offset-width'),
    // Ring Inset
    match('ring-inset', {
        '--tw-ring-inset': 'inset'
    }),
    // Ring Color
    matchColor('ring-', {
        // section: 'ringColor',
        property: '--tw-ring-color'
    }),
    // opacityVariable: '--tw-ring-opacity',
    // opacitySection: section.replace('Color', 'Opacity') -> 'ringOpacity'
    // Ring Width
    matchTheme('ring(?:$|-)', 'ringWidth', ({ _  }, { theme  })=>({
            ...asDefaults({
                '--tw-ring-offset-shadow': '0 0 #0000',
                '--tw-ring-shadow': '0 0 #0000',
                '--tw-shadow': '0 0 #0000',
                '--tw-shadow-colored': '0 0 #0000',
                // Within own declaration to have the defaults above to be merged with defaults from shadow
                '&': {
                    '--tw-ring-inset': 'var(--tw-empty,/*!*/ /*!*/)',
                    '--tw-ring-offset-width': theme('ringOffsetWidth', '', '0px'),
                    '--tw-ring-offset-color': toColorValue(theme('ringOffsetColor', '', '#fff')),
                    '--tw-ring-color': toColorValue(theme('ringColor', '', '#93c5fd'), {
                        opacityVariable: '--tw-ring-opacity'
                    }),
                    '--tw-ring-opacity': theme('ringOpacity', '', '0.5')
                }
            }),
            '--tw-ring-offset-shadow': "var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)",
            '--tw-ring-shadow': `var(--tw-ring-inset) 0 0 0 calc(${_} + var(--tw-ring-offset-width)) var(--tw-ring-color)`,
            boxShadow: "var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)"
        })),
    /* EFFECTS */ // Box Shadow Color
    matchColor('shadow-', {
        section: 'boxShadowColor',
        opacityVariable: false,
        opacitySection: 'opacity'
    }, ({ _  })=>({
            '--tw-shadow-color': _.value,
            '--tw-shadow': 'var(--tw-shadow-colored)'
        })),
    // Box Shadow
    matchTheme('shadow(?:$|-)', 'boxShadow', ({ _  })=>({
            ...asDefaults({
                '--tw-ring-offset-shadow': '0 0 #0000',
                '--tw-ring-shadow': '0 0 #0000',
                '--tw-shadow': '0 0 #0000',
                '--tw-shadow-colored': '0 0 #0000'
            }),
            '--tw-shadow': join(_),
            // replace all colors with reference to --tw-shadow-colored
            // this matches colors after non-comma char (keyword, offset) before comma or the end
            '--tw-shadow-colored': join(_).replace(/([^,]\s+)(?:#[a-f\d]+|(?:(?:hsl|rgb)a?|hwb|lab|lch|color|var)\(.+?\)|[a-z]+)(,|$)/g, '$1var(--tw-shadow-color)$2'),
            boxShadow: "var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)"
        })),
    // Opacity
    matchTheme('(opacity)-'),
    (rule17 = /*, 'opacity' */ // Mix Blend Mode
    match('mix-blend-', 'mixBlendMode'), withAutocomplete(rule17, ()=>[
            'normal',
            'multiply',
            'screen',
            'overlay',
            'darken',
            'lighten',
            'color-dodge',
            'color-burn',
            'hard-light',
            'soft-light',
            'difference',
            'exclusion',
            'hue',
            'saturation',
            'color',
            'luminosity'
        ])),
    /* FILTERS */ ...filter(),
    ...filter('backdrop-'),
    /* TRANSITIONS AND ANIMATION */ // Transition Property
    matchTheme('transition(?:$|-)', 'transitionProperty', (match, { theme  })=>({
            transitionProperty: join(match),
            transitionTimingFunction: 'none' == match._ ? void 0 : join(theme('transitionTimingFunction', '')),
            transitionDuration: 'none' == match._ ? void 0 : join(theme('transitionDuration', ''))
        })),
    // Transition Duration
    matchTheme('duration(?:$|-)', 'transitionDuration', 'transitionDuration', join),
    // Transition Timing Function
    matchTheme('ease(?:$|-)', 'transitionTimingFunction', 'transitionTimingFunction', join),
    // Transition Delay
    matchTheme('delay(?:$|-)', 'transitionDelay', 'transitionDelay', join),
    matchTheme('animate(?:$|-)', 'animation', (match, { theme , h , e  })=>{
        let animation = join(match), // Try to auto inject keyframes
        parts = animation.split(' '), keyframeValues = theme('keyframes', parts[0]);
        return keyframeValues ? {
            ['@keyframes ' + (parts[0] = e(h(parts[0])))]: keyframeValues,
            animation: parts.join(' ')
        } : {
            animation
        };
    }),
    /* TRANSFORMS */ // Transform
    '(transform)-(none)',
    match('transform', tranformDefaults),
    match('transform-(cpu|gpu)', ({ 1: $1  })=>({
            '--tw-transform': transformValue('gpu' == $1)
        })),
    // Scale
    matchTheme('scale(-[xy])?-', 'scale', ({ 1: $1 , _  })=>({
            ['--tw-scale' + ($1 || '-x')]: _,
            ['--tw-scale' + ($1 || '-y')]: _,
            ...tranformDefaults()
        })),
    // Rotate
    matchTheme('-?(rotate)-', 'rotate', transform),
    // Translate
    matchTheme('-?(translate-[xy])-', 'translate', transform),
    // Skew
    matchTheme('-?(skew-[xy])-', 'skew', transform),
    // Transform Origin
    match('origin-(center|((top|bottom)(-(left|right))?)|left|right)', 'transformOrigin', spacify),
    withAutocomplete(/* INTERACTIVITY */ // Appearance
    '(appearance)-', ()=>[
            'auto',
            'none'
        ]),
    // Columns
    matchTheme('(columns)-'),
    withAutocomplete(/*, 'columns' */ '(columns)-(\\d+)', ()=>range({
            end: 12
        })),
    withAutocomplete(// Break Before, After and Inside
    '(break-(?:before|after|inside))-', ({ 1: $1  })=>$1.endsWith('-inside-') ? [
            'auto',
            'avoid',
            'avoid-page',
            'avoid-column'
        ] : /* before || after */ [
            'auto',
            'avoid',
            'all',
            'avoid-page',
            'page',
            'left',
            'right',
            'column'
        ]),
    // Cursor
    matchTheme('(cursor)-'),
    withAutocomplete(/*, 'cursor' */ '(cursor)-', ()=>[
            'alias',
            'all-scroll',
            'auto',
            'cell',
            'col-resize',
            'context-menu',
            'copy',
            'crosshair',
            'default',
            'e-resize',
            'ew-resize',
            'grab',
            'grabbing',
            'help',
            'move',
            'n-resize',
            'ne-resize',
            'nesw-resize',
            'no-drop',
            'none',
            'not-allowed',
            'ns-resize',
            'nw-resize',
            'nwse-resize',
            'pointer',
            'progress',
            'row-resize',
            's-resize',
            'se-resize',
            'sw-resize',
            'text',
            'vertical-text',
            'w-resize',
            'wait',
            'zoom-in',
            'zoom-out'
        ]),
    // Scroll Snap Type
    match('snap-(none)', 'scroll-snap-type'),
    match('snap-(x|y|both)', ({ 1: $1  })=>({
            ...asDefaults({
                '--tw-scroll-snap-strictness': 'proximity'
            }),
            'scroll-snap-type': $1 + ' var(--tw-scroll-snap-strictness)'
        })),
    match('snap-(mandatory|proximity)', '--tw-scroll-snap-strictness'),
    // Scroll Snap Align
    match('snap-(?:(start|end|center)|align-(none))', 'scroll-snap-align'),
    // Scroll Snap Stop
    match('snap-(normal|always)', 'scroll-snap-stop'),
    match('scroll-(auto|smooth)', 'scroll-behavior'),
    // Scroll Margin
    // Padding
    matchTheme('scroll-p([xytrbl])?(?:$|-)', 'padding', edge('scroll-padding')),
    // Margin
    matchTheme('-?scroll-m([xytrbl])?(?:$|-)', 'scroll-margin', edge('scroll-margin')),
    // Touch Action
    match('touch-(auto|none|manipulation)', 'touch-action'),
    match('touch-(pinch-zoom|pan-(?:(x|left|right)|(y|up|down)))', ({ 1: $1 , 2: $2 , 3: $3  })=>({
            ...asDefaults({
                '--tw-pan-x': 'var(--tw-empty,/*!*/ /*!*/)',
                '--tw-pan-y': 'var(--tw-empty,/*!*/ /*!*/)',
                '--tw-pinch-zoom': 'var(--tw-empty,/*!*/ /*!*/)',
                '--tw-touch-action': 'var(--tw-pan-x) var(--tw-pan-y) var(--tw-pinch-zoom)'
            }),
            // x, left, right -> pan-x
            // y, up, down -> pan-y
            // -> pinch-zoom
            [`--tw-${$2 ? 'pan-x' : $3 ? 'pan-y' : $1}`]: $1,
            'touch-action': 'var(--tw-touch-action)'
        })),
    // Outline Style
    match('outline-none', {
        outline: '2px solid transparent',
        'outline-offset': '2px'
    }),
    match('outline', {
        outlineStyle: 'solid'
    }),
    match('outline-(dashed|dotted|double)', 'outlineStyle'),
    // Outline Offset
    matchTheme('-?(outline-offset)-'),
    /*, 'outlineOffset'*/ // Outline Color
    matchColor('outline-', {
        opacityVariable: false,
        opacitySection: 'opacity'
    }),
    // Outline Width
    matchTheme('outline-', 'outlineWidth'),
    withAutocomplete(// Pointer Events
    '(pointer-events)-', ()=>[
            'auto',
            'none'
        ]),
    // Will Change
    matchTheme('(will-change)-'),
    withAutocomplete(/*, 'willChange' */ '(will-change)-', ()=>[
            'auto',
            'contents',
            'transform'
        ]),
    // Resize
    [
        'resize(?:-(none|x|y))?',
        'resize',
        ({ 1: $1  })=>({
                x: 'horizontal',
                y: 'vertical'
            })[$1] || $1 || 'both'
    ],
    // User Select
    match('select-(none|text|all|auto)', 'userSelect'),
    /* SVG */ // Fill, Stroke
    matchColor('fill-', {
        section: 'fill',
        opacityVariable: false,
        opacitySection: 'opacity'
    }),
    matchColor('stroke-', {
        section: 'stroke',
        opacityVariable: false,
        opacitySection: 'opacity'
    }),
    // Stroke Width
    matchTheme('stroke-', 'strokeWidth'),
    /* ACCESSIBILITY */ // Screen Readers
    match('sr-only', {
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: '0',
        margin: '-1px',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        clip: 'rect(0,0,0,0)',
        borderWidth: '0'
    }),
    match('not-sr-only', {
        position: 'static',
        width: 'auto',
        height: 'auto',
        padding: '0',
        margin: '0',
        overflow: 'visible',
        whiteSpace: 'normal',
        clip: 'auto'
    })
];
function spacify(value) {
    return ('string' == typeof value ? value : value[1]).replace(/-/g, ' ').trim();
}
function columnify(value) {
    return ('string' == typeof value ? value : value[1]).replace('col', 'column');
}
function position(shorthand, separator = '-') {
    let longhand = [];
    for (let short of shorthand)longhand.push({
        t: 'top',
        r: 'right',
        b: 'bottom',
        l: 'left'
    }[short]);
    return longhand.join(separator);
}
function join(value) {
    return value && '' + (value._ || value);
}
function convertContentValue({ $$  }) {
    return (({
        // /* aut*/ o: '',
        /* sta*/ r: /*t*/ 'flex-',
        /* end*/ '': 'flex-',
        // /* cen*/ t /*er*/: '',
        /* bet*/ w: /*een*/ 'space-',
        /* aro*/ u: /*nd*/ 'space-',
        /* eve*/ n: /*ly*/ 'space-'
    })[$$[3] || ''] || '') + $$;
}
function edge(propertyPrefix, propertySuffix = '') {
    return ({ 1: $1 , _  })=>{
        let edges = {
            x: 'lr',
            y: 'tb'
        }[$1] || $1 + $1;
        return edges ? {
            ...toCSS(propertyPrefix + '-' + position(edges[0]) + propertySuffix, _),
            ...toCSS(propertyPrefix + '-' + position(edges[1]) + propertySuffix, _)
        } : toCSS(propertyPrefix + propertySuffix, _);
    };
}
function filter(prefix = '') {
    let filters = [
        'blur',
        'brightness',
        'contrast',
        'grayscale',
        'hue-rotate',
        'invert',
        prefix && 'opacity',
        'saturate',
        'sepia',
        !prefix && 'drop-shadow'
    ].filter(Boolean), defaults = {};
    // first create properties defaults
    for (let key of filters)defaults[`--tw-${prefix}${key}`] = 'var(--tw-empty,/*!*/ /*!*/)';
    return defaults = {
        // move defaults
        ...asDefaults(defaults),
        // add default filter which allows standalone usage
        [`${prefix}filter`]: filters.map((key)=>`var(--tw-${prefix}${key})`).join(' ')
    }, [
        `(${prefix}filter)-(none)`,
        match(`${prefix}filter`, defaults),
        ...filters.map((key)=>matchTheme(// hue-rotate can be negated
            `${'h' == key[0] ? '-?' : ''}(${prefix}${key})(?:$|-)`, key, ({ 1: $1 , _  })=>({
                    [`--tw-${$1}`]: asArray(_).map((value)=>`${key}(${value})`).join(' '),
                    ...defaults
                })))
    ];
}
function transform({ 1: $1 , _  }) {
    return {
        ['--tw-' + $1]: _,
        ...tranformDefaults()
    };
}
function tranformDefaults() {
    return {
        ...asDefaults({
            '--tw-translate-x': '0',
            '--tw-translate-y': '0',
            '--tw-rotate': '0',
            '--tw-skew-x': '0',
            '--tw-skew-y': '0',
            '--tw-scale-x': '1',
            '--tw-scale-y': '1',
            '--tw-transform': transformValue()
        }),
        transform: 'var(--tw-transform)'
    };
}
function transformValue(gpu) {
    return [
        gpu ? // -gpu
        'translate3d(var(--tw-translate-x),var(--tw-translate-y),0)' : 'translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y))',
        'rotate(var(--tw-rotate))',
        'skewX(var(--tw-skew-x))',
        'skewY(var(--tw-skew-y))',
        'scaleX(var(--tw-scale-x))',
        'scaleY(var(--tw-scale-y))'
    ].join(' ');
}
function span({ 1: $1 , 2: $2  }) {
    return `${$1} ${$2} / ${$1} ${$2}`;
}
function gridTemplate({ 1: $1  }) {
    return `repeat(${$1},minmax(0,1fr))`;
}
function range({ start =1 , end , step =1  }) {
    let result = [];
    for(let index = start; index <= end; index += step)result.push(`${index}`);
    return result;
}
function asDefaults(props) {
    return {
        '@layer defaults': {
            '*,::before,::after': props,
            '::backdrop': props
        }
    };
}
export { rules as default };
//# sourceMappingURL=rules.dev.js.map
