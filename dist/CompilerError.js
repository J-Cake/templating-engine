"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CompilerError {
    constructor(type, message, file, line, character) {
        this.moreInfoContents = [];
        this.type = type;
        this.message = message;
        this.file = file;
        this.line = line;
        this.character = character;
    }
    static fromToken(type, message, token) {
        return new CompilerError(type, message, token.file, token.line, token.character);
    }
    moreInfo(...info) {
        this.moreInfoContents.push(...info);
        return this;
    }
    print() {
        return `${this.type[0].toUpperCase()}${this.type.toLowerCase().slice(1)}Error: ${this.message.trim()};${this.moreInfoContents.length > 0 ? "\n" + this.moreInfoContents.map(i => ` - ${i}`).join("\n").trim() : ""}
    At ${this.file} - ${this.line + 1}:${this.character}`;
    }
    throw() {
        console.error(this.print());
        process.exit(1);
    }
}
exports.default = CompilerError;
//# sourceMappingURL=CompilerError.js.map