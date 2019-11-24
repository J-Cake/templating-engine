"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const concatenation = {
    proxy: new Proxy([], {
        get(target, prop, receiver) {
            if (prop in Array.prototype) // If the request was to an array property rather than an element
                return Reflect.get(target, prop, receiver); // do the expected behaviour
            else // return custom object
                return concatenation.regex;
        }
    }),
    regex: [/string|number|boolean|component|autoCloseComponent|variable/]
};
const grammar = {
    import: [["keyword", "import"], ["string"]],
    component: [["keyword", "component"], ["string"], ["component"]],
    each: [["keyword", "each"], ["variable"], ["char", ":"], ["variable"], ["component"]],
    concatenation: concatenation.proxy
};
exports.default = grammar;
//# sourceMappingURL=grammar.js.map