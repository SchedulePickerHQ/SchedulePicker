import type { SyntaxType } from "../insert/commands/types";
import type { UserEvent } from "../schedule/events";
import type { DateTime } from "../utils/datetime";
import { ExperimentalHtmlFormatter } from "./formatters/experimentalHtml";
import { HtmlFormatter } from "./formatters/html";
import { MarkdownFormatter } from "./formatters/markdown";
import { PlainTextFormatter } from "./formatters/plainText";

export interface Formatter {
	createTitle(dateTime: DateTime): string;
	createEvents(hostname: string, events: UserEvent[]): string;
	getNewLine(): string;
}

export function createFormatter(syntax: SyntaxType): Formatter {
	switch (syntax) {
		case "html":
			return new HtmlFormatter();
		case "experimental-html":
			return new ExperimentalHtmlFormatter();
		case "markdown":
			return new MarkdownFormatter();
		case "plainText":
			return new PlainTextFormatter();
		default:
			throw new Error("Syntax is not implemented.");
	}
}
