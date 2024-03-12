import * as CSS$1 from 'csstype';

declare type Falsey = false | null | undefined | void | '';
declare type MaybeArray<T> = T | T[];
declare type MaybeThunk<T, Theme extends BaseTheme = BaseTheme> = T | ((context: Context<Theme>) => T);
declare type TypedAtRulesKeys = `@layer ${'defaults' | 'base' | 'components' | 'shortcuts' | 'utilities' | 'overrides'}` | `@media screen(${string})` | `@media ${string}` | `@keyframes ${string}`;
declare type TypedAtRules = {
    [key in TypedAtRulesKeys]?: key extends `@layer ${string}` ? MaybeArray<CSSBase> : CSSBase;
};
interface BaseProperties extends TypedAtRules {
    '@import'?: MaybeArray<string | Falsey>;
    '@font-face'?: MaybeArray<CSSFontFace>;
}
interface CustomProperties {
    label?: string;
    '@apply'?: MaybeArray<string> | Falsey;
}
declare type CSSProperties = CSS$1.PropertiesFallback<string | Falsey, string | Falsey> & CSS$1.PropertiesHyphenFallback<string | Falsey, string | Falsey> & Partial<CustomProperties>;
declare type CSSFontFace = CSS$1.AtRule.FontFaceFallback & CSS$1.AtRule.FontFaceHyphenFallback;
interface CSSNested extends Record<string, CSSProperties | MaybeArray<CSSObject | string> | Falsey> {
}
declare type CSSBase = BaseProperties & CSSNested;
declare type CSSObject = CSSProperties & CSSBase;
declare type CSSValue = string | number | bigint | Falsey | StringLike;
declare type StringLike = {
    toString(): string;
} & string;
declare type Preflight = CSSBase | string;
interface TwindRule {
    /** The calculated precedence taking all variants into account. */
    p: number;
    o: number;
    /** Additional classNames to propagate, does not include name */
    c?: string;
    /** The rulesets (selectors and at-rules). expanded variants `@media ...`, `@supports ...`, `&:focus`, `.dark &` */
    r: string[];
    /** The name to use for `&` expansion in selectors. Maybe empty for at-rules like `@import`, `@font-face`, `@media`, ... */
    n?: string;
    /** The stringified declarations. */
    d?: string;
}
declare type RestoreSnapshot = () => void;
interface Twind<Theme extends BaseTheme = BaseTheme, Target = unknown> {
    (tokens: StringLike): string;
    readonly target: Target;
    readonly theme: ThemeFunction<ExtractUserTheme<Theme>>;
    readonly config: TwindConfig<Theme>;
    snapshot(): RestoreSnapshot;
    /** Clears all CSS rules from the sheet. */
    clear(): void;
    destroy(): void;
}
interface Context<Theme extends BaseTheme = BaseTheme> {
    /** Allows to resolve theme values. */
    theme: ThemeFunction<Theme>;
    /** escapes given string for use in a CSS selector or variable */
    e: (value: string) => string;
    /** create hash of given string — may be no-op eg returning the same input */
    h: (value: string) => string;
    /**
     * returns the dark color
     *
     * @private
     */
    d: (section: string, key: string, color: ColorValue) => ColorValue | Falsey;
    /**
     * resolves a variant
     *
     * @private
     */
    v: (value: string) => MaybeArray<string>;
    /**
     * resolves a rule
     *
     * @private
     */
    r: (value: string, isDark?: boolean) => RuleResult;
    /**
     * stringifies a CSS property and value to a declaration
     *
     * @private
     */
    s: (property: string, value: string) => string;
    /**
     * called right before the rule is stringified and inserted into the sheet
     *
     * @private
     */
    f: (rule: TwindRule) => TwindRule;
}
declare type ThemeValue<T> = T extends Record<string, infer V> ? Exclude<V, Record<string, V>> : T;
declare type KebabCase<S> = S extends `${infer C}${infer T}` ? KebabCase<T> extends infer U ? U extends string ? T extends Uncapitalize<T> ? `${Uncapitalize<C>}${U}` : `${Uncapitalize<C>}-${U}` : never : never : S;
interface ThemeFunction<Theme extends BaseTheme = BaseTheme> {
    (): Theme;
    <Section extends keyof Theme & string>(section: Section | KebabCase<Section>): Theme[Section];
    <Section extends keyof Theme & string, Key extends keyof Theme[Section]>(section: Section | KebabCase<Section>, key: Key): ThemeValue<Theme[Section]> | undefined;
    <Section extends keyof Theme & string>(section: Section | KebabCase<Section>, key: string): ThemeValue<Theme[Section]> | undefined;
    <Section extends keyof Theme & string, Key extends keyof Theme[Section]>(section: Section | KebabCase<Section>, key: Key, defaultValue: ThemeValue<Theme[Section]>): ThemeValue<Theme[Section]>;
    <Section extends keyof Theme & string>(section: Section | KebabCase<Section>, key: string, defaultValue: ThemeValue<Theme[Section]>): ThemeValue<Theme[Section]>;
    <Section extends keyof Theme & string>(key: `${Section}.${string}`): ThemeValue<Theme[Section]>;
    <Section extends keyof Theme & string>(key: `${Section}.${string}`, defaultValue: ThemeValue<Theme[Section]>): ThemeValue<Theme[Section]>;
    (section: string): unknown | undefined;
    (section: string, key: string): unknown | string | undefined;
    <T>(section: string, key: string, defaultValue: T): T | string;
    <T>(key: string, defaultValue: T): T | string;
}
declare type RuleResult = string | CSSObject | Falsey | Partial<TwindRule>[];
declare type RuleResolver<Theme extends BaseTheme = BaseTheme, Match extends MatchResult = MatchResult> = (match: Match, context: Context<Theme>) => RuleResult;
declare type Rule<Theme extends BaseTheme = BaseTheme> = string | RegExp | [pattern: MaybeArray<string | RegExp>, alias: string & {}] | [pattern: MaybeArray<string | RegExp>, css: CSSObject] | [pattern: MaybeArray<string | RegExp>, resolve: RuleResolver<Theme>] | [pattern: MaybeArray<string | RegExp>, property: keyof CSSProperties] | [
    pattern: MaybeArray<string | RegExp>,
    property: keyof CSSProperties,
    convert: MatchConverter<Theme>
];
declare type VariantResult = MaybeArray<string> | Falsey;
declare type VariantResolver<Theme extends BaseTheme = BaseTheme> = (match: MatchResult, context: Context<Theme>) => VariantResult;
declare type Variant<Theme extends BaseTheme = BaseTheme> = [
    condition: MaybeArray<string | RegExp>,
    resolve: string | VariantResolver<Theme>
];
declare type MatchResult = RegExpExecArray & {
    /** The substring following the most recent match */
    $$: string;
    /** Can be used to propagate a value like a theme value */
    dark?: boolean;
};
interface SheetRule {
    /** The calculated precedence taking all variants into account. */
    p: number;
    o: number;
    /** The name to use for `&` expansion in selectors. Maybe empty for at-rules like `@import`, `@font-face`, `@media`, ... */
    n?: string | null;
}
interface Sheet<Target = unknown> {
    readonly target: Target;
    insert(cssText: string, index: number, rule: SheetRule): void;
    snapshot(): RestoreSnapshot;
    /** Clears all CSS rules from the sheet. */
    clear(): void;
    destroy(): void;
    resume(addClassName: (className: string) => void, insert: (cssText: string, rule: SheetRule) => void): void;
}
declare type StringifyDeclaration<Theme extends BaseTheme = BaseTheme> = (property: string, value: string, context: Context<Theme>) => string;
declare type PreflightThunk<Theme extends BaseTheme = BaseTheme> = (context: Context<Theme>) => Preflight | Falsey;
declare type HashFunction = (value: string, defaultHash: (value: string) => string) => string;
declare type DarkModeConfig = 'media' | 'class' | (string & {}) | boolean | undefined | [mode: 'class', selector: string];
/**
 * Allows to return a dark color for the given light color.
 *
 * ```js
 * {
 *   // 50 -> 900, 100 -> 800, ..., 800 -> 100, 900 -> 50
 *   darkColor: autoDarkColor
 *   // custom resolvers
 *   darkColor: (section, key, { theme }) => theme(`${section}.${key}-dark`) as ColorValue
 *   darkColor: (section, key, { theme }) => theme(`dark.${section}.${key}`) as ColorValue
 *   darkColor: (section, key, { theme }) => theme(`${section}.dark.${key}`) as ColorValue
 *   darkColor: (section, key, context, lightColor) => generateDarkColor(lightColor),
 * }
 * ```
 *
 * Or use the light color to generate a dark color
 *
 * ```js
 * {
 *   darkColor: (section, key, context, color) => generateDark(color)
 * }
 * ```
 * @param section the theme section
 * @param key the theme key within section — maybe an arbitrary value `[...]`
 * @param context the context
 * @param color the current color
 * @returns the dark color to use
 */
