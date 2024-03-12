'use strict';
const core = require('@twind/core'), // indirection wrapper to remove autocomplete functions from production bundles
rules = [
    /* arbitrary properties: [paint-order:markers] */ core.match('\\[([-\\w]+):(.+)]', ({ 1: $1 , 2: $2  }, context)=>({
            '@layer overrides': {
                '&': {
                    [$1]: core.arbitrary(`[${$2}]`, '', context)
                }
            }
        })),
    /* Styling based on parent and peer state */ core.match('(group|peer)([~/][^-[]+)?', ({ input  }, { h  })=>[
            {
                c: h(input)
            }
        ]),
    /* LAYOUT */ core.matchTheme('aspect-', 'aspectRatio'),
    core.match('container', (_, { theme  })=>{
        let { screens =theme('screens') , center , padding  } = theme('container'), rules = {
            width: '100%',
            marginRight: center && 'auto',
            marginLeft: center && 'auto',
            ...paddingFor('xs')
        };
        for(let screen in screens){
            let value = screens[screen];
            'string' == typeof value && (rules[core.mql(value)] = {
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
    core.matchTheme('content-', 'content', ({ _  })=>({
            '--tw-content': _,
            content: 'var(--tw-content)'
        })),
    // Box Decoration Break
    core.match('(?:box-)?decoration-(slice|clone)', 'boxDecorationBreak'),
    // Box Sizing
    core.match('box-(border|content)', 'boxSizing', ({ 1: $1  })=>$1 + '-box'),
    // Display
    core.match('hidden', {
        display: 'none'
    }),
    // Table Layout
    core.match('table-(auto|fixed)', 'tableLayout'),
    core.match([
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
    core.match('isolate', 'isolation'),
    // Object Fit
    core.match('object-(contain|cover|fill|none|scale-down)', 'objectFit'),
    // Object Position
    core.matchTheme('object-', 'objectPosition'),
    core.match('object-(top|bottom|center|(left|right)(-(top|bottom))?)', 'objectPosition', spacify),
    // Overscroll Behavior
    core.match('overscroll(-[xy])?-(auto|contain|none)', ({ 1: $1 = '' , 2: $2  })=>({
            ['overscroll-behavior' + $1]: $2
        })),
    // Position
    core.match('(static|fixed|absolute|relative|sticky)', 'position'),
    // Top / Right / Bottom / Left
    core.matchTheme('-?inset(-[xy])?(?:$|-)', 'inset', ({ 1: $1 , _  })=>({
            top: '-x' != $1 && _,
            right: '-y' != $1 && _,
            bottom: '-x' != $1 && _,
            left: '-y' != $1 && _
        })),
    core.matchTheme('-?(top|bottom|left|right)(?:$|-)', 'inset'),
    // Visibility
    core.match('(visible|collapse)', 'visibility'),
    core.match('invisible', {
        visibility: 'hidden'
    }),
    // Z-Index
    core.matchTheme('-?z-', 'zIndex'),
    /* FLEXBOX */ // Flex Direction
    core.match('flex-((row|col)(-reverse)?)', 'flexDirection', columnify),
    core.match('flex-(wrap|wrap-reverse|nowrap)', 'flexWrap'),
    core.matchTheme('(flex-(?:grow|shrink))(?:$|-)'),
    /*, 'flex-grow' | flex-shrink */ core.matchTheme('(flex)-'),
    /*, 'flex' */ core.matchTheme('grow(?:$|-)', 'flexGrow'),
    core.matchTheme('shrink(?:$|-)', 'flexShrink'),
    core.matchTheme('basis-', 'flexBasis'),
    core.matchTheme('-?(order)-'),
    /*, 'order' */ '-?(order)-(\\d+)',
    /* GRID */ // Grid Template Columns
    core.matchTheme('grid-cols-', 'gridTemplateColumns'),
    core.match('grid-cols-(\\d+)', 'gridTemplateColumns', gridTemplate),
    // Grid Column Start / End
    core.matchTheme('col-', 'gridColumn'),
    core.match('col-(span)-(\\d+)', 'gridColumn', span),
    core.matchTheme('col-start-', 'gridColumnStart'),
    core.match('col-start-(auto|\\d+)', 'gridColumnStart'),
    core.matchTheme('col-end-', 'gridColumnEnd'),
    core.match('col-end-(auto|\\d+)', 'gridColumnEnd'),
    // Grid Template Rows
    core.matchTheme('grid-rows-', 'gridTemplateRows'),
    core.match('grid-rows-(\\d+)', 'gridTemplateRows', gridTemplate),
    // Grid Row Start / End
    core.matchTheme('row-', 'gridRow'),
    core.match('row-(span)-(\\d+)', 'gridRow', span),
    core.matchTheme('row-start-', 'gridRowStart'),
    core.match('row-start-(auto|\\d+)', 'gridRowStart'),
    core.matchTheme('row-end-', 'gridRowEnd'),
    core.match('row-end-(auto|\\d+)', 'gridRowEnd'),
    // Grid Auto Flow
    core.match('grid-flow-((row|col)(-dense)?)', 'gridAutoFlow', (match)=>spacify(columnify(match))),
    core.match('grid-flow-(dense)', 'gridAutoFlow'),
    // Grid Auto Columns
    core.matchTheme('auto-cols-', 'gridAutoColumns'),
    // Grid Auto Rows
    core.matchTheme('auto-rows-', 'gridAutoRows'),
    // Gap
    core.matchTheme('gap-x(?:$|-)', 'gap', 'columnGap'),
    core.matchTheme('gap-y(?:$|-)', 'gap', 'rowGap'),
    core.matchTheme('gap(?:$|-)', 'gap'),
    /* BOX ALIGNMENT */ // Justify Items
    // Justify Self
    '(justify-(?:items|self))-',
    /* '-self-' */ // Justify Content
    core.match('justify-', 'justifyContent', convertContentValue),
    // Align Content
    // Align Items
    // Align Self
    core.match('(content|items|self)-', (match)=>({
            ['align-' + match[1]]: convertContentValue(match)
        })),
    /* $1 == 'self' */ // Place Content
    // Place Items
    // Place Self
    core.match('(place-(content|items|self))-', ({ 1: $1 , $$  })=>({
            [$1]: ('wun'.includes($$[3]) ? 'space-' : '') + $$
        })),
    /* $2 == 'self' */ /* SPACING */ // Padding
    core.matchTheme('p([xytrbl])?(?:$|-)', 'padding', edge('padding')),
    // Margin
    core.matchTheme('-?m([xytrbl])?(?:$|-)', 'margin', edge('margin')),
    // Space Between
    core.matchTheme('-?space-(x|y)(?:$|-)', 'space', ({ 1: $1 , _  })=>({
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
    core.match('space-(x|y)-reverse', ({ 1: $1  })=>({
            '&>:not([hidden])~:not([hidden])': {
                [`--tw-space-${$1}-reverse`]: '1'
            }
        })),
    /* SIZING */ // Width
    core.matchTheme('w-', 'width'),
    // Min-Width
    core.matchTheme('min-w-', 'minWidth'),
    // Max-Width
    core.matchTheme('max-w-', 'maxWidth'),
    // Height
    core.matchTheme('h-', 'height'),
    // Min-Height
    core.matchTheme('min-h-', 'minHeight'),
    // Max-Height
    core.matchTheme('max-h-', 'maxHeight'),
    /* TYPOGRAPHY */ // Font Weight
    core.matchTheme('font-', 'fontWeight'),
    // Font Family
    core.matchTheme('font-', 'fontFamily', ({ _  })=>{
        return 'string' == typeof (_ = core.asArray(_))[1] ? {
            fontFamily: join(_)
        } : {
            fontFamily: join(_[0]),
            ..._[1]
        };
    }),
    // Font Smoothing
    core.match('antialiased', {
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale'
    }),
    core.match('subpixel-antialiased', {
        WebkitFontSmoothing: 'auto',
        MozOsxFontSmoothing: 'auto'
    }),
    // Font Style
    core.match('italic', 'fontStyle'),
    core.match('not-italic', {
        fontStyle: 'normal'
    }),
    // Font Variant Numeric
    core.match('(ordinal|slashed-zero|(normal|lining|oldstyle|proportional|tabular)-nums|(diagonal|stacked)-fractions)', ({ 1: $1 , 2: $2 = '' , 3: $3  })=>// normal-nums
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
    core.matchTheme('tracking-', 'letterSpacing'),
    // Line Height
    core.matchTheme('leading-', 'lineHeight'),
    // List Style Position
    core.match('list-(inside|outside)', 'listStylePosition'),
    // List Style Type
    core.matchTheme('list-', 'listStyleType'),
    core.match('list-', 'listStyleType'),
    // Placeholder Opacity
    core.matchTheme('placeholder-opacity-', 'placeholderOpacity', ({ _  })=>({
            '&::placeholder': {
                '--tw-placeholder-opacity': _
            }
        })),
    // Placeholder Color
    core.matchColor('placeholder-', {
        property: 'color',
        selector: '&::placeholder'
    }),
    // Text Alignment
    core.match('text-(left|center|right|justify|start|end)', 'textAlign'),
    core.match('text-(ellipsis|clip)', 'textOverflow'),
    // Text Opacity
    core.matchTheme('text-opacity-', 'textOpacity', '--tw-text-opacity'),
    // Text Color
    core.matchColor('text-', {
        property: 'color'
    }),
    // Font Size
    core.matchTheme('text-', 'fontSize', ({ _  })=>'string' == typeof _ ? {
            fontSize: _
        } : {
            fontSize: _[0],
            ...'string' == typeof _[1] ? {
                lineHeight: _[1]
            } : _[1]
        }),
    // Text Indent
    core.matchTheme('indent-', 'textIndent'),
    // Text Decoration
    core.match('(overline|underline|line-through)', 'textDecorationLine'),
    core.match('no-underline', {
        textDecorationLine: 'none'
    }),
    // Text Underline offset
    core.matchTheme('underline-offset-', 'textUnderlineOffset'),
    // Text Decoration Color
    core.matchColor('decoration-', {
        section: 'textDecorationColor',
        opacityVariable: false,
        opacitySection: 'opacity'
    }),
    // Text Decoration Thickness
    core.matchTheme('decoration-', 'textDecorationThickness'),
    // Text Decoration Style
    core.match('decoration-', 'textDecorationStyle'),
    // Text Transform
    core.match('(uppercase|lowercase|capitalize)', 'textTransform'),
    core.match('normal-case', {
        textTransform: 'none'
    }),
    // Text Overflow
    core.match('truncate', {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
    }),
    // Vertical Alignment
    core.match('align-', 'verticalAlign'),
    // Whitespace
    core.match('whitespace-', 'whiteSpace'),
    // Word Break
    core.match('break-normal', {
        wordBreak: 'normal',
        overflowWrap: 'normal'
    }),
    core.match('break-words', {
        overflowWrap: 'break-word'
    }),
    core.match('break-all', {
        wordBreak: 'break-all'
    }),
    core.match('break-keep', {
        wordBreak: 'keep-all'
    }),
    // Caret Color
    core.matchColor('caret-', {
        // section: 'caretColor',
        opacityVariable: false,
        opacitySection: 'opacity'
    }),
    // Accent Color
    core.matchColor('accent-', {
        // section: 'accentColor',
        opacityVariable: false,
        opacitySection: 'opacity'
    }),
    // Gradient Color Stops
    core.match('bg-gradient-to-([trbl]|[tb][rl])', 'backgroundImage', ({ 1: $1  })=>`linear-gradient(to ${position($1, ' ')},var(--tw-gradient-stops))`),
    core.matchColor('from-', {
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
    core.matchColor('via-', {
        section: 'gradientColorStops',
        opacityVariable: false,
        opacitySection: 'opacity'
    }, ({ _  })=>({
            '--tw-gradient-to': _.color({
                opacityValue: '0'
            }),
            '--tw-gradient-stops': `var(--tw-gradient-from),${_.value},var(--tw-gradient-to)`
        })),
    core.matchColor('to-', {
        section: 'gradientColorStops',
        property: '--tw-gradient-to',
        opacityVariable: false,
        opacitySection: 'opacity'
    }),
    /* BACKGROUNDS */ // Background Attachment
    core.match('bg-(fixed|local|scroll)', 'backgroundAttachment'),
    // Background Origin
    core.match('bg-origin-(border|padding|content)', 'backgroundOrigin', ({ 1: $1  })=>$1 + '-box'),
    // Background Repeat
    core.match([
        'bg-(no-repeat|repeat(-[xy])?)',
        'bg-repeat-(round|space)'
    ], 'backgroundRepeat'),
    // Background Blend Mode
    core.match('bg-blend-', 'backgroundBlendMode'),
    // Background Clip
    core.match('bg-clip-(border|padding|content|text)', 'backgroundClip', ({ 1: $1  })=>$1 + ('text' == $1 ? '' : '-box')),
    // Background Opacity
    core.matchTheme('bg-opacity-', 'backgroundOpacity', '--tw-bg-opacity'),
    // Background Color
    // bg-${backgroundColor}/${backgroundOpacity}
    core.matchColor('bg-', {
        section: 'backgroundColor'
    }),
    // Background Image
    // supported arbitrary types are: length, color, angle, list
    core.matchTheme('bg-', 'backgroundImage'),
    // Background Position
    core.matchTheme('bg-', 'backgroundPosition'),
    core.match('bg-(top|bottom|center|(left|right)(-(top|bottom))?)', 'backgroundPosition', spacify),
    // Background Size
    core.matchTheme('bg-', 'backgroundSize'),
    /* BORDERS */ // Border Radius
    core.matchTheme('rounded(?:$|-)', 'borderRadius'),
    core.matchTheme('rounded-([trbl]|[tb][rl])(?:$|-)', 'borderRadius', ({ 1: $1 , _  })=>{
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
    core.match('border-(collapse|separate)', 'borderCollapse'),
    // Border Opacity
    core.matchTheme('border-opacity(?:$|-)', 'borderOpacity', '--tw-border-opacity'),
    // Border Style
    core.match('border-(solid|dashed|dotted|double|none)', 'borderStyle'),
    // Border Spacing
    core.matchTheme('border-spacing(-[xy])?(?:$|-)', 'borderSpacing', ({ 1: $1 , _  })=>({
            ...asDefaults({
                '--tw-border-spacing-x': '0',
                '--tw-border-spacing-y': '0'
            }),
            ['--tw-border-spacing' + ($1 || '-x')]: _,
            ['--tw-border-spacing' + ($1 || '-y')]: _,
            'border-spacing': 'var(--tw-border-spacing-x) var(--tw-border-spacing-y)'
        })),
    // Border Color
    core.matchColor('border-([xytrbl])-', {
        section: 'borderColor'
    }, edge('border', 'Color')),
    core.matchColor('border-'),
    // Border Width
    core.matchTheme('border-([xytrbl])(?:$|-)', 'borderWidth', edge('border', 'Width')),
    core.matchTheme('border(?:$|-)', 'borderWidth'),
    // Divide Opacity
    core.matchTheme('divide-opacity(?:$|-)', 'divideOpacity', ({ _  })=>({
            '&>:not([hidden])~:not([hidden])': {
                '--tw-divide-opacity': _
            }
        })),
    // Divide Style
    core.match('divide-(solid|dashed|dotted|double|none)', ({ 1: $1  })=>({
            '&>:not([hidden])~:not([hidden])': {
                borderStyle: $1
            }
        })),
    // Divide Width
    core.match('divide-([xy]-reverse)', ({ 1: $1  })=>({
            '&>:not([hidden])~:not([hidden])': {
                ['--tw-divide-' + $1]: '1'
            }
        })),
    core.matchTheme('divide-([xy])(?:$|-)', 'divideWidth', ({ 1: $1 , _  })=>{
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
    core.matchColor('divide-', {
        // section: $0.replace('-', 'Color') -> 'divideColor'
        property: 'borderColor',
        // opacityVariable: '--tw-border-opacity',
        // opacitySection: section.replace('Color', 'Opacity') -> 'divideOpacity'
        selector: '&>:not([hidden])~:not([hidden])'
    }),
    // Ring Offset Opacity
    core.matchTheme('ring-opacity(?:$|-)', 'ringOpacity', '--tw-ring-opacity'),
    // Ring Offset Color
    core.matchColor('ring-offset-', {
        // section: 'ringOffsetColor',
        property: '--tw-ring-offset-color',
        opacityVariable: false
    }),
    // opacitySection: section.replace('Color', 'Opacity') -> 'ringOffsetOpacity'
    // Ring Offset Width
    core.matchTheme('ring-offset(?:$|-)', 'ringOffsetWidth', '--tw-ring-offset-width'),
    // Ring Inset
    core.match('ring-inset', {
        '--tw-ring-inset': 'inset'
    }),
    // Ring Color
    core.matchColor('ring-', {
        // section: 'ringColor',
        property: '--tw-ring-color'
    }),
    // opacityVariable: '--tw-ring-opacity',
    // opacitySection: section.replace('Color', 'Opacity') -> 'ringOpacity'
    // Ring Width
    core.matchTheme('ring(?:$|-)', 'ringWidth', ({ _  }, { theme  })=>({
            ...asDefaults({
                '--tw-ring-offset-shadow': '0 0 #0000',
                '--tw-ring-shadow': '0 0 #0000',
                '--tw-shadow': '0 0 #0000',
                '--tw-shadow-colored': '0 0 #0000',
                // Within own declaration to have the defaults above to be merged with defaults from shadow
                '&': {
                    '--tw-ring-inset': 'var(--tw-empty,/*!*/ /*!*/)',
                    '--tw-ring-offset-width': theme('ringOffsetWidth', '', '0px'),
                    '--tw-ring-offset-color': core.toColorValue(theme('ringOffsetColor', '', '#fff')),
                    '--tw-ring-color': core.toColorValue(theme('ringColor', '', '#93c5fd'), {
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
    core.matchColor('shadow-', {
        section: 'boxShadowColor',
        opacityVariable: false,
        opacitySection: 'opacity'
    }, ({ _  })=>({
            '--tw-shadow-color': _.value,
            '--tw-shadow': 'var(--tw-shadow-colored)'
        })),
    // Box Shadow
    core.matchTheme('shadow(?:$|-)', 'boxShadow', ({ _  })=>({
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
    core.matchTheme('(opacity)-'),
    /*, 'opacity' */ // Mix Blend Mode
    core.match('mix-blend-', 'mixBlendMode'),
    /* FILTERS */ ...filter(),
    ...filter('backdrop-'),
    /* TRANSITIONS AND ANIMATION */ // Transition Property
    core.matchTheme('transition(?:$|-)', 'transitionProperty', (match, { theme  })=>({
            transitionProperty: join(match),
            transitionTimingFunction: 'none' == match._ ? void 0 : join(theme('transitionTimingFunction', '')),
            transitionDuration: 'none' == match._ ? void 0 : join(theme('transitionDuration', ''))
        })),
    // Transition Duration
    core.matchTheme('duration(?:$|-)', 'transitionDuration', 'transitionDuration', join),
    // Transition Timing Function
    core.matchTheme('ease(?:$|-)', 'transitionTimingFunction', 'transitionTimingFunction', join),
    // Transition Delay
    core.matchTheme('delay(?:$|-)', 'transitionDelay', 'transitionDelay', join),
    core.matchTheme('animate(?:$|-)', 'animation', (match, { theme , h , e  })=>{
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
    core.match('transform', tranformDefaults),
    core.match('transform-(cpu|gpu)', ({ 1: $1  })=>({
            '--tw-transform': transformValue('gpu' == $1)
        })),
    // Scale
    core.matchTheme('scale(-[xy])?-', 'scale', ({ 1: $1 , _  })=>({
            ['--tw-scale' + ($1 || '-x')]: _,
            ['--tw-scale' + ($1 || '-y')]: _,
            ...tranformDefaults()
        })),
    // Rotate
    core.matchTheme('-?(rotate)-', 'rotate', transform),
    // Translate
    core.matchTheme('-?(translate-[xy])-', 'translate', transform),
    // Skew
    core.matchTheme('-?(skew-[xy])-', 'skew', transform),
    // Transform Origin
    core.match('origin-(center|((top|bottom)(-(left|right))?)|left|right)', 'transformOrigin', spacify),
    /* INTERACTIVITY */ // Appearance
    '(appearance)-',
    // Columns
    core.matchTheme('(columns)-'),
    /*, 'columns' */ '(columns)-(\\d+)',
    // Break Before, After and Inside
    '(break-(?:before|after|inside))-',
    /* before || after */ // Cursor
    core.matchTheme('(cursor)-'),
    /*, 'cursor' */ '(cursor)-',
    // Scroll Snap Type
    core.match('snap-(none)', 'scroll-snap-type'),
    core.match('snap-(x|y|both)', ({ 1: $1  })=>({
            ...asDefaults({
                '--tw-scroll-snap-strictness': 'proximity'
            }),
            'scroll-snap-type': $1 + ' var(--tw-scroll-snap-strictness)'
        })),
    core.match('snap-(mandatory|proximity)', '--tw-scroll-snap-strictness'),
    // Scroll Snap Align
    core.match('snap-(?:(start|end|center)|align-(none))', 'scroll-snap-align'),
    // Scroll Snap Stop
    core.match('snap-(normal|always)', 'scroll-snap-stop'),
    core.match('scroll-(auto|smooth)', 'scroll-behavior'),
    // Scroll Margin
    // Padding
    core.matchTheme('scroll-p([xytrbl])?(?:$|-)', 'padding', edge('scroll-padding')),
    // Margin
    core.matchTheme('-?scroll-m([xytrbl])?(?:$|-)', 'scroll-margin', edge('scroll-margin')),
    // Touch Action
    core.match('touch-(auto|none|manipulation)', 'touch-action'),
    core.match('touch-(pinch-zoom|pan-(?:(x|left|right)|(y|up|down)))', ({ 1: $1 , 2: $2 , 3: $3  })=>({
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
    core.match('outline-none', {
        outline: '2px solid transparent',
        'outline-offset': '2px'
    }),
    core.match('outline', {
        outlineStyle: 'solid'
    }),
    core.match('outline-(dashed|dotted|double)', 'outlineStyle'),
    // Outline Offset
    core.matchTheme('-?(outline-offset)-'),
    /*, 'outlineOffset'*/ // Outline Color
    core.matchColor('outline-', {
        opacityVariable: false,
        opacitySection: 'opacity'
    }),
    // Outline Width
    core.matchTheme('outline-', 'outlineWidth'),
    // Pointer Events
    '(pointer-events)-',
    // Will Change
    core.matchTheme('(will-change)-'),
    /*, 'willChange' */ '(will-change)-',
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
    core.match('select-(none|text|all|auto)', 'userSelect'),
    /* SVG */ // Fill, Stroke
    core.matchColor('fill-', {
        section: 'fill',
        opacityVariable: false,
        opacitySection: 'opacity'
    }),
    core.matchColor('stroke-', {
        section: 'stroke',
        opacityVariable: false,
        opacitySection: 'opacity'
    }),
    // Stroke Width
    core.matchTheme('stroke-', 'strokeWidth'),
    /* ACCESSIBILITY */ // Screen Readers
    core.match('sr-only', {
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
    core.match('not-sr-only', {
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
            ...core.toCSS(propertyPrefix + '-' + position(edges[0]) + propertySuffix, _),
            ...core.toCSS(propertyPrefix + '-' + position(edges[1]) + propertySuffix, _)
        } : core.toCSS(propertyPrefix + propertySuffix, _);
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
        core.match(`${prefix}filter`, defaults),
        ...filters.map((key)=>core.matchTheme(// hue-rotate can be negated
            `${'h' == key[0] ? '-?' : ''}(${prefix}${key})(?:$|-)`, key, ({ 1: $1 , _  })=>({
                    [`--tw-${$1}`]: core.asArray(_).map((value)=>`${key}(${value})`).join(' '),
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
function asDefaults(props) {
    return {
        '@layer defaults': {
            '*,::before,::after': props,
            '::backdrop': props
        }
    };
}
module.exports = rules;
//# sourceMappingURL=rules.cjs.map
