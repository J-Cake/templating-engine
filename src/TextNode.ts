import Element from "./Element";
import Token from "./token";

export class TextNode extends Element {

    child: string;

    constructor(child: string, originToken: Token) {
        super("Literal", child, originToken);

        this.child = child;
    }

    toString():string {
        return "";
    }
}
