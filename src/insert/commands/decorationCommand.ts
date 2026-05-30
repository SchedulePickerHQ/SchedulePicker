import type { Command } from "../../types";
import type { DecorationDeps, DecorationType } from "./types";

export class DecorationCommand implements Command {
	constructor(
		private decoration: DecorationType,
		private deps: DecorationDeps,
	) {}

	async execute(): Promise<void> {
		await this.deps.saveDecorationSetting(this.decoration);
		await this.deps.sendBuildContextMenu();
	}
}
