export interface Transform<Type> {
    stringify?: (value: Type) => string;
    parse: (value: string, element: HTMLElement) => Type;
}
declare const transforms: {
    string: Transform<string>;
    number: Transform<number>;
    boolean: Transform<boolean>;
    function: Transform<(...args: unknown[]) => unknown>;
    json: Transform<string>;
};
export type R2WCType = keyof typeof transforms;
export default transforms;
