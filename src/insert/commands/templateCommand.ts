import type { Command } from "../../types";
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
			const withDays = await replaceDayPlaceholders(templateText, this.deps);
			const withEvents = await replaceEventPlaceholders(withDays, this.deps);

			this.deps.insertText(withEvents);
		} catch {
			this.deps.env.showError("error_get_events");
		} finally {
			this.deps.env.setCursor("auto");
		}
	}
}
