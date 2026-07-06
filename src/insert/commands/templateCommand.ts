import type { Formatter } from "../../syntax/formatter";
import type { Command } from "../../types";
import { handleCommandError } from "./handleCommandError";
import {
	convertNewLines,
	fetchEventsForPlaceholders,
	replaceDayPlaceholders,
	replaceEventPlaceholders,
} from "./templateReplacer";
import type { TemplateDeps } from "./types";

export class TemplateCommand implements Command {
	constructor(private deps: TemplateDeps) {}

	async execute(): Promise<void> {
		try {
			this.deps.env.setCursor("progress");

			const templateText = await this.deps.loadTemplateText();
			const decoration = await this.deps.loadDecorationSetting();
			const withDays = await replaceDayPlaceholders(templateText, this.deps);
			const eventsByPlaceholder = await fetchEventsForPlaceholders(
				withDays,
				this.deps,
			);
			const buildText = (formatter: Formatter) =>
				replaceEventPlaceholders(
					convertNewLines(withDays, formatter.getNewLine()),
					eventsByPlaceholder,
					formatter,
					this.deps.env.hostname,
				);

			const plainText = buildText(this.deps.createFormatter("plain"));
			const styledHtml =
				decoration === "styled"
					? buildText(this.deps.createFormatter("styled"))
					: undefined;

			this.deps.paste(plainText, styledHtml);
		} catch (e) {
			handleCommandError(e, this.deps.env);
		} finally {
			this.deps.env.setCursor("auto");
		}
	}
}
