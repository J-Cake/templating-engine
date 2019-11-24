import {Matcher} from "./grammar";

export default class Token {
    name: string;
    content: string | Token[];

    file: string;
    line: number;
    character: number;

    constructor(name: string, content: string | Token[], file: string, line: number, character: number) {
        this.name = name;
        this.content = content;

        this.file = file;
        this.line = line;
        this.character = character;
    }

    match(matcher: Matcher): boolean {
        let name: boolean;
        if (["String", "RegExp"].includes(matcher[0].constructor.name)) {
            if (typeof matcher[0] === "string")
                if (this.name.indexOf("component:") === 0)
                    name = matcher[0] === this.name.split(":")[0];
                else
                    name = matcher[0] === this.name;
            else
                name = matcher[0].test(this.name);
        } else {
            name = false;
        }

        let contentIsValid: boolean = false;

        if (matcher[1]) {
            switch (matcher[1].constructor.name) {
                case "String":
                    contentIsValid = matcher[1] === this.content;
                    break;
                case "RegExp":
                    if (typeof this.content === "string")
                        contentIsValid = matcher[1].test(this.content);
                    break;
                case "Array":
                    if (this.content instanceof Array) {
                        if (this.content.length === matcher[1].length)
                            contentIsValid = !matcher[1].map((i: Matcher, a: number) => this.content[a].match(i)).includes(false);
                        else
                            throw new TypeError("not enough / too may conditions");
                    } else {
                        if (matcher[1].map((i: Matcher) => i.constructor.name).includes("Array"))
                            throw new TypeError("cannot match sub token as token is lowest layer");
                        else
                            contentIsValid = matcher[1].map((i: string) => this.content === i).includes(true);
                    }
                    break;
            }
        } else
            contentIsValid = true;

        return name && contentIsValid;
    }
}
