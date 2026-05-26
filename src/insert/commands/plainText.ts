import type { Command } from "../../types";
import { sendBuildContextMenu } from "../../utils/messaging";
import { saveSyntaxSetting } from "../../utils/storage";

export class PlainTextCommand implements Command {
	async execute() {
		await saveSyntaxSetting("plainText");
		await sendBuildContextMenu();
	}
}