declare type DarkColor<Theme extends BaseTheme> = (section: string, key: string, context: Context<Theme>, color: ColorValue) => ColorValue | Falsey;
declare type Finalize<Theme extends BaseTheme = BaseTheme> = (rule: TwindRule, context: Context<Theme>) => TwindRule;
interface TwindConfig<Theme extends BaseTheme = BaseTheme> {
    /** Allows to change how the `dark` variant is used (default: `"media"`) */
    darkMode?: DarkModeConfig;
    darkColor?: DarkColor<Theme>;
    theme: ThemeConfig<Theme>;
    preflight: false | MaybeThunk<Preflight | Falsey, Theme>[];
    variants: Variant<Theme>[];
    rules: Rule<Theme>[];
    hash?: boolean | undefined | HashFunction;
    stringify: StringifyDeclaration<Theme>;
    ignorelist: (string | RegExp)[];
    finalize: Finalize<Theme>[];
}
declare type ArrayType<T> = T extends (infer Item)[] ? Item : T;
declare type ExtractTheme<T> = T extends Preset<infer Theme> ? Theme : T;
declare type ExtractUserTheme<T> = {
    [key in keyof T]: key extends 'extend' ? never : T[key] extends ThemeSectionResolver<infer Value, T & BaseTheme> ? Value : T[key];
} & BaseTheme;
/** @experimental */
declare type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
declare type ExtractThemes<Theme, Presets extends Preset<any>[]> = UnionToIntersection<ExtractTheme<ExtractUserTheme<Theme> | BaseTheme | ArrayType<Presets>>>;
interface TwindPresetConfig<Theme = BaseTheme> {
    /** Allows to change how the `dark` variant is used (default: `"media"`) */
    darkMode?: DarkModeConfig;
    darkColor?: DarkColor<Theme & BaseTheme>;
    theme?: ThemeConfig<Theme & BaseTheme>;
    preflight?: false | MaybeArray<Preflight | PreflightThunk<Theme & BaseTheme>>;
    variants?: Variant<Theme & BaseTheme>[];
    rules?: Rule<Theme & BaseTheme>[];
    hash?: boolean | undefined | HashFunction;
    stringify?: StringifyDeclaration<Theme & BaseTheme>;
    ignorelist?: MaybeArray<string | RegExp>;
    finalize?: MaybeArray<Finalize<Theme & BaseTheme>>;
}
interface TwindUserConfig<Theme = BaseTheme, Presets extends Preset<any>[] = Preset[]> {
    presets?: Presets;
    /** Allows to change how the `dark` variant is used (default: `"media"`) */
    darkMode?: DarkModeConfig;
    darkColor?: DarkColor<BaseTheme & ExtractThemes<Theme, Presets>>;
    theme?: Theme | ThemeConfig<BaseTheme & ExtractThemes<Theme, Presets>>;
    preflight?: false | MaybeArray<Preflight | PreflightThunk<BaseTheme & ExtractThemes<Theme, Presets>>>;
    variants?: Variant<BaseTheme & ExtractThemes<Theme, Presets>>[];
    rules?: Rule<BaseTheme & ExtractThemes<Theme, Presets>>[];
    /**
     * Enables hashing of all classes (default: `false`).
     *
     * If a function is given it can be used to hash only certain classes:
     *
     * ```js
     * {
     *   hash(className, defaultHash) {
     *     if (/^[~@]\(/.test(className)) {
     *       // a shortcut like `~(...)` or apply like `@(...)`
     *       return defaultHash(className)
     *     }
     *     return className
     *   }
     * }
     *```
     */
    hash?: boolean | undefined | HashFunction;
    stringify?: StringifyDeclaration<BaseTheme & ExtractThemes<Theme, Presets>>;
    ignorelist?: MaybeArray<string | RegExp>;
    finalize?: MaybeArray<Finalize<Theme & BaseTheme>>;
}
interface BaseTheme {
    screens: Record<string, MaybeArray<ScreenValue>>;
    colors: Record<string, MaybeColorValue>;
}
declare type ScreenValue = string | {
    raw: string;
} | {
    min: string;
    max?: string;
} | {
    min?: string;
    max: string;
};
interface ColorFunctionOptions {
    opacityVariable?: string | undefined;
    opacityValue?: string | undefined;
}
declare type ColorFunction = (options: ColorFunctionOptions) => string;
interface ColorRecord extends Record<string, MaybeColorValue> {
}
declare type ColorValue = string | ColorFunction;
declare type MaybeColorValue = ColorValue | ColorRecord;
interface ThemeSectionResolverContext<Theme extends BaseTheme = BaseTheme> {
    readonly colors: Theme['colors'];
    readonly theme: ThemeFunction<Theme>;
    /**
     * No-op function as negated values are automatically infered and do _not_ need to be in the theme.
     */
    readonly negative: (scale: Record<string, string>) => Record<string, string>;
    readonly breakpoints: (screens: Record<string, MaybeArray<ScreenValue>>) => Record<string, string>;
}
interface ThemeSectionResolver<Value, Theme extends BaseTheme = BaseTheme> {
    (context: ThemeSectionResolverContext<Theme>): Value;
}
declare type ThemeSection<Value, Theme extends BaseTheme = BaseTheme> = Value | ThemeSectionResolver<Value, Theme>;
declare type PartialTheme<Theme extends BaseTheme = BaseTheme> = {
    [Section in keyof Theme]?: ThemeSection<Theme[Section], Theme>;
};
declare type ThemeConfig<Theme extends BaseTheme = BaseTheme> = PartialTheme<Theme> & {
    extend?: PartialTheme<Theme>;
};
declare type MatchConverter<Theme extends BaseTheme = BaseTheme, Match extends MatchResult = MatchResult> = (match: Match, context: Context<Theme>) => string;
interface PresetThunk<Theme = BaseTheme> {
    (config: TwindConfig<Theme & BaseTheme>): TwindPresetConfig<Theme>;
}
declare type Preset<Theme = BaseTheme> = TwindPresetConfig<Theme> | PresetThunk<Theme>;
interface ClassObject {
    [key: string]: boolean | number | unknown;
}
declare type Class = string | number | boolean | Falsey | ClassObject | Class[];
declare type NestedFunction = (strings: TemplateStringsArray | Class, ...interpolations: Class[]) => string;
declare type Nested = NestedFunction & {
    [label: string]: NestedFunction;
};

