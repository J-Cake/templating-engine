import CompilerError from "./CompilerError";
import Token from "./token";

export default class Element {

    name: string;
    children: Element[] | string;
    originToken: Token;

    constructor(name: string, children: Element[] | string, originToken: Token) {
        this.name = name;
        this.children = children;

        this.originToken = originToken;
    }

    addChild(...element: Element[]) {
        if (this.children instanceof Array) {
            this.children.push(...element);
            this.update();
        } else
            CompilerError.fromToken("render", "cannot append child to text node", this.originToken).throw();
    }

    private update() {
        // TODO: Implement state
    }

    toString():string {
        return "";
    }

    static fromToken(token: Token): Element {
        if (token.content instanceof Array)
            return new Element(token.name, token.content.map(i => Element.fromToken(i)), token);
        else
            return new Element(token.name, token.content, token);
    }
}
