"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const renderer_1 = __importDefault(require("./renderer"));
console.log(renderer_1.default(`
    import "./list";

    component "sample" #a#
        #b!#

        each $f: $G #List#
            $f
        #!List#

        #c#
            #d!#
            
            "Hello World"

            #e#
                #f!#
            #!e#
        #!c#
    #!a#

    each $p: $F #List#
        "Hello" $p
    #!List#
`));
//# sourceMappingURL=index.js.map