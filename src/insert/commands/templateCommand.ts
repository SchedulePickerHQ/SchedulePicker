import type { Command } from "../../types";
import { handleCommandError } from "./handleCommandError";
import {
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
			const formatter = this.deps.createFormatter(decoration);
			const normalized = formatter.formatRawText(templateText);
			const withDays = await replaceDayPlaceholders(normalized, this.deps);
			const withEvents = await replaceEventPlaceholders(
				withDays,
				this.deps,
				formatter,
			);

			this.deps.paste(withEvents, decoration);
		} catch (e) {
			handleCommandError(e, this.deps.env);
		} finally {
			this.deps.env.setCursor("auto");
		}
	}
}
