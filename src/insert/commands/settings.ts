import type { Command } from "../../types";
import { sendOpenSettingsPage } from "../../utils/messaging";

export class SettingsCommand implements Command {
	async execute() {
		await sendOpenSettingsPage();
	}
}
