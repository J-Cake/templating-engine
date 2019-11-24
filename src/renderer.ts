import Document from './Document';
import Element from './Element';
import Lex from './Lex';
import Format from './Format';
import Parse from './Parse';
import Token from "./token";
import Translate from "./Translate";

type FileName = {
    path: string,
    type: string
};

export interface Options {
}

function readFile(file: FileName): string {
    return "";
}

function parse(content: string, file: string, options?: Options): Element[] {
    const lexed: Token[] = Lex(content + "\n", file);
    const formatted: Token[] = Format(lexed);
    const parsed = Parse([...formatted, new Token("BLANK", [], "", 0, 0)]);
    // console.log();
    // return Translate(parsed);
    // return Translate(parsed);
    return [];
}

export default function render(content: FileName | string, variables?: any, options?: Options): Document {
    let file: string = "";
    let path = "<anonymous>";

    if (typeof content === "string") // value passed to function is inline rather than a file
        file = content;
    else {
        file = readFile(content);
        path = content.path;
    }

    const elements = parse(file, path, variables);

    const doc: Document = Document.construct(path, 0, 0);

    // console.log(elements);

    for (const element of elements)
        doc.addChild(element);

    return doc;
};
