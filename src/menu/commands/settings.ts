import type { Command } from "../../types";
import { sendOpenSettingsPage } from "../../utils/messages";

export class SettingsCommand implements Command {
	async execute() {
		await sendOpenSettingsPage();
	}
}
