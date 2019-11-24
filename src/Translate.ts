import ParseToken from "./ParseToken";
import Element from "./Element";

export default function (tokens: ParseToken[]): Element[] {
    const children: Element[] = [];

    // for (const token of tokens)
        // children.push(...token.call());

    return children;
}
