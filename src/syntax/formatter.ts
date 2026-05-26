import type { UserEvent } from "../schedule/events";
import type { DateTime } from "../utils/datetime";
import { HtmlFormatter } from "./formatters/html";
import { MarkdownFormatter } from "./formatters/markdown";
import { PlainTextFormatter } from "./formatters/plainText";

export interface Formatter {
	createTitle(dateTime: DateTime): string;
	createEvents(hostname: string, events: UserEvent[]): string;
	getNewLine(): string;
}

export function createFormatter(
	syntax: "html" | "markdown" | "plainText",
): Formatter {
	switch (syntax) {
		case "html":
			return new HtmlFormatter();
		case "markdown":
			return new MarkdownFormatter();
		case "plainText":
			return new PlainTextFormatter();
		default:
			throw new Error("Syntax is not implemented.");
	}
}
