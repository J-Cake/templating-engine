import Document from './Document';
import Element from './Element';
import Lex from './Lex';
import Format from './Format';
import Parse from './Parse';
import Token from "./token";
import Execute from "./Execute";
import ParseToken from './ParseToken';

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
    const parsed: ParseToken[] = Parse([...formatted, new Token("BLANK", [], "<anonymous>", 0, 0)]);

    console.log(parsed);
    // const elements: Element[] = Execute(parsed);

    // return elements;
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

    for (const element of elements)
        doc.addChild(element);

    return doc;
};
