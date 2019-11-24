"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CompilerError_1 = __importDefault(require("./CompilerError"));
class Element {
    constructor(name, children, originToken) {
        this.name = name;
        this.children = children;
        this.originToken = originToken;
    }
    addChild(...element) {
        if (this.children instanceof Array) {
            this.children.push(...element);
            this.update();
        }
        else
            CompilerError_1.default.fromToken("render", "cannot append child to text node", this.originToken).throw();
    }
    update() {
        // TODO: Implement state
    }
    stringify() {
    }
    static fromToken(token) {
        if (token.content instanceof Array)
            return new Element(token.name, token.content.map(i => Element.fromToken(i)), token);
        else
            return new Element(token.name, token.content, token);
    }
}
exports.default = Element;
//# sourceMappingURL=Element.js.map