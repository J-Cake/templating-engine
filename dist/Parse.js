"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Handlers_1 = __importDefault(require("./Handlers"));
const grammar_1 = __importDefault(require("./grammar"));
const ParseToken_1 = __importDefault(require("./ParseToken"));
function trim(tokens) {
    const output = [];
    for (const token of tokens)
        if (token.name !== "newline")
            output.push(token);
    return output;
}
function matchLine(tokens, matcher) {
    const match = [];
    if (tokens.length === matcher.length)
        for (const a in tokens)
            match.push(tokens[a].match(matcher[a]));
    else
        throw new TypeError("unable to compare arrays of different lengths");
    return !match.includes(false);
}
function lookupGrammar(tokens) {
    const potentials = {};
    for (const a in grammar_1.default) {
        // @ts-ignore
        const matcher = grammar_1.default[a];
        if (matcher.length === tokens.length) // they were always destined to be apart.
            if (matchLine(tokens, matcher))
                potentials[a] = tokens;
    }
    const key = Object.keys(potentials)[0];
    return {
        tokens: potentials[key],
        handler: Handlers_1.default[key],
        name: key
    }; // ParseToken need to somehow obtain contents
}
function Parse(source, depth = 0) {
    const tokens = [];
    const statement = [];
    for (const token of source) {
        statement.push(token);
        if (token.name === "newline") {
            const children = trim(statement.splice(0));
            if (children.length > 0) {
                const match = lookupGrammar(children);
                const toke = [];
                // if (!match.tokens)
                console.log(children);
                for (const token of match.tokens)
                    if (token.content instanceof Array)
                        toke.push(...Parse(token.content));
                    else
                        toke.push(new ParseToken_1.default(token.name, Handlers_1.default.literal, [token]));
                tokens.push(new ParseToken_1.default(match.name, match.handler, toke));
            }
        }
    }
    return tokens;
}
exports.default = Parse;
//# sourceMappingURL=Parse.js.map