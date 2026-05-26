import type { Command } from "../../types";
import type { SettingsDeps } from "./types";

export class SettingsCommand implements Command {
	constructor(private deps: SettingsDeps) {}

	async execute(): Promise<void> {
		await this.deps.sendOpenSettingsPage();
	}
}