/**
 * @group Class Name Generators
 */
declare const apply: Nested;
/**
 * @group Class Name Generators
 */
declare const shortcut: Nested;

interface AnimationFunction {
    (animation: string | CSSProperties, waypoints: StringLike): StringLike;
}
declare type Animation = AnimationFunction & {
    [label: string]: AnimationFunction;
};
/**
 * @group Class Name Generators
 */
declare const animation: Animation;

declare type AutocompleteItem = {
    prefix?: string;
    suffix: string;
    theme?: {
        section: string;
        key: string;
    };
    modifiers?: AutocompleteModifier[] | false | null | undefined;
    color?: string | false | null | undefined;
    label?: string;
};
declare type AutocompleteModifier = {
    modifier: string;
    theme?: {
        section: string;
        key: string;
    };
    color?: string | false | null | undefined;
    label?: string;
};
interface AutocompleteContext<Theme extends BaseTheme = BaseTheme> {
    /** Allows to resolve theme values. */
    readonly theme: ThemeFunction<Theme>;
    readonly variants: Record<string, string>;
}
declare type AutocompleteProvider<Theme extends BaseTheme = BaseTheme> = (match: MatchResult, context: AutocompleteContext<Theme>) => (string | AutocompleteItem)[];
/**
 * @experimental
 * @group Configuration
 * @param resolver
 * @param autocomplete
 */
declare function withAutocomplete<Theme extends BaseTheme = BaseTheme>(resolver: RuleResolver<Theme>, autocomplete: AutocompleteProvider<Theme> | false | null | undefined): RuleResolver<Theme>;
declare function withAutocomplete<Theme extends BaseTheme = BaseTheme>(resolver: VariantResolver<Theme>, autocomplete: AutocompleteProvider<Theme> | false | null | undefined): VariantResolver<Theme>;
declare function withAutocomplete<Theme extends BaseTheme = BaseTheme>(rule: Rule<Theme>, autocomplete: AutocompleteProvider<Theme> | false | null | undefined): Rule<Theme>;
/**
 * @internal
 * @param resolver
 * @returns
 */
declare function getAutocompleteProvider<Theme extends BaseTheme = BaseTheme>(resolver: RuleResolver<Theme> | VariantResolver<Theme>): AutocompleteProvider<Theme> | undefined;

