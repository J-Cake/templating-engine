import ParseToken from "./ParseToken";
import Element from "./Element";
import * as util from "util";

export default function Execute(tokens: Array<ParseToken>): Element[] {
    const children: Element[] = [];

    for (const token of tokens) {
        // const elements = token.call();
        // console.log(token.name, util.inspect(elements, false, null, true));

        // if (token.isLeafNode) {
        //     const elements = token.call();
        //
        //     if (elements)
        //         children.push(...elements);
        // } else {
        //     const el = token.call();
        //     console.log(util.inspect(el, false, null, true));
        //     // const statement = token.call();
        //     // TODO: Fix non-leaf translation
        // }
    }

    return children;
}
