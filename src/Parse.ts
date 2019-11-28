import Token from './token';
import Handlers, {handler} from './Handlers';
import grammar, {isValue, Matcher} from './grammar';
import ParseToken from "./ParseToken";
import * as util from "util";

function trim(tokens: Token[]): Token[] {
    const output: Token[] = [];

    for (const token of tokens)
        if (token.name !== "newline")
            output.push(token);

    return output;
}

function matchLine(tokens: Token[], matcher: Matcher): boolean {
    const match: boolean[] = [];

    if (tokens.length === matcher.length)
        for (const a in tokens)
            match.push(tokens[a].match(matcher[a]));
    else
        throw new TypeError("unable to compare arrays of different lengths");

    return !match.includes(false);
}

interface grammarObject {
    tokens: Token[],
    handler: handler,
    name: string,
    subName: string, // in case more specific information is required
}

function lookupGrammar(tokens: Token[]): grammarObject[] {
    interface Potential {
        [Key: string]: Token[]
    }

    const potentials: Potential = {};
    for (const a in grammar) {
        // @ts-ignore
        const matcher: Matcher = grammar[a];

        if (matcher.length === tokens.length) // they were always destined to be apart.
            if (matchLine(tokens, matcher))
                potentials[a] = tokens;
    }

    const key: string = Object.keys(potentials)[0];

    if (key)
        return [{
            tokens: potentials[key],
            handler: Handlers[key],
            name: key,
            subName: ""
        }];
    else {
        let matches = true;

        for (const token of tokens) if (!isValue(token.name)) {
            matches = false;
            break;
        }

        return matches ? tokens.map(i => ({
            tokens: [i],
            handler: Handlers["literal"],
            subName: i.subName ? i.subName : i.name,
            name: i.subName ? i.name : "literal"
        })) : [];
    }
}

export default function Parse(source: Token[], depth: number = 0): ParseToken[] { // More or less a pre-executer. Basically, configures the token tree for execution
    const tokens: ParseToken[] = [];

    const statement: Token[] = [];
    for (const token of source) {
        statement.push(token);

        if (token.name === "newline") {
            const children: Token[] = trim(statement.splice(0));

            if (children.length > 0) {
                const matches = lookupGrammar(children);

                for (const match of matches) {
                    // console.log("Children", util.inspect(match.tokens, false, null, true), children.map(i => !!i.subName));

                    tokens.push(new ParseToken(match.name, match.handler, match.tokens, false).setSubName(match.subName));
                }

            }
        }
    }

    return tokens;
}