/**
 * @internal
 * @param color
 * @param options
 * @returns
 */
declare function toColorValue(color: ColorValue, options?: ColorFunctionOptions): string;
/**
 * Looks for a matching dark color within a [tailwind color palette](https://tailwindcss.com/docs/customizing-colors) (`50`, `100`, `200`, ..., `800`, `900`).
 *
 * ```js
 * defineConfig({
 *   darkColor: autoDarkColor,
 * })
 * ```
 *
 * **Note**: Does not work for arbitrary values like `[theme(colors.gray.500)]` or `[theme(colors.gray.500, #ccc)]`.
 *
 * @group Configuration
 * @param section within theme to use
 * @param key of the light color or an arbitrary value
 * @param context to use
 * @returns the dark color if found
 */
declare function autoDarkColor(section: string, key: string, { theme }: Context<any>): ColorValue | Falsey;

/**
 * @group Class Name Generators
 * @param strings
 * @param interpolations
 */
declare function css(strings: TemplateStringsArray, ...interpolations: readonly CSSValue[]): string;
declare function css(style: CSSObject | string): string;

/**
 * Constructs `class` strings conditionally.
 *
 * Twinds version of popular libraries like [classnames](https://github.com/JedWatson/classnames) or [clsx](https://github.com/lukeed/clsx).
 * The key advantage of `cx` is that it supports twinds enhanced class name syntax like grouping and aliases.
 *
 * @group Class Name Generators
 * @param strings
 * @param interpolations
 * @returns
 */
declare function cx(strings: TemplateStringsArray, ...interpolations: Class[]): string;
/**
 * Constructs `class` strings conditionally.
 *
 * Twinds version of popular libraries like [classnames](https://github.com/JedWatson/classnames) or [clsx](https://github.com/lukeed/clsx).
 * The key advantage of `cx` is that it supports twinds enhanced class name syntax like grouping and aliases.
 *
 * @group Class Name Generators
 * @param input
 */
declare function cx(...input: Class[]): string;

/**
 * @group Configuration
 * @param param0
 * @returns
 */
declare function defineConfig<Theme = BaseTheme, Presets extends Preset<any>[] = Preset[]>({ presets, ...userConfig }: TwindUserConfig<Theme, Presets>): TwindConfig<BaseTheme & ExtractThemes<Theme, Presets>>;

interface InjectGlobalFunction {
    (style: CSSBase | string): void;
    (strings: TemplateStringsArray, ...interpolations: readonly CSSValue[]): void;
    bind(thisArg?: ((tokens: string) => string) | undefined | void): InjectGlobalFunction;
    call(thisArg: ((tokens: string) => string) | undefined | void, style: CSSBase | string): void;
    apply(thisArg: ((tokens: string) => string) | undefined | void, args: [CSSBase | string]): void;
}
/**
 * Injects styles into the global scope and is useful for applications such as gloabl styles, CSS resets or font faces.
 *
 * It **does not** return a class name, but adds the styles within the base layer to the stylesheet directly.
 *
 * @group Style Injectors
 */
declare const injectGlobal: InjectGlobalFunction;

/**
 * @group Runtime
 * @param config
 * @param isProduction
 */
declare function install<Theme extends BaseTheme = BaseTheme>(config: TwindConfig<Theme>, isProduction?: boolean): Twind<Theme & BaseTheme>;
declare function install<Theme = BaseTheme, Presets extends Preset<any>[] = Preset[]>(config: TwindUserConfig<Theme, Presets>, isProduction?: boolean): Twind<BaseTheme & ExtractThemes<Theme, Presets>>;

interface KeyframesFunction {
    (style: CSSObject | string): StringLike;
    (strings: TemplateStringsArray, ...interpolations: readonly CSSValue[]): StringLike;
    bind(thisArg?: ((tokens: string) => string) | undefined | void): Keyframes & {
        [label: string]: KeyframesFunction;
    };
    call(thisArg: ((tokens: string) => string) | undefined | void, style: CSSObject | string): StringLike;
    call(thisArg: ((tokens: string) => string) | undefined | void, strings: TemplateStringsArray, ...interpolations: readonly CSSValue[]): StringLike;
    apply(thisArg: ((tokens: string) => string) | undefined | void, args: [CSSObject | string]): StringLike;
    apply(thisArg: ((tokens: string) => string) | undefined | void, args: [CSSObject | string] | [strings: TemplateStringsArray, ...interpolations: readonly CSSValue[]]): StringLike;
}
declare type Keyframes = KeyframesFunction & {
    [label: string]: KeyframesFunction;
};
/**
 * **Note**: The styles will be injected on first use.
 *
 * @group Style Injectors
 */
declare const keyframes: Keyframes;

interface TwindMutationObserver {
    observe: (target: Node) => void;
    disconnect: () => void;
}
/**
 * @group Runtime
 * @param tw
 * @param target
 * @returns
 * @internal
 */
declare function mo<Theme extends BaseTheme = BaseTheme, Target = unknown>(tw: Twind<Theme, Target>): TwindMutationObserver;
/**
 * @group Runtime
 * @param tw
 * @param target
 * @returns
 */
declare function observe<Theme extends BaseTheme = BaseTheme, Target = unknown>(tw?: Twind<Theme, Target>, target?: false | Node): Twind<Theme, Target>;

interface ParsedRule {
    /**
     * The utility name including `-` if set, but without `!` and variants
     */
    readonly n: string;
    /**
     * All variants without trailing colon: `hover`, `after:`, `[...]`
     */
    readonly v: string[];
    /**
     * Something like `!underline` or `!bg-red-500` or `!red-500`
     */
    readonly i?: boolean;
}
interface ParsedDevRule extends ParsedRule {
    readonly a: string[];
    readonly l: [start: number, end: number];
}
/**
 * @internal
 * @param token
 * @returns
 */
declare function parse(token: string): ParsedRule[];

