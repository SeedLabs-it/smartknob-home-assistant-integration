import { BaseTheme as BaseTheme$1, MaybeArray, CSSProperties, ThemeSection } from '@twind/core';

declare module '@twind/core' {
    interface CustomProperties {
        '--tw-backdrop-blur'?: string;
        '--tw-backdrop-brightness'?: string;
        '--tw-backdrop-contrast'?: string;
        '--tw-backdrop-grayscale'?: string;
        '--tw-backdrop-hue-rotate'?: string;
        '--tw-backdrop-invert'?: string;
        '--tw-backdrop-opacity'?: string;
        '--tw-backdrop-saturate'?: string;
        '--tw-backdrop-sepia'?: string;
        '--tw-bg-opacity'?: string | number;
        '--tw-blur'?: string;
        '--tw-border-opacity'?: string | number;
        '--tw-border-spacing-x'?: string | number;
        '--tw-border-spacing-y'?: string | number;
        '--tw-brightness'?: string;
        '--tw-contrast'?: string;
        '--tw-divide-opacity'?: string | number;
        '--tw-divide-x-reverse'?: string | number;
        '--tw-divide-y-reverse'?: string | number;
        '--tw-drop-shadow'?: string;
        '--tw-gradient-from'?: string;
        '--tw-gradient-stops'?: string;
        '--tw-gradient-to'?: string;
        '--tw-gradient-via'?: string;
        '--tw-grayscale'?: string;
        '--tw-hue-rotate'?: string;
        '--tw-invert'?: string;
        '--tw-numeric-figure'?: string;
        '--tw-numeric-fraction'?: string;
        '--tw-numeric-spacing'?: string;
        '--tw-opacity'?: string | number;
        '--tw-ordinal'?: string;
        '--tw-placeholder-opacity'?: string;
        '--tw-ring-color'?: string;
        '--tw-ring-inset'?: string;
        '--tw-ring-offset-color'?: string;
        '--tw-ring-offset-shadow'?: string;
        '--tw-ring-offset-width'?: string;
        '--tw-ring-opacity'?: string | number;
        '--tw-ring-shadow'?: string;
        '--tw-rotate'?: string;
        '--tw-saturate'?: string;
        '--tw-scale-x'?: string;
        '--tw-scale-y'?: string;
        '--tw-sepia'?: string;
        '--tw-shadow'?: string;
        '--tw-shadow-color'?: string;
        '--tw-shadow-colored'?: string;
        '--tw-skew-x'?: string;
        '--tw-skew-y'?: string;
        '--tw-slashed-zero'?: string;
        '--tw-scroll-snap-strictness'?: string;
        '--tw-text-opacity'?: string;
        '--tw-pan-x'?: string;
        '--tw-pan-y'?: string;
        '--tw-pinch-zoom'?: string;
        '--tw-touch-action'?: string;
        '--tw-transform'?: string;
        '--tw-translate-x'?: string;
        '--tw-translate-y'?: string;
    }
}
declare type FontSizeValue = string | [size: string, lineHeight: string] | [size: string, options: {
    lineHeight?: string;
    letterSpacing?: string;
    fontWeight?: string;
}];
declare type FontFamilyValue = MaybeArray<string> | [fontFamily: MaybeArray<string>, configuration: {
    fontFeatureSettings?: string;
}];
interface Container {
    screens?: BaseTheme$1['screens'];
    center?: boolean;
    padding?: string | Record<string, string>;
}
interface TailwindTheme extends BaseTheme$1 {
    columns: Record<string, string>;
    spacing: Record<string, string>;
    durations: Record<string, MaybeArray<string>>;
    accentColor: BaseTheme$1['colors'];
    animation: Record<string, MaybeArray<string>>;
    aria: Record<string, string>;
    aspectRatio: Record<string, string>;
    backdropBlur: Record<string, string>;
    backdropBrightness: Record<string, string>;
    backdropContrast: Record<string, string>;
    backdropGrayscale: Record<string, string>;
    backdropHueRotate: Record<string, string>;
    backdropInvert: Record<string, string>;
    backdropOpacity: Record<string, string>;
    backdropSaturate: Record<string, string>;
    backdropSepia: Record<string, string>;
    backgroundColor: BaseTheme$1['colors'];
    backgroundImage: Record<string, MaybeArray<string>>;
    backgroundOpacity: Record<string, string>;
    backgroundPosition: Record<string, string>;
    backgroundSize: Record<string, MaybeArray<string>>;
    blur: Record<string, string>;
    borderColor: BaseTheme$1['colors'];
    borderOpacity: Record<string, string>;
    borderRadius: Record<string, string>;
    borderSpacing: Record<string, string>;
    borderWidth: Record<string, string>;
    boxShadow: Record<string, MaybeArray<string>>;
    boxShadowColor: BaseTheme$1['colors'];
    brightness: Record<string, string>;
    caretColor: BaseTheme$1['colors'];
    container: Container;
    content: Record<string, string>;
    contrast: Record<string, string>;
    cursor: Record<string, MaybeArray<string>>;
    data: Record<string, string>;
    divideColor: BaseTheme$1['colors'];
    divideOpacity: Record<string, string>;
    divideWidth: Record<string, string>;
    dropShadow: Record<string, MaybeArray<string>>;
    fill: BaseTheme$1['colors'];
    flex: Record<string, string>;
    flexBasis: Record<string, string>;
    flexGrow: Record<string, number | string>;
    flexShrink: Record<string, number | string>;
    fontFamily: Record<string, FontFamilyValue>;
    fontSize: Record<string, FontSizeValue>;
    fontWeight: Record<string, string>;
    gap: Record<string, string>;
    gradientColorStops: BaseTheme$1['colors'];
    grayscale: Record<string, string>;
    gridAutoColumns: Record<string, string>;
    gridAutoRows: Record<string, string>;
    gridColumn: Record<string, string>;
    gridColumnEnd: Record<string, string>;
    gridColumnStart: Record<string, string>;
    gridRow: Record<string, string>;
    gridRowEnd: Record<string, string>;
    gridRowStart: Record<string, string>;
    gridTemplateColumns: Record<string, string>;
    gridTemplateRows: Record<string, string>;
    height: Record<string, string>;
    hueRotate: Record<string, string>;
    inset: Record<string, string>;
    invert: Record<string, string>;
    keyframes: Record<string, Record<string, CSSProperties>>;
    letterSpacing: Record<string, string>;
    lineHeight: Record<string, string>;
    listStyleType: Record<string, string>;
    margin: Record<string, string>;
    maxHeight: Record<string, string>;
    maxWidth: Record<string, string>;
    minHeight: Record<string, string>;
    minWidth: Record<string, string>;
    objectPosition: Record<string, string>;
    opacity: Record<string, string>;
    order: Record<string, string>;
    outlineColor: BaseTheme$1['colors'];
    outlineOffset: Record<string, string>;
    outlineWidth: Record<string, string>;
    padding: Record<string, string>;
    placeholderColor: BaseTheme$1['colors'];
    placeholderOpacity: Record<string, string>;
    ringColor: BaseTheme$1['colors'];
    ringOffsetColor: BaseTheme$1['colors'];
    ringOffsetWidth: Record<string, string>;
    ringOpacity: Record<string, string>;
    ringWidth: Record<string, string>;
    rotate: Record<string, string>;
    saturate: Record<string, string>;
    scale: Record<string, string>;
    scrollMargin: Record<string, string>;
    scrollPadding: Record<string, string>;
    sepia: Record<string, string>;
    skew: Record<string, string>;
    space: Record<string, string>;
    stroke: BaseTheme$1['colors'];
    strokeWidth: Record<string, string>;
    supports: Record<string, string>;
    textColor: BaseTheme$1['colors'];
    textDecorationColor: BaseTheme$1['colors'];
    textDecorationThickness: Record<string, string>;
    textIndent: Record<string, string>;
    textOpacity: Record<string, string>;
    textUnderlineOffset: Record<string, string>;
    transformOrigin: Record<string, string>;
    transitionDelay: Record<string, MaybeArray<string>>;
    transitionDuration: Record<string, MaybeArray<string>>;
    transitionProperty: Record<string, MaybeArray<string>>;
    transitionTimingFunction: Record<string, MaybeArray<string>>;
    translate: Record<string, string>;
    width: Record<string, string>;
    willChange: Record<string, string>;
    zIndex: Record<string, string>;
}

