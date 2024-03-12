'use strict';
const styleVendorizer = require('style-vendorizer'), CSSPrefixFlags = [
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
module.exports = // 0b100
function() {
    return ({ stringify  })=>({
            stringify (property, value, context) {
                let cssText = '', // Resolve aliases, e.g. `gap` -> `grid-gap`
                propertyAlias = styleVendorizer.cssPropertyAlias(property);
                propertyAlias && (cssText += stringify(propertyAlias, value, context) + ';');
                // Prefix properties, e.g. `backdrop-filter` -> `-webkit-backdrop-filter`
                let propertyFlags = styleVendorizer.cssPropertyPrefixFlags(property), valueFlags = styleVendorizer.cssValuePrefixFlags(property, value);
                for (let prefix of CSSPrefixFlags){
                    propertyFlags & prefix[1] && (cssText += stringify(prefix[0] + property, value, context) + ';');
                    valueFlags & prefix[1] && (cssText += stringify(property, prefix[0] + value, context) + ';');
                }
                /* Include the standardized declaration last */ /* https://css-tricks.com/ordering-css3-properties/ */ return cssText + stringify(property, value, context);
            }
        });
};
//# sourceMappingURL=preset-autoprefix.cjs.map
