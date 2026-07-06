import type { Command } from "../../types";
import { handleCommandError } from "./handleCommandError";
import { parseTemplate } from "./templateParser";
import type { TemplateDeps } from "./types";

export class TemplateCommand implements Command {
	constructor(private deps: TemplateDeps) {}

	async execute(): Promise<void> {
		try {
			this.deps.env.setCursor("progress");

			const templateText = await this.deps.loadTemplateText();
			const decoration = await this.deps.loadDecorationSetting();
			const segments = await parseTemplate(templateText, this.deps);

			this.deps.paste(
				this.deps.buildPasteContent(
					decoration,
					segments,
					this.deps.env.hostname,
				),
			);
		} catch (e) {
			handleCommandError(e, this.deps.env);
		} finally {
			this.deps.env.setCursor("auto");
		}
	}
}