/**
 * @module @twind/preset-tailwind/baseTheme
 */

declare type OmitedSections = 'aria' | 'backgroundPosition' | 'colors' | 'container' | 'cursor' | 'data' | 'gridColumnEnd' | 'gridColumnStart' | 'gridRowEnd' | 'gridRowStart' | 'listStyleType' | 'objectPosition' | 'supports' | 'transformOrigin';
declare type StableSections = 'screens' | 'columns' | 'spacing' | 'durations' | 'borderRadius' | 'borderWidth' | 'boxShadow' | 'fontFamily' | 'fontSize';
declare type BaseTheme = {
    [Section in StableSections]: Section extends 'fontSize' ? {
        xs: [size: string, lineHeight: string];
        sm: [size: string, lineHeight: string];
        base: [size: string, lineHeight: string];
        lg: [size: string, lineHeight: string];
        xl: [size: string, lineHeight: string];
        '2xl': [size: string, lineHeight: string];
        '3xl': [size: string, lineHeight: string];
        '4xl': [size: string, lineHeight: string];
        '5xl': [size: string, lineHeight: string];
        '6xl': [size: string, lineHeight: string];
        '7xl': [size: string, lineHeight: string];
        '8xl': [size: string, lineHeight: string];
        '9xl': [size: string, lineHeight: string];
    } : TailwindTheme[Section];
} & {
    [Section in Exclude<keyof TailwindTheme, StableSections | OmitedSections>]: ThemeSection<TailwindTheme[Section], TailwindTheme>;
} & {
    [Section in OmitedSections]?: ThemeSection<TailwindTheme[Section], TailwindTheme>;
};

