import Token from "./token";
import Element from "./Element";
import path from 'path';
import CompilerError from "./CompilerError";
import * as fs from "fs";
import Lex from "./Lex";
import Format from "./Format";
import Parse from "./Parse";
import Translate from "./Translate";

export type handler = (...tokens: Token[]) => Element | Element[] | void;

export interface handlers {
    [Key: string]: handler;
}

const Handlers: handlers = {
    import(...tokens: Token[]): Element[] {
        const pathSpec = tokens[1];
        let loc = path.join(process.cwd(), pathSpec.content.toString()).replace(/\\/g, '/');
        const file = loc.split("/").pop() || "";

        if (pathSpec.content.length > 0) {
            if (!file)
                loc = path.join(process.cwd(), "index.rcr").replace(/\\/g, '/');
            if (/^.[^.]+\.?$/.test(file))
                loc = path.join(process.cwd(), file + ".rcr").replace(/\\/g, '/');
        } else
            CompilerError.fromToken("file", "invalid filepath", pathSpec).throw();

        let fileContent: string;
        if (fs.existsSync(loc)) {
            fileContent = fs.readFileSync(loc, 'utf8');

            return Translate(Parse(Format(Lex(fileContent, loc))));
        } else
            CompilerError
                .fromToken("file", "requested file doesn't exist", pathSpec)
                .moreInfo(loc)
                .throw();

        return [];
    },
    component(...tokens: Token[]): Element[] { // TODO: implement component registering
        const children = tokens[2].content;

        if (children instanceof Array)
            return [...children.map(i => Element.fromToken(i))];
        else
            return [new Element(tokens[2].name, children, tokens[2])];
    },
    each(...tokens: Token[]): Element[] { // TODO: add iteration
        return [];
    },
    literal(...tokens: Token[]): Element[] { // TODO: simply return an element with the content as the body
        return [];
    }
};

export default Handlers;
