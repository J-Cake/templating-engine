import Token from "./token";
import { handler } from "./Handlers";
import Element from "./Element";
import Component from "./Component";
import CompilerError from "./CompilerError";

interface VarMap {
    [Key: string]: Token
}

interface ComponentMap {
    [Name: string]: Component
}

export default class ParseToken {
    static globalVars: VarMap = {};
    static globalComponents: ComponentMap = {};

    statementBody: Array<ParseToken | Token>;
    name: string;
    handler: handler;
    isLeafNode: boolean;

    parent?: ParseToken;
    variables: VarMap;
    components: ComponentMap;

    subName: string = "";

    constructor(name: string, handler: handler, statementBody: Array<ParseToken | Token>, isLeafNode: boolean) { // if Token[], no token has children. otherwise, use ParseToken
        this.statementBody = statementBody;

        console.log("statement", this.statementBody);

        for (const token of this.statementBody)
            if (token instanceof ParseToken)
                token.setParent(this);

        this.name = name;
        this.handler = handler;
        this.isLeafNode = isLeafNode;

        this.variables = {};
        this.components = {};
    }

    setSubName(name: string): ParseToken {
        this.subName = name;
        return this;
    }

    setParent(parent: ParseToken) {
        this.parent = parent;
    }

    resolveVariable(name: string): Token {
        let token: ParseToken = this;

        do {
            if (token.parent)
                token = token.parent;
            else
                break;
        } while (!(name in token.variables));

        if (token)
            return token.variables[name];
        else if (ParseToken.globalVars[name])
            return ParseToken.globalVars[name];
        else
            return new Token("BLANK", [], "<anonymous>", 0, 0); // TODO: return a truly null variable here or throw an exception.
    }

    resolveComponent(name: string): Component | null {

        let token: ParseToken = this;

        while (!(name in token.components)) {
            if (token.parent)
                token = token.parent;
            else
                break;
        }

        console.log(token);

        if (token)
            return token.components[name];
        else if (ParseToken.globalComponents[name])
            return ParseToken.globalComponents[name];
        else
            return null;
    }

    call(): Element[] {
        // this is where variables are accessed and created.
        return this.handler(this.parent || ParseToken.vars, ...this.statementBody.map(i => {
            if (i.name === "variable" && i instanceof Token)
                return this.resolveVariable(i.content.toString());
            else
                return i;
        }));
    }

    getOriginToken(): Token | null {
        // TODO: find origin Token
        function searchForTokens(tokens: Array<ParseToken | Token>): Token | null {
            const tok: Token | null = <Token>tokens.find(i => i instanceof Token) || null;
            if (tok)
                return tok;
            else {
                const toks: Array<ParseToken | Token>[] = (<ParseToken[]>tokens).map(i => i.statementBody);

                for (const token of toks) {
                    const tok = searchForTokens(token);

                    if (tok)
                        return tok;
                }
            }

            return null;
        }

        return searchForTokens(this.statementBody);
    }

    static vars: any = {
        get variables() {
            return ParseToken.globalVars
        },
        set variables(x) {
            ParseToken.globalVars = x;
        },
        get components() {
            return ParseToken.globalComponents
        },
        set components(x) {
            ParseToken.globalComponents = x;
        },

        resolveComponent(name: string): Component {
            return ParseToken.globalComponents[name];
        },

        resolveVars(name: string): Token {
            return ParseToken.globalVars[name];
        },
        getOriginToken() {
            return new Token("BLANK", [], "<anonymous>", 0, 0);
        }
    }
}
