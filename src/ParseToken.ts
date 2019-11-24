import Token from "./token";
import {handler} from "./Handlers";

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

export default class ParseToken {

    statementBody: Array<ParseToken | Token>;

    constructor(name: string, handler: handler, statementBody: Array<ParseToken | Token>) { // if Token[], no token has children. otherwise, use ParseToken
        this.statementBody = statementBody;
    }
}
