import type { Factory } from "../../types";

import type { SyntaxGenerator } from "./interface";
import { HtmlSyntaxGenerator } from "./strategies/htmlSyntaxGenerator";
import { MarkdownSyntaxGenerator } from "./strategies/markdownSyntaxGenerator";
import { PlainTextSyntaxGenerator } from "./strategies/plainTextSyntaxGenerator";

export class SyntaxGeneratorFactory
	implements Factory<"html" | "markdown" | "plainText", SyntaxGenerator>
{
	create(syntax: "html" | "markdown" | "plainText"): SyntaxGenerator {
		switch (syntax) {
			case "html":
				return new HtmlSyntaxGenerator();
			case "markdown":
				return new MarkdownSyntaxGenerator();
			case "plainText":
				return new PlainTextSyntaxGenerator();
			default:
				throw new Error("Syntax is not implemented.");
		}
	}
}
