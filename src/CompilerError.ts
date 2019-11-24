import Token from "./token";

export default class CompilerError {
    type: string;
    message: string;
    file: string;
    line: number;
    character: number;

    moreInfoContents: string[] = [];

    constructor(type: string, message: string, file: string, line: number, character: number) {
        this.type = type;
        this.message = message;
        this.file = file;
        this.line = line;
        this.character = character;
    }

    static fromToken(type: string, message: string, token: Token): CompilerError {
        return new CompilerError(type, message, token.file, token.line, token.character);
    }

    moreInfo(...info: string[]): CompilerError {
        this.moreInfoContents.push(...info);

        return this;
    }

    print(): string {
        return `${this.type[0].toUpperCase()}${this.type.toLowerCase().slice(1)}Error: ${this.message.trim()};${
            this.moreInfoContents.length > 0 ? "\n" + this.moreInfoContents.map(i => ` - ${i}`).join("\n").trim() : ""
        }
    At ${this.file} - ${this.line + 1}:${this.character}`;
    }

    throw() {
        console.error(this.print());
        process.exit(1);
    }
}
