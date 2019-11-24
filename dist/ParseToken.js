"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// export default class ParseToken {
//
//     tokens: Token[];
//     handler: handler;
//     name: string;
//
//     constructor(statement: Token[], handler: handler, name: string) { // wrapper object for tokens. used to store multiple tokens. Useful for nested statements
//         this.tokens = statement;
//         this.handler = handler;
//         this.name = name;
//     }
//
//     call(): Element[] {
//         const elements: Element | Element[] | void =  this.handler(...this.tokens);
//
//         if (elements instanceof Array)
//             return elements;
//         else if (elements)
//             return [elements];
//         else
//             return [];
//     }
// }
class ParseToken {
    constructor(name, handler, statementBody) {
        this.statementBody = statementBody;
    }
}
exports.default = ParseToken;
//# sourceMappingURL=ParseToken.js.map