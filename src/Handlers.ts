import Token from "./token";
import Element from "./Element";
import path from 'path';
import CompilerError from "./CompilerError";
import * as fs from "fs";
import Lex from "./Lex";
import Format from "./Format";
import Parse from "./Parse";
import Execute from "./Execute";
import ParseToken from "./ParseToken";
import Component from "./Component";
import {TextNode} from "./TextNode";

export type handler = (scope: ParseToken, ...tokens: Array<ParseToken | Token>) => Element[];

export interface handlers {
    [Key: string]: handler;
}

const Handlers: handlers = {
    import(scope: ParseToken, ...source: Array<ParseToken | Token>): Element[] { // only tokens
        const tokens: Token[] = [];
        for (const token of source)
            if (token instanceof Token)
                tokens.push(token);
            else
                CompilerError
                    .fromToken("type", "unexpected type of token", tokens[tokens.length - 1])
                    .moreInfo("Import")
                    .throw();

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

            return Execute(Parse(Format(Lex(fileContent, loc))));
        } else
            CompilerError
                .fromToken("file", "requested file doesn't exist", pathSpec)
                .moreInfo(loc)
                .throw();

        return [];
    },
    componentDeclaration(scope: ParseToken, ...tokens: Array<ParseToken | Token>): Element[] { // TODO: implement component registering
        if (tokens[1] instanceof Token)
            scope.components[(<Token>tokens[1]).content.toString()] = new Component(<ParseToken>tokens[2], true);
        else
            CompilerError.fromToken("type", "expected string", <Token><any>tokens[1]).throw();

        return [];
    },
    each(scope: ParseToken, ...tokens: Array<ParseToken | Token>): Element[] { // TODO: add iteration
        return [];
    },
    literal(scope: ParseToken, ...tokens: Array<ParseToken | Token>): Element[] { // TODO: simply return an element with the content as the body
        const elements: Element[] = [];

        // for (const token of tokens) {
        //     if (token.name === "literal") { // token is plain text
        //         if (token instanceof ParseToken && token.isLeafNode)
        //             // @ts-ignore
        //             elements.push();
        //     } else if (token instanceof ParseToken) { // nest parent
        //         const parent = scope.resolveComponent(token.name);
        //
        //         const originToken = scope.getOriginToken();
        //
        //         if (originToken) {
        //
        //             if (parent)
        //                 elements.push(parent.new(token.call(), originToken));
        //             else
        //                 CompilerError.fromToken("type", "unknown component", originToken).moreInfo(token.name).throw();
        //         } else
        //             throw new TypeError("Unable to identify originToken");
        //     } else {
        //         if (token.content instanceof Array)
        //             elements.push(new Element(token.subName || "", (<Token[]>token.content).map(i => new TextNode(i.content.toString(), i)), token));
        //         else
        //             elements.push(new TextNode(token.content, token));
        //     }
        // }

        return elements;
    }
};

export default Handlers;
