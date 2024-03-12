import { cssPropertyAlias, cssPropertyPrefixFlags, cssValuePrefixFlags } from 'style-vendorizer';
let CSSPrefixFlags = [
    [
        '-webkit-',
        1
    ],
    // 0b001
    [
        '-moz-',
        2
    ],
    // 0b010
    [
        '-ms-',
        4
    ]
];
// 0b100
function presetAutoprefix() {
    return ({ stringify  })=>({
            stringify (property, value, context) {
                let cssText = '', // Resolve aliases, e.g. `gap` -> `grid-gap`
                propertyAlias = cssPropertyAlias(property);
                propertyAlias && (cssText += stringify(propertyAlias, value, context) + ';');
                // Prefix properties, e.g. `backdrop-filter` -> `-webkit-backdrop-filter`
                let propertyFlags = cssPropertyPrefixFlags(property), valueFlags = cssValuePrefixFlags(property, value);
                for (let prefix of CSSPrefixFlags){
                    propertyFlags & prefix[1] && (cssText += stringify(prefix[0] + property, value, context) + ';');
                    valueFlags & prefix[1] && (cssText += stringify(property, prefix[0] + value, context) + ';');
                }
                /* Include the standardized declaration last */ /* https://css-tricks.com/ordering-css3-properties/ */ return cssText + stringify(property, value, context);
            }
        });
}
export { presetAutoprefix as default };
//# sourceMappingURL=preset-autoprefix.js.map