/**
 * @module @twind/preset-tailwind/colors
 */
declare const slate: {
    readonly 50: "#f8fafc";
    readonly 100: "#f1f5f9";
    readonly 200: "#e2e8f0";
    readonly 300: "#cbd5e1";
    readonly 400: "#94a3b8";
    readonly 500: "#64748b";
    readonly 600: "#475569";
    readonly 700: "#334155";
    readonly 800: "#1e293b";
    readonly 900: "#0f172a";
};
declare const gray: {
    readonly 50: "#f9fafb";
    readonly 100: "#f3f4f6";
    readonly 200: "#e5e7eb";
    readonly 300: "#d1d5db";
    readonly 400: "#9ca3af";
    readonly 500: "#6b7280";
    readonly 600: "#4b5563";
    readonly 700: "#374151";
    readonly 800: "#1f2937";
    readonly 900: "#111827";
};
declare const zinc: {
    readonly 50: "#fafafa";
    readonly 100: "#f4f4f5";
    readonly 200: "#e4e4e7";
    readonly 300: "#d4d4d8";
    readonly 400: "#a1a1aa";
    readonly 500: "#71717a";
    readonly 600: "#52525b";
    readonly 700: "#3f3f46";
    readonly 800: "#27272a";
    readonly 900: "#18181b";
};
declare const neutral: {
    readonly 50: "#fafafa";
    readonly 100: "#f5f5f5";
    readonly 200: "#e5e5e5";
    readonly 300: "#d4d4d4";
    readonly 400: "#a3a3a3";
    readonly 500: "#737373";
    readonly 600: "#525252";
    readonly 700: "#404040";
    readonly 800: "#262626";
    readonly 900: "#171717";
};
declare const stone: {
    readonly 50: "#fafaf9";
    readonly 100: "#f5f5f4";
    readonly 200: "#e7e5e4";
    readonly 300: "#d6d3d1";
    readonly 400: "#a8a29e";
    readonly 500: "#78716c";
    readonly 600: "#57534e";
    readonly 700: "#44403c";
    readonly 800: "#292524";
    readonly 900: "#1c1917";
};
declare const red: {
    readonly 50: "#fef2f2";
    readonly 100: "#fee2e2";
    readonly 200: "#fecaca";
    readonly 300: "#fca5a5";
    readonly 400: "#f87171";
    readonly 500: "#ef4444";
    readonly 600: "#dc2626";
    readonly 700: "#b91c1c";
    readonly 800: "#991b1b";
    readonly 900: "#7f1d1d";
};
declare const orange: {
    readonly 50: "#fff7ed";
    readonly 100: "#ffedd5";
    readonly 200: "#fed7aa";
    readonly 300: "#fdba74";
    readonly 400: "#fb923c";
    readonly 500: "#f97316";
    readonly 600: "#ea580c";
    readonly 700: "#c2410c";
    readonly 800: "#9a3412";
    readonly 900: "#7c2d12";
};
declare const amber: {
    readonly 50: "#fffbeb";
    readonly 100: "#fef3c7";
    readonly 200: "#fde68a";
    readonly 300: "#fcd34d";
    readonly 400: "#fbbf24";
    readonly 500: "#f59e0b";
    readonly 600: "#d97706";
    readonly 700: "#b45309";
    readonly 800: "#92400e";
    readonly 900: "#78350f";
};
declare const yellow: {
    readonly 50: "#fefce8";
    readonly 100: "#fef9c3";
    readonly 200: "#fef08a";
    readonly 300: "#fde047";
    readonly 400: "#facc15";
    readonly 500: "#eab308";
    readonly 600: "#ca8a04";
    readonly 700: "#a16207";
    readonly 800: "#854d0e";
    readonly 900: "#713f12";
};
declare const lime: {
    readonly 50: "#f7fee7";
    readonly 100: "#ecfccb";
    readonly 200: "#d9f99d";
    readonly 300: "#bef264";
    readonly 400: "#a3e635";
    readonly 500: "#84cc16";
    readonly 600: "#65a30d";
    readonly 700: "#4d7c0f";
    readonly 800: "#3f6212";
    readonly 900: "#365314";
};
declare const green: {
    readonly 50: "#f0fdf4";
    readonly 100: "#dcfce7";
    readonly 200: "#bbf7d0";
    readonly 300: "#86efac";
    readonly 400: "#4ade80";
    readonly 500: "#22c55e";
    readonly 600: "#16a34a";
    readonly 700: "#15803d";
    readonly 800: "#166534";
    readonly 900: "#14532d";
};
declare const emerald: {
    readonly 50: "#ecfdf5";
    readonly 100: "#d1fae5";
    readonly 200: "#a7f3d0";
    readonly 300: "#6ee7b7";
    readonly 400: "#34d399";
    readonly 500: "#10b981";
    readonly 600: "#059669";
    readonly 700: "#047857";
    readonly 800: "#065f46";
    readonly 900: "#064e3b";
};
declare const teal: {
    readonly 50: "#f0fdfa";
    readonly 100: "#ccfbf1";
    readonly 200: "#99f6e4";
    readonly 300: "#5eead4";
    readonly 400: "#2dd4bf";
    readonly 500: "#14b8a6";
    readonly 600: "#0d9488";
    readonly 700: "#0f766e";
    readonly 800: "#115e59";
    readonly 900: "#134e4a";
};
declare const cyan: {
    readonly 50: "#ecfeff";
    readonly 100: "#cffafe";
    readonly 200: "#a5f3fc";
    readonly 300: "#67e8f9";
    readonly 400: "#22d3ee";
    readonly 500: "#06b6d4";
    readonly 600: "#0891b2";
    readonly 700: "#0e7490";
    readonly 800: "#155e75";
    readonly 900: "#164e63";
};
declare const sky: {
    readonly 50: "#f0f9ff";
    readonly 100: "#e0f2fe";
    readonly 200: "#bae6fd";
    readonly 300: "#7dd3fc";
    readonly 400: "#38bdf8";
    readonly 500: "#0ea5e9";
    readonly 600: "#0284c7";
    readonly 700: "#0369a1";
    readonly 800: "#075985";
    readonly 900: "#0c4a6e";
};
declare const blue: {
    readonly 50: "#eff6ff";
    readonly 100: "#dbeafe";
    readonly 200: "#bfdbfe";
    readonly 300: "#93c5fd";
    readonly 400: "#60a5fa";
    readonly 500: "#3b82f6";
    readonly 600: "#2563eb";
    readonly 700: "#1d4ed8";
    readonly 800: "#1e40af";
    readonly 900: "#1e3a8a";
};
declare const indigo: {
    readonly 50: "#eef2ff";
    readonly 100: "#e0e7ff";
    readonly 200: "#c7d2fe";
    readonly 300: "#a5b4fc";
    readonly 400: "#818cf8";
    readonly 500: "#6366f1";
    readonly 600: "#4f46e5";
    readonly 700: "#4338ca";
    readonly 800: "#3730a3";
    readonly 900: "#312e81";
};
declare const violet: {
    readonly 50: "#f5f3ff";
    readonly 100: "#ede9fe";
    readonly 200: "#ddd6fe";
    readonly 300: "#c4b5fd";
    readonly 400: "#a78bfa";
    readonly 500: "#8b5cf6";
    readonly 600: "#7c3aed";
    readonly 700: "#6d28d9";
    readonly 800: "#5b21b6";
    readonly 900: "#4c1d95";
};
declare const purple: {
    readonly 50: "#faf5ff";
    readonly 100: "#f3e8ff";
    readonly 200: "#e9d5ff";
    readonly 300: "#d8b4fe";
    readonly 400: "#c084fc";
    readonly 500: "#a855f7";
    readonly 600: "#9333ea";
    readonly 700: "#7e22ce";
    readonly 800: "#6b21a8";
    readonly 900: "#581c87";
};
declare const fuchsia: {
    readonly 50: "#fdf4ff";
    readonly 100: "#fae8ff";
    readonly 200: "#f5d0fe";
    readonly 300: "#f0abfc";
    readonly 400: "#e879f9";
    readonly 500: "#d946ef";
    readonly 600: "#c026d3";
    readonly 700: "#a21caf";
    readonly 800: "#86198f";
    readonly 900: "#701a75";
};
declare const pink: {
    readonly 50: "#fdf2f8";
    readonly 100: "#fce7f3";
    readonly 200: "#fbcfe8";
    readonly 300: "#f9a8d4";
    readonly 400: "#f472b6";
    readonly 500: "#ec4899";
    readonly 600: "#db2777";
    readonly 700: "#be185d";
    readonly 800: "#9d174d";
    readonly 900: "#831843";
};
declare const rose: {
    readonly 50: "#fff1f2";
    readonly 100: "#ffe4e6";
    readonly 200: "#fecdd3";
    readonly 300: "#fda4af";
    readonly 400: "#fb7185";
    readonly 500: "#f43f5e";
    readonly 600: "#e11d48";
    readonly 700: "#be123c";
    readonly 800: "#9f1239";
    readonly 900: "#881337";
};

