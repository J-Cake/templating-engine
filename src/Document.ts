import Element from './Element';
import {Options} from './renderer';
import Token from "./token";

export default class Document extends Element {
    constructor(blank: Token, options?: Options) {
        super("Root", [], blank);
    }

    static construct(file: string, line: number, char: number, options?: Options): Document {
        return new Document(new Token("BLANK", [], file, line, char), options);
    }

    stringify() {
        // stringify
    }
}
