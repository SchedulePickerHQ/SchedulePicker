import type { Factory } from "~utils/interface";

import type { SyntaxGenerator } from "./interface";
import { HtmlSyntaxGenerator } from "./strategies/htmlSyntaxGenerator";
import { MarkdownSyntaxGenerator } from "./strategies/markdownSyntaxGenerator";
import { PlaneTextSyntaxGenerator } from "./strategies/planeTextSyntaxGenerator";

export class SyntaxGeneratorFactory implements Factory<"html" | "markdown" | "planeText", SyntaxGenerator> {
  create(syntax: "html" | "markdown" | "planeText"): SyntaxGenerator {
    switch (syntax) {
      case "html":
        return new HtmlSyntaxGenerator();
      case "markdown":
        return new MarkdownSyntaxGenerator();
      case "planeText":
        return new PlaneTextSyntaxGenerator();
      default:
        throw new Error("Syntax is not implemented.");
    }
  }
}