declare type ThemeMatchResult<Value> = MatchResult & {
    /** The found theme value */
    _: Value;
};
declare type ThemeRuleResolver<Value, Theme extends BaseTheme = BaseTheme> = RuleResolver<Theme, ThemeMatchResult<Value>>;
declare type ThemeMatchConverter<Value, Theme extends BaseTheme = BaseTheme> = MatchConverter<Theme, ThemeMatchResult<Value>>;
/**
 * @group Configuration
 * @param pattern
 */
declare function match<Theme extends BaseTheme = BaseTheme>(pattern: MaybeArray<string | RegExp>): Rule<Theme>;
/**
 * @group Configuration
 * @param pattern
 * @param resolver
 */
declare function match<Theme extends BaseTheme = BaseTheme>(pattern: MaybeArray<string | RegExp>, resolver: RuleResolver<Theme>): Rule<Theme>;
/**
 * @group Configuration
 * @param pattern
 * @param resolve
 */
declare function match<Theme extends BaseTheme = BaseTheme>(pattern: MaybeArray<string | RegExp>, resolve: (string & {}) | CSSObject): Rule<Theme>;
/**
 * @group Configuration
 * @param pattern
 * @param resolve
 * @param convert
 */
declare function match<Theme extends BaseTheme = BaseTheme>(pattern: MaybeArray<string | RegExp>, resolve: keyof CSSProperties, convert?: MatchConverter<Theme>): Rule<Theme>;
/**
 * @group Configuration
 * @internal
 * @deprecated Use {@link match} instead.
 */
declare function fromMatch<Theme extends BaseTheme = BaseTheme>(): RuleResolver<Theme>;
/**
 * @group Configuration
 * @internal
 * @deprecated Use {@link match} instead.
 */
declare function fromMatch<Theme extends BaseTheme = BaseTheme>(resolver: RuleResolver<Theme>): RuleResolver<Theme>;
/**
 * @group Configuration
 * @internal
 * @deprecated Use {@link match} instead.
 */
declare function fromMatch<Theme extends BaseTheme = BaseTheme>(resolve: keyof CSSProperties, convert?: MatchConverter<Theme>): RuleResolver<Theme>;
/**
 * @group Configuration
 * @internal
 * @deprecated Use {@link match} instead.
 */
declare function fromMatch<Theme extends BaseTheme = BaseTheme>(resolve: string | CSSObject): RuleResolver<Theme>;
/**
 * @group Configuration
 * @param pattern
 * @param section
 * @param resolve
 * @param convert
 * @returns
 */
declare function matchTheme<Theme extends BaseTheme = BaseTheme, Section extends keyof Theme & string = keyof Theme & string>(pattern: MaybeArray<string | RegExp>, 
/** Theme section to use (default: `$1` — The first matched group) */
section?: '' | Section | KebabCase<Section>, 
/** The css property (default: value of {@link section}) */
resolve?: keyof CSSProperties | ThemeRuleResolver<ThemeValue<Theme[Section]>, Theme>, convert?: ThemeMatchConverter<ThemeValue<Theme[Section]>, Theme>): Rule<Theme>;
/**
 * @group Configuration
 * @internal
 * @deprecated Use {@link matchTheme} instead.
 * @param section
 * @param resolve
 * @param convert
 * @returns
 */
declare function fromTheme<Theme extends BaseTheme = BaseTheme, Section extends keyof Theme & string = keyof Theme & string>(
/** Theme section to use (default: `$1` — The first matched group) */
section?: '' | Section | KebabCase<Section>, 
/** The css property (default: value of {@link section}) */
resolve?: keyof CSSProperties | ThemeRuleResolver<ThemeValue<Theme[Section]>, Theme>, convert?: ThemeMatchConverter<ThemeValue<Theme[Section]>, Theme>): RuleResolver<Theme>;
declare type FilterByThemeValue<Theme, Value> = {
    [key in keyof Theme & string]: ThemeValue<Theme[key]> extends Value ? Theme[key] : never;
};
interface ColorFromThemeValue {
    value: string;
    color: ColorFunction;
    opacityVariable: string | undefined;
    opacityValue: string | undefined;
}
interface ColorFromThemeOptions<Theme extends BaseTheme = BaseTheme, Section extends keyof FilterByThemeValue<Theme, ColorValue> = keyof FilterByThemeValue<Theme, ColorValue>, OpacitySection extends keyof FilterByThemeValue<Theme, string> = keyof FilterByThemeValue<Theme, string>> {
    /** Theme section to use (default: `$0.replace('-', 'Color')` — The matched string with `Color` appended) */
    section?: Section | KebabCase<Section>;
    /** The css property (default: value of {@link section}) */
    property?: keyof CSSProperties;
    /** `--tw-${$0}opacity` -> '--tw-text-opacity' */
    opacityVariable?: string | false;
    /** `section.replace('Color', 'Opacity')` -> 'textOpacity' */
    opacitySection?: OpacitySection;
    selector?: string;
}
/**
 * @group Configuration
 * @param pattern
 * @param options
 * @param resolve
 * @returns
 */
declare function matchColor<Theme extends BaseTheme = BaseTheme, Section extends keyof FilterByThemeValue<Theme, ColorValue> = keyof FilterByThemeValue<Theme, ColorValue>, OpacitySection extends keyof FilterByThemeValue<Theme, string> = keyof FilterByThemeValue<Theme, string>>(pattern: MaybeArray<string | RegExp>, options?: ColorFromThemeOptions<Theme, Section, OpacitySection>, resolve?: ThemeRuleResolver<ColorFromThemeValue, Theme>): Rule<Theme>;
/**
 * @group Configuration
 * @internal
 * @deprecated Use {@link matchColor} instead.
 * @param options
 * @param resolve
 * @returns
 */
