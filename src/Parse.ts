import Token from './token';
import Handlers, {handler} from './Handlers';
import grammar, {Matcher} from './grammar';
import ParseToken from "./ParseToken";

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
    name: string
}

function lookupGrammar(tokens: Token[]): grammarObject {
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
    return {
        tokens: potentials[key],
        handler: Handlers[key],
        name: key
    }; // ParseToken need to somehow obtain contents

}

export default function Parse(source: Token[], depth: number = 0): ParseToken[] { // More or less a pre-executer. Basically, configures the token tree for execution
    const tokens: ParseToken[] = [];

    const statement: Token[] = [];
    for (const token of source) {
        statement.push(token);

        if (token.name === "newline") {
            const children: Token[] = trim(statement.splice(0));

            if (children.length > 0) {
                const match = lookupGrammar(children);

                const toke: Array<ParseToken | Token> = [];

                // if (!match.tokens)
                console.log(children);

                for (const token of match.tokens)
                    if (token.content instanceof Array)
                        toke.push(...Parse(token.content));
                    else
                        toke.push(new ParseToken(token.name, Handlers.literal, [token]));

                tokens.push(new ParseToken(match.name, match.handler, toke));
            }
        }
    }

    return tokens;
}
