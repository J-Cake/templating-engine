import ParseToken from "./ParseToken";
import Element from "./Element";
import Token from "./token";

interface State {}

interface Dictionary<T> {
    [Key: string]: T;
}

export default class Component {
    state?: State;
    component: ParseToken;

    constructor(component: ParseToken, useState: boolean) {
        if (useState)
            this.state = {};

        this.component = component;
    }

    new(children: Element[], originToken: Token): Element {
        return new Element(this.component.name, children, originToken);
    }
}