declare function colorFromTheme<Theme extends BaseTheme = BaseTheme, Section extends keyof FilterByThemeValue<Theme, ColorValue> = keyof FilterByThemeValue<Theme, ColorValue>, OpacitySection extends keyof FilterByThemeValue<Theme, string> = keyof FilterByThemeValue<Theme, string>>(options?: ColorFromThemeOptions<Theme, Section, OpacitySection>, resolve?: ThemeRuleResolver<ColorFromThemeValue, Theme>): RuleResolver<Theme>;
/**
 * @internal
 * @param input
 */
declare function parseValue(input: string): [value: string, modifier: string | undefined] | [value: undefined, modifier: string | undefined];
/**
 * @internal
 * @param property
 * @param value
 * @returns
 */
declare function toCSS(property: string, value: string | ColorFromThemeValue): CSSObject;
/**
 * @internal
 * @param value
 * @param section
 * @param context
 * @returns
 */
declare function arbitrary<Theme extends BaseTheme = BaseTheme>(value: string, section: string | undefined, context: Context<Theme>): string | undefined;
/**
 * @internal
 * @param value
 * @returns
 */
declare function normalize(value: string): string;

/**
 * @group Runtime
 * @param install
 * @returns
 */
declare function auto(install: () => void): () => void;
/**
 * A proxy to the currently active Twind instance.
 * @group Style Injectors
 */
declare const tw: Twind<any, any>;
declare type SheetFactory<SheetTarget = unknown> = () => Sheet<SheetTarget>;
/**
 * Manages a single Twind instance — works in browser, Node.js, Deno, workers...
 *
 * @group Runtime
 * @param config
 * @param sheet
 * @param target
 * @returns
 */
declare function setup<Theme extends BaseTheme = BaseTheme, SheetTarget = unknown>(config?: TwindConfig<Theme>, sheet?: Sheet<SheetTarget> | SheetFactory<SheetTarget>, target?: HTMLElement): Twind<Theme, SheetTarget>;
declare function setup<Theme = BaseTheme, Presets extends Preset<any>[] = Preset[], SheetTarget = unknown>(config?: TwindUserConfig<Theme, Presets>, sheet?: Sheet<SheetTarget> | SheetFactory<SheetTarget>, target?: HTMLElement): Twind<BaseTheme & ExtractThemes<Theme, Presets>, SheetTarget>;

/**
 * @group Sheets
 * @param element
 * @returns
 */
declare function cssom(element?: CSSStyleSheet | HTMLStyleElement | string | null | false): Sheet<CSSStyleSheet>;
/**
 * @group Sheets
 * @param element
 * @returns
 */
declare function dom(element?: HTMLStyleElement | string | null | false): Sheet<HTMLStyleElement>;
/**
 * @group Sheets
 * @param includeResumeData
 * @returns
 */
declare function virtual(includeResumeData?: boolean): Sheet<string[]>;
/**
 * Returns a sheet useable in the current environment.
 *
 * @group Sheets
 * @param useDOMSheet usually something like `process.env.NODE_ENV != 'production'` or `import.meta.env.DEV` (default: browser={@link cssom}, server={@link virtual})
 * @param disableResume to not include or use resume data
 * @returns a sheet to use
 */
declare function getSheet(useDOMSheet?: boolean, disableResume?: boolean): Sheet<string[] | HTMLStyleElement | CSSStyleSheet>;
/**
 * @group Sheets
 * @param target
 * @returns
 */
declare function stringify(target: unknown): string;

/**
 * Options for {@link inline}
 */
interface InlineOptions {
    /**
     * {@link Twind} instance to use (default: {@link @twind/core.tw})
     */
    tw?: Twind<any, any>;
    /**
     * Allows to minify the resulting CSS.
     */
    minify?: InlineMinify;
}
interface InlineMinify {
    /**
     * Called to minify the CSS.
     *
     * @param css the CSS to minify
     * @param html the HTML that will be used — allows to only include above-the-fold CSS
     * @return the resulting CSS
     */
    (css: string, html: string): string;
}
/**
 * Used for static HTML processing (usually to provide SSR support for your javascript-powered web apps)
 *
 * 1. parse the markup and process element classes with the provided Twind instance
 * 2. update the class attributes _if_ necessary
 * 3. inject a style element with the CSS as last element into the head
 * 4. return the HTML string with the final element classes
 *
 * ```js
 * import { inline } from '@twind/core'
 *
 * function render() {
 *   return inline(renderApp())
 * }
 * ```
 *
 * Minify CSS with [@parcel/css](https://www.npmjs.com/package/@parcel/css):
 *
 * ```js
 * import { inline } from '@twind/core'
 * import { transform } from '@parcel/css'
 *
 * function render() {
 *   return inline(renderApp(), { minify: (css) => transform({ filename: 'twind.css', code: Buffer.from(css), minify: true }) })
 * }
 * ```
 *
 * You can provide your own Twind instance:
 *
 * ```js
 * import { inline } from '@twind/core'
 * import { tw } from './custom/twind/instance'
 *
 * function render() {
 *   return inline(renderApp(), { tw })
 * }
 * ```
 *
 * @group Static Extraction
 * @param markup HTML to process
 * @param options to customize the processing
 * @returns the resulting HTML
 */
declare function inline(markup: string, options?: InlineOptions['tw'] | InlineOptions): string;
/**
 * Result of {@link extract}
 */
interface ExtractResult {
    /** The possibly modified HTML */
    html: string;
    /** The generated CSS */
    css: string;
}
/**
 * Used for static HTML processing (usually to provide SSR support for your javascript-powered web apps)
 *
 * **Note**: Consider using {@link inline} instead.
 *
 * 1. parse the markup and process element classes with the provided Twind instance
 * 2. update the class attributes _if_ necessary
 * 3. return the HTML string with the final element classes
 *
 * ```js
 * import { extract } from '@twind/core'
 *
 * function render() {
 *   const { html, css } = extract(renderApp())
 *
 *   // inject as last element into the head
 *   return html.replace('</head>', `<style data-twind>${css}</style></head>`)
 * }
 * ```
 *
 * You can provide your own Twind instance:
 *
 * ```js
 * import { extract } from '@twind/core'
 * import { tw } from './custom/twind/instance'
 *
 * function render() {
 *   const { html, css } = extract(renderApp(), tw)
 *
 *   // inject as last element into the head
 *   return html.replace('</head>', `<style data-twind>${css}</style></head>`)
 * }
 * ```
 *
 * @group Static Extraction
 * @param markup HTML to process
 * @param tw a {@link Twind} instance (default: twind managed tw)
 * @returns the possibly modified html and css
 */