declare const colors_slate: typeof slate;
declare const colors_gray: typeof gray;
declare const colors_zinc: typeof zinc;
declare const colors_neutral: typeof neutral;
declare const colors_stone: typeof stone;
declare const colors_red: typeof red;
declare const colors_orange: typeof orange;
declare const colors_amber: typeof amber;
declare const colors_yellow: typeof yellow;
declare const colors_lime: typeof lime;
declare const colors_green: typeof green;
declare const colors_emerald: typeof emerald;
declare const colors_teal: typeof teal;
declare const colors_cyan: typeof cyan;
declare const colors_sky: typeof sky;
declare const colors_blue: typeof blue;
declare const colors_indigo: typeof indigo;
declare const colors_violet: typeof violet;
declare const colors_purple: typeof purple;
declare const colors_fuchsia: typeof fuchsia;
declare const colors_pink: typeof pink;
declare const colors_rose: typeof rose;
declare namespace colors {
  export {
    colors_slate as slate,
    colors_gray as gray,
    colors_zinc as zinc,
    colors_neutral as neutral,
    colors_stone as stone,
    colors_red as red,
    colors_orange as orange,
    colors_amber as amber,
    colors_yellow as yellow,
    colors_lime as lime,
    colors_green as green,
    colors_emerald as emerald,
    colors_teal as teal,
    colors_cyan as cyan,
    colors_sky as sky,
    colors_blue as blue,
    colors_indigo as indigo,
    colors_violet as violet,
    colors_purple as purple,
    colors_fuchsia as fuchsia,
    colors_pink as pink,
    colors_rose as rose,
  };
}

/**
 * @module @twind/preset-tailwind/defaultTheme
 */

declare type DefaultTheme = {
    colors: typeof colors;
} & BaseTheme;
declare const theme: DefaultTheme;

export { DefaultTheme, theme as default };
//# sourceMappingURL=defaultTheme.d.ts.map
