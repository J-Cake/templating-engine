"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Element_1 = __importDefault(require("./Element"));
const token_1 = __importDefault(require("./token"));
class Document extends Element_1.default {
    constructor(blank, options) {
        super("Root", [], blank);
    }
    static construct(file, line, char, options) {
        return new Document(new token_1.default("BLANK", [], file, line, char), options);
    }
    stringify() {
        // stringify
    }
}
exports.default = Document;
//# sourceMappingURL=Document.js.map