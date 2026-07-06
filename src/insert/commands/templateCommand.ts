import type { Command } from "../../types";
import { handleCommandError } from "./handleCommandError";
import { parseTemplate } from "./templateParser";
import type { TemplateDeps } from "./types";

export class TemplateCommand implements Command {
	constructor(private deps: TemplateDeps) {}

	async execute(): Promise<void> {
		try {
			this.deps.env.setCursor("progress");

			// 2 つの設定読み取りは独立した storage アクセスなので並列に行う
			const [templateText, decoration] = await Promise.all([
				this.deps.loadTemplateText(),
				this.deps.loadDecorationSetting(),
			]);
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
