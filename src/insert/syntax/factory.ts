import type { SyntaxGenerator } from "./interface";
import { HtmlSyntaxGenerator } from "./strategies/htmlSyntaxGenerator";
import { MarkdownSyntaxGenerator } from "./strategies/markdownSyntaxGenerator";
import { PlainTextSyntaxGenerator } from "./strategies/plainTextSyntaxGenerator";

export function createSyntaxGenerator(
	syntax: "html" | "markdown" | "plainText",
): SyntaxGenerator {
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
