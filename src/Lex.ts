import Token from "./token";
import preferences from './preferences';
import CompilerError from "./CompilerError";

interface LexState {
    stringStarted: boolean
    stringContent: string[],
    arrayDelimiterCount: number
    arrayContent: string[],
    expressionDelimiterCount: number
    expressionContent: string[],
    numberStarted: boolean
    numberContent: string[],
    componentStarted: boolean,
    componentContent: string[]
}

interface Dictionary<Value> {
    [Key: string]: Value;
}

const regex: Dictionary<RegExp> = {
    component: /^#([$_a-zA-Z][$_a-zA-Z0-9]*)#$/,
    closingComponent: /^#!([$_a-zA-Z][$_a-zA-Z0-9+]*)#$/,
    autoCloseComponent: /^#([$_a-zA-Z][$_a-zA-Z0-9]*)!#$/,
    keyword: /^([a-zA-Z][$_a-zA-Z0-9+]*)$/,
    number: /^(-?\d+(?:\.\d+)?)$/,
    // boolean: /^true|false$/,
    variable: /^\$([$_a-zA-Z][$_a-zA-Z0-9]*)$/,
    char: /^[{}:,.]$/
};

const chars = "{}:,.";

const last = (arr: Array<any>) => arr[arr.length - 1];

export default function Lex(source: string, file: string): Token[] { // Convert the source code into a list of tokens
    const tok: string[] = [];
    const tokens: Token[] = [];

    const states: LexState = {
        stringStarted: false,
        stringContent: [],
        arrayDelimiterCount: 0,
        arrayContent: [],
        expressionDelimiterCount: 0,
        expressionContent: [],
        numberStarted: false,
        numberContent: [],
        componentStarted: false,
        componentContent: []
    };

    let lineCount = 0;
    let character = 0;

    const delimiters: Dictionary<Function> = {
        "\"": () => {
            if (last(tok) !== preferences.escapeChar)
                states.stringStarted = !states.stringStarted;
        },
        "[": () => {
            if (last(tok) !== preferences.escapeChar)
                states.arrayDelimiterCount++;
        },
        "]": () => {
            if (last(tok) !== preferences.escapeChar) {
                states.arrayDelimiterCount--;

                if (states.arrayDelimiterCount <= 0)
                    tokens.push(new Token("array", Lex(states.arrayContent.join(''), file), file, lineCount, character));
            }
        },
        "(": () => {
            if (last(tok) !== preferences.escapeChar)
                states.arrayDelimiterCount++;
        },
        ")": () => {
            if (last(tok) !== preferences.escapeChar) {
                states.expressionDelimiterCount--;

                if (states.expressionDelimiterCount <= 0)
                    tokens.push(new Token("expression", Lex(states.expressionContent.join(''), file), file, lineCount, character));
            }
        },
        "#": () => {
            if (last(tok) !== preferences.escapeChar)
                states.componentStarted = !states.componentStarted;
        }
    };

    for (const i of source) {
        tok.push(i);

        character++;
        if (i === "\n") {
            lineCount++;
            character = 0;
        }

        if (!states.stringStarted) {
            if (i in delimiters)
                delimiters[i]();
        } else if (i === "\"") { // string end
            delimiters["\""]();

            tokens.push(new Token("string", states.stringContent.splice(0, states.stringContent.length).join(''), file, lineCount, character));
            tok.length = 0;
        } else {
            states.stringContent.push(i);
        }

        if ([" ", "\n", "\t", "\r", ...chars].includes(i) && !states.stringStarted) {
            const token = tok.splice(0, [...chars].includes(tok[tok.length - 1]) ? tok.length - 1 : tok.length).join("").trim();

            if (token) {
                const pusher = resolve(token, file, lineCount, character);
                if (pusher)
                    tokens.push(pusher);
            }

            if ([...chars].includes(i))
                tokens.push(new Token("char", tok.pop() || i, file, lineCount, character));

        }

        if (i === "\n" || i === ";") {
            tokens.push(new Token("newline", i, file, lineCount, character));
            tok.length = 0;
        }

    }

    return tokens;
}

function resolve(token: string, file: string, lineCount: number, character: number): Token | void {
    const possible: Token[] = [];
    for (const i in regex) {
        if (regex[i].test(token))
            possible.push(new Token(i, (token.match(regex[i]) || [])[1], file, lineCount, character));
    }

    if (possible.length <= 0)
        new CompilerError("syntax", `unexpected token ${token}`, file, lineCount, character).throw();
    else if (possible.length === 1)
        return possible[0];
    else {
        new CompilerError("syntax", `unable to parse ${token}`, file, lineCount, character).throw();
    }
}
