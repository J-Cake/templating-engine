"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Element_1 = __importDefault(require("./Element"));
const path_1 = __importDefault(require("path"));
const CompilerError_1 = __importDefault(require("./CompilerError"));
const fs = __importStar(require("fs"));
const Lex_1 = __importDefault(require("./Lex"));
const Format_1 = __importDefault(require("./Format"));
const Parse_1 = __importDefault(require("./Parse"));
const Translate_1 = __importDefault(require("./Translate"));
const Handlers = {
    import(...tokens) {
        const pathSpec = tokens[1];
        let loc = path_1.default.join(process.cwd(), pathSpec.content.toString()).replace(/\\/g, '/');
        const file = loc.split("/").pop() || "";
        if (pathSpec.content.length > 0) {
            if (!file)
                loc = path_1.default.join(process.cwd(), "index.rcr").replace(/\\/g, '/');
            if (/^.[^.]+\.?$/.test(file))
                loc = path_1.default.join(process.cwd(), file + ".rcr").replace(/\\/g, '/');
        }
        else
            CompilerError_1.default.fromToken("file", "invalid filepath", pathSpec).throw();
        let fileContent;
        if (fs.existsSync(loc)) {
            fileContent = fs.readFileSync(loc, 'utf8');
            return Translate_1.default(Parse_1.default(Format_1.default(Lex_1.default(fileContent, loc))));
        }
        else
            CompilerError_1.default
                .fromToken("file", "requested file doesn't exist", pathSpec)
                .moreInfo(loc)
                .throw();
        return [];
    },
    component(...tokens) {
        const children = tokens[2].content;
        if (children instanceof Array)
            return [...children.map(i => Element_1.default.fromToken(i))];
        else
            return [new Element_1.default(tokens[2].name, children, tokens[2])];
    },
    each(...tokens) {
        return [];
    },
    literal(...tokens) {
        return [];
    }
};
exports.default = Handlers;
//# sourceMappingURL=Handlers.js.map