"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = __importDefault(require("./token"));
const preferences_1 = __importDefault(require("./preferences"));
const CompilerError_1 = __importDefault(require("./CompilerError"));
const regex = {
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
const last = (arr) => arr[arr.length - 1];
function Lex(source, file) {
    const tok = [];
    const tokens = [];
    const states = {
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
    const delimiters = {
        "\"": () => {
            if (last(tok) !== preferences_1.default.escapeChar)
                states.stringStarted = !states.stringStarted;
        },
        "[": () => {
            if (last(tok) !== preferences_1.default.escapeChar)
                states.arrayDelimiterCount++;
        },
        "]": () => {
            if (last(tok) !== preferences_1.default.escapeChar) {
                states.arrayDelimiterCount--;
                if (states.arrayDelimiterCount <= 0)
                    tokens.push(new token_1.default("array", Lex(states.arrayContent.join(''), file), file, lineCount, character));
            }
        },
        "(": () => {
            if (last(tok) !== preferences_1.default.escapeChar)
                states.arrayDelimiterCount++;
        },
        ")": () => {
            if (last(tok) !== preferences_1.default.escapeChar) {
                states.expressionDelimiterCount--;
                if (states.expressionDelimiterCount <= 0)
                    tokens.push(new token_1.default("expression", Lex(states.expressionContent.join(''), file), file, lineCount, character));
            }
        },
        "#": () => {
            if (last(tok) !== preferences_1.default.escapeChar)
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
        }
        else if (i === "\"") { // string end
            delimiters["\""]();
            tokens.push(new token_1.default("string", states.stringContent.splice(0, states.stringContent.length).join(''), file, lineCount, character));
            tok.length = 0;
        }
        else {
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
                tokens.push(new token_1.default("char", tok.pop() || i, file, lineCount, character));
        }
        if (i === "\n" || i === ";") {
            tokens.push(new token_1.default("newline", i, file, lineCount, character));
            tok.length = 0;
        }
    }
    return tokens;
}
exports.default = Lex;
function resolve(token, file, lineCount, character) {
    const possible = [];
    for (const i in regex) {
        if (regex[i].test(token))
            possible.push(new token_1.default(i, (token.match(regex[i]) || [])[1], file, lineCount, character));
    }
    if (possible.length <= 0)
        new CompilerError_1.default("syntax", `unexpected token ${token}`, file, lineCount, character).throw();
    else if (possible.length === 1)
        return possible[0];
    else {
        new CompilerError_1.default("syntax", `unable to parse ${token}`, file, lineCount, character).throw();
    }
}
//# sourceMappingURL=Lex.js.map