declare function extract(html: string, tw?: Twind<any, any>): ExtractResult;
/**
 * Used for static HTML processing (usually to provide SSR support for your javascript-powered web apps)
 *
 * **Note**: Consider using {@link inline} or {@link extract} instead.
 *
 * 1. parse the markup and process element classes with the provided Twind instance
 * 2. update the class attributes _if_ necessary
 * 3. return the HTML string with the final element classes
 *
 * ```js
 * import { consume, stringify, tw } from '@twind/core'
 *
 * function render() {
 *   const html = renderApp()
 *
 *   // remember global classes
 *   const restore = tw.snapshot()
 *
 *   // generated markup
 *   const markup = consume(html)
 *
 *   // create CSS
 *   const css = stringify(tw.target)
 *
 *   // restore global classes
 *   restore()
 *
 *   // inject as last element into the head
 *   return markup.replace('</head>', `<style data-twind>${css}</style></head>`)
 * }
 * ```
 *
 * You can provide your own Twind instance:
 *
 * ```js
 * import { consume, stringify } from '@twind/core'
 * import { tw } from './custom/twind/instance'
 *
 * function render() {
 *   const html = renderApp()
 *
 *   // remember global classes
 *   const restore = snapshot(tw.target)
 *
 *   // generated markup
 *   const markup = consume(html)
 *
 *   // restore global classes
 *   restore()
 *
 *   // create CSS
 *   const css = stringify(tw.target)
 *
 *   // inject as last element into the head
 *   return markup.replace('</head>', `<style data-twind>${css}</style></head>`)
 * }
 * ```
 *
 * @group Static Extraction
 * @param markup HTML to process
 * @param tw a {@link Twind} instance
 * @returns possibly modified HTML
 */
declare function consume(markup: string, tw?: (className: string) => string): string;

declare type StrictMorphVariant<T> = T extends number ? `${T}` | T : T extends 'true' ? true | T : T extends 'false' ? false | T : T;
declare type MorphVariant<T> = T extends number ? `${T}` | T : T extends 'true' ? boolean | T : T extends 'false' ? boolean | T : T extends `${number}` ? number | T : T;
declare type StyleTokenValue = string | Falsey;
declare type StyleToken = StyleTokenValue;
/**
 * Allows to extract the supported properties of a style function.
 *
 * Here is an example for `react`
 * ```js
 * import { HTMLAttributes } from "react";
 * import { style, PropsOf } from "@twind/core";
 * const button = style({ ... })
 * type ButtonProps = PropsOf<typeof button>
 * export const Button = (props: ButtonProps & HTMLAttributes<HTMLButtonElement>) => {
 *   return <button className={style(props)} {...rest} />
 * }
 * ```
 */
declare type PropsOf<T> = T extends Style<infer Variants> ? {
    [key in keyof Variants]: MorphVariant<keyof Variants[key]>;
} : never;
declare type DefaultVariants<Variants> = {
    [key in keyof Variants]?: StrictMorphVariant<keyof Variants[key]> | (Record<string, StrictMorphVariant<keyof Variants[key]>> & {
        /** initial breakpoint */
        _?: StrictMorphVariant<keyof Variants[key]>;
    });
};
declare type VariantsProps<Variants> = {
    [key in keyof Variants]?: MorphVariant<keyof Variants[key]> | (Record<string, MorphVariant<keyof Variants[key]>> & {
        /** initial breakpoint */
        _?: MorphVariant<keyof Variants[key]>;
    });
};
declare type When<Variants> = {
    [key in keyof Variants]?: StrictMorphVariant<keyof Variants[key]>;
};
interface StyleConfig<Variants, BaseVariants = {}> {
    /** Used as prefix */
    label?: string;
    base?: StyleToken;
    props?: Variants & {
        [variant in keyof BaseVariants]?: {
            [key in keyof BaseVariants[variant]]?: StyleToken;
        };
    };
    defaults?: DefaultVariants<Variants & BaseVariants>;
    when?: [match: When<Variants & BaseVariants>, then: StyleToken][];
}
interface StyleFunction {
    <Variants>(config?: StyleConfig<Variants>): Style<Variants>;
    <Variants, BaseVariants>(base: Style<BaseVariants>, config?: StyleConfig<Variants, BaseVariants>): Style<Variants & BaseVariants>;
}
declare type StyleProps<Variants> = VariantsProps<Variants>;
interface Style<Variants> {
    /**
     * CSS Class associated with the current component.
     *
     * ```jsx
     * const button = style({
     *   base: css({
     *     color: "DarkSlateGray"
     *   })
     * })
     *
     * <div className={button()} />
     * ```
     * <br />
     */
    (props?: StyleProps<Variants>): string;
    /**
     * To be used as resolve within config.rules:
     *
     * ```js
     * {
     *   rules: [
     *     // label?prop=value&other=propValue
     *     // if the style has base eg no prop is required
     *     ['label(\\?.+)?', style( /* ... *\/ )],
     *
     *     // if the style requires at least one prop
     *     ['label\\?(.+)', style( /* ... *\/ )],
     *   ]
     * }
     * ```
     *
     * The first group is used to extract the props using {@link !URLSearchParams | URLSearchParams}.
     */
    (match: MatchResult): string;
    readonly defaults: StyleProps<Variants>;
    /**
     * CSS Class associated with the current component.
     *
     * ```js
     * const button = style({
     *   base: css`
     *     color: "DarkSlateGray"
     *   `
     * })
     *
     * <div className={button.className} />
     * ```
     */
    readonly className: string;
    /**
     * CSS Selector associated with the current component.
     *
     * ```js
     * const button = style({
     *   base: css({
     *     color: "DarkSlateGray"
     *   })
     * })
     *
     * const Card = styled({
     *   base: css`
     *     & ${button.selector} {
     *       boxShadow: "0 0 0 5px"
     *     }
     *   `
     * })
     * ```
     */
    readonly selector: string;
}
/**
 * @group Class Name Generators
 */
