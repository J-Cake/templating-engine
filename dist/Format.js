"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = __importDefault(require("./token"));
const CompilerError_1 = __importDefault(require("./CompilerError"));
function Format(source) {
    const tokens = [];
    let tagDepth = 0;
    const body = [];
    for (const token of source) {
        let isSkipped = false;
        if (token.name === "component")
            tagDepth++;
        else if (token.name === "closingComponent") {
            tagDepth--;
            if (tagDepth < 0) {
                new CompilerError_1.default("syntax", `unexpected closing component ${token.content}`, token.file, token.line, token.character).throw();
            }
            else if (tagDepth === 0) {
                tokens.push(new token_1.default(`component:${body[0].content}`, Format(body.splice(0, body.length).slice(1)), // Reformat in case the nesting depth is greater than 2
                token.file, token.line, token.character));
                isSkipped = true;
            }
        }
        if (token.name === "keyword")
            if (token.content === "true" || token.content === "false")
                token.name = "boolean";
        if (!isSkipped)
            if (tagDepth > 0)
                body.push(token);
            else
                tokens.push(token);
    }
    return tokens;
}
exports.default = Format;
//# sourceMappingURL=Format.js.map