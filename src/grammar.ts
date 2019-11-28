export interface Grammar {
    [Key: string]: Matcher
}

// @ts-ignore
export type Matcher = Array<string | RegExp | Matcher> | Proxy<Array<Matcher>>;

const concatenation: any = {
    proxy: new Proxy([], { // simulate an array, but return the same regex for any requested index
        get(target, prop, receiver) {
            if (prop in Array.prototype) // If the request was to an array property rather than an element
                if (prop === "length")
                    return Infinity;
                else
                    return Reflect.get(target, prop, receiver); // do the expected behaviour
            else // return custom object
                return "value";
        }
    }), // first try!
    regex: [/^string|number|boolean|tag|autoCloseTag|component|autoCloseComponent|variable$/]
};

export function isValue(value: string): boolean {
    const values = ["string", "number", "boolean", "tag", "autoCloseTag", "component", "autoCloseComponent", "variable"];

    return values.includes(value);
}

const grammar: Grammar = {
    import: [["keyword", "import"], ["string"]],
    componentDeclaration: [["keyword", "component"], ["string"], ["value"]],
    each: [["keyword", "each"], ["variable"], ["char", ":"], ["variable"], ["value"]],
    concatenation: concatenation.proxy
};

export default grammar;
