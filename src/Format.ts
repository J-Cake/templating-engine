import Token from "./token";
import CompilerError from "./CompilerError";

export default function Format(source: Token[]): Token[] { // Place the tokens into their correct indentation
    const tokens: Token[] = [];

    let tagDepth: number = 0;

    const body: Token[] = [];

    for (const token of source) {
        let isSkipped = false;

        if (token.name === "component" || token.name === "tag")
            tagDepth++;
        else if (token.name === "closingComponent" || token.name === "closingTag") {
            tagDepth--;

            if (tagDepth < 0) {
                new CompilerError("syntax", `unexpected closing component ${token.content}`, token.file, token.line, token.character).throw();
            } else if (tagDepth === 0) {
                const name = body[0].content;

                tokens.push(new Token(token.name === "closingComponent" ? "component" : "tag",
                    Format(body.splice(0, body.length).slice(1)), // Reformat in case the nesting depth is greater than 2
                    token.file, token.line, token.character).setSubName(name.toString()));

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
