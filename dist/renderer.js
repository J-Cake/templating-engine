"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Document_1 = __importDefault(require("./Document"));
const Lex_1 = __importDefault(require("./Lex"));
const Format_1 = __importDefault(require("./Format"));
const Parse_1 = __importDefault(require("./Parse"));
const token_1 = __importDefault(require("./token"));
function readFile(file) {
    return "";
}
function parse(content, file, options) {
    const lexed = Lex_1.default(content + "\n", file);
    const formatted = Format_1.default(lexed);
    const parsed = Parse_1.default([...formatted, new token_1.default("BLANK", [], "", 0, 0)]);
    // console.log();
    // return Translate(parsed);
    // return Translate(parsed);
    return [];
}
function render(content, variables, options) {
    let file = "";
    let path = "<anonymous>";
    if (typeof content === "string") // value passed to function is inline rather than a file
        file = content;
    else {
        file = readFile(content);
        path = content.path;
    }
    const elements = parse(file, path, variables);
    const doc = Document_1.default.construct(path, 0, 0);
    // console.log(elements);
    for (const element of elements)
        doc.addChild(element);
    return doc;
}
exports.default = render;
;
//# sourceMappingURL=renderer.js.map