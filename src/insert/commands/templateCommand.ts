import type { Command } from "../../types";
import {
	replaceDayPlaceholders,
	replaceEventPlaceholders,
} from "./templateReplacer";
import { handleCommandError } from "./handleCommandError";
import type { TemplateDeps } from "./types";

export class TemplateCommand implements Command {
	constructor(private deps: TemplateDeps) {}

	async execute(): Promise<void> {
		try {
			this.deps.env.setCursor("progress");

			const templateText = await this.deps.loadTemplateText();
			const syntax = await this.deps.loadSyntaxSetting();
			const withDays = await replaceDayPlaceholders(templateText, this.deps);
			const withEvents = await replaceEventPlaceholders(withDays, this.deps);

			this.deps.paste(withEvents, syntax);
		} catch (e) {
			handleCommandError(e, this.deps.env);
		} finally {
			this.deps.env.setCursor("auto");
		}
	}
}
