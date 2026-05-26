import type { Command } from "../../types";
import type { SyntaxDeps, SyntaxType } from "./types";

export class SyntaxCommand implements Command {
	constructor(
		private syntax: SyntaxType,
		private deps: SyntaxDeps,
	) {}

	async execute(): Promise<void> {
		await this.deps.saveSyntaxSetting(this.syntax);
		await this.deps.sendBuildContextMenu();
	}
}
