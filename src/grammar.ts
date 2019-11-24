export interface Grammar {
    [Key: string]: Matcher
}

// @ts-ignore
export type Matcher = Array<string | RegExp | Matcher> | Proxy<Array<Matcher>>;

const concatenation:any = {
    proxy: new Proxy([], { // simulate an array, but return the same regex for any requested index
        get(target, prop, receiver) {
            if (prop in Array.prototype) // If the request was to an array property rather than an element
                return Reflect.get(target, prop, receiver); // do the expected behaviour
            else // return custom object
                return concatenation.regex
        }
    }), // first try!
    regex: [/string|number|boolean|component|autoCloseComponent|variable/]
};

const grammar: Grammar = {
    import: [["keyword", "import"], ["string"]],
    component: [["keyword", "component"], ["string"], ["component"]],
    each: [["keyword", "each"], ["variable"], ["char", ":"], ["variable"], ["component"]],
    concatenation: concatenation.proxy
};

export default grammar;