declare const style: StyleFunction;

/**
 * @group Runtime
 * @param config
 * @param sheet
 */
declare function twind<Theme extends BaseTheme = BaseTheme, Target = unknown>(config: TwindConfig<Theme>, sheet: Sheet<Target>): Twind<Theme, Target>;
declare function twind<Theme = BaseTheme, Presets extends Preset<any>[] = Preset[], Target = unknown>(config: TwindUserConfig<Theme, Presets>, sheet: Sheet<Target>): Twind<BaseTheme & ExtractThemes<Theme, Presets>, Target>;

interface TxFunction {
    (...classes: Class[]): string;
    (strings: TemplateStringsArray, ...interpolations: readonly Class[]): string;
    bind(thisArg?: ((tokens: string) => string) | undefined | void): TxFunction;
    call(thisArg: ((tokens: string) => string) | undefined | void, ...classes: Class[]): string;
    call(thisArg: ((tokens: string) => string) | undefined | void, strings: TemplateStringsArray, ...interpolations: readonly Class[]): string;
    apply(thisArg: ((tokens: string) => string) | undefined | void, classes: Class[] | [strings: TemplateStringsArray, ...interpolations: readonly Class[]]): string;
}
/**
 * Combines {@link tw} and {@link cx}.
 *
 * Using the default `tw` instance:
 *
 * ```js
 * import { tw } from '@twind/core'
 * tx`underline ${falsy && 'italic'}`
 * tx('underline', falsy && 'italic')
 * tx({'underline': true, 'italic': false})
 *
 * // using a custom twind instance
 * import { tw } from './custom/twind'
 * import { tw } from './custom/twind'
 * tx.bind(tw)
 * ```
 *
 * Using a custom `tw` instance:
 *
 * ```js
 * import { tx as tx$ } from '@twind/core'
 * import { tw } from './custom/twind'
 *
 * export const tx = tx$.bind(tw)
 *
 * tx`underline ${falsy && 'italic'}`
 * tx('underline', falsy && 'italic')
 * tx({'underline': true, 'italic': false})
 * ```
 *
 * @group Style Injectors
 * @param this {@link Twind} instance to use (default: {@link tw})
 * @param strings
 * @param interpolations
 * @returns the class name
 */
declare const tx: TxFunction;

/**
 * @internal
 */
declare const escape: typeof CSS.escape;
/**
 * @group Configuration
 * @param value
 * @returns
 */
declare function hash(value: string): string;
/**
 * @internal
 * @param screen
 * @param prefix
 * @returns
 */
declare function mql(screen: MaybeArray<ScreenValue>, prefix?: string): string;
/**
 * @internal
 * @param value
 * @returns
 */
declare function asArray<T>(value?: T): T extends Array<any> ? T : T[];
/**
 * @internal
 * @param value
 * @returns
 */
declare function identity<T>(value: T): T;
/**
 * @internal
 */
declare function noop(): void;

export { Animation, AnimationFunction, ArrayType, AutocompleteContext, AutocompleteItem, AutocompleteModifier, AutocompleteProvider, BaseProperties, BaseTheme, CSSBase, CSSFontFace, CSSNested, CSSObject, CSSProperties, CSSValue, Class, ClassObject, ColorFromThemeOptions, ColorFromThemeValue, ColorFunction, ColorFunctionOptions, ColorRecord, ColorValue, Context, CustomProperties, DarkColor, DarkModeConfig, DefaultVariants, ExtractResult, ExtractTheme, ExtractThemes, ExtractUserTheme, Falsey, FilterByThemeValue, Finalize, HashFunction, InjectGlobalFunction, InlineMinify, InlineOptions, KebabCase, Keyframes, KeyframesFunction, MatchConverter, MatchResult, MaybeArray, MaybeColorValue, MaybeThunk, MorphVariant, Nested, NestedFunction, ParsedDevRule, ParsedRule, PartialTheme, Preflight, PreflightThunk, Preset, PresetThunk, PropsOf, RestoreSnapshot, Rule, RuleResolver, RuleResult, ScreenValue, Sheet, SheetFactory, SheetRule, StrictMorphVariant, StringLike, StringifyDeclaration, Style, StyleConfig, StyleFunction, StyleProps, StyleToken, StyleTokenValue, ThemeConfig, ThemeFunction, ThemeMatchConverter, ThemeMatchResult, ThemeRuleResolver, ThemeSection, ThemeSectionResolver, ThemeSectionResolverContext, ThemeValue, Twind, TwindConfig, TwindMutationObserver, TwindPresetConfig, TwindRule, TwindUserConfig, TxFunction, TypedAtRules, TypedAtRulesKeys, UnionToIntersection, Variant, VariantResolver, VariantResult, VariantsProps, When, animation, apply, arbitrary, asArray, auto, autoDarkColor, colorFromTheme, consume, css, cssom, cx, defineConfig, dom, escape, extract, fromMatch, fromTheme, getAutocompleteProvider, getSheet, hash, identity, injectGlobal, inline, install, keyframes, match, matchColor, matchTheme, mo, mql, noop, normalize, observe, parse, parseValue, setup, shortcut, stringify, style, toCSS, toColorValue, tw, twind, tx, virtual, withAutocomplete };
//# sourceMappingURL=core.d.ts.map
