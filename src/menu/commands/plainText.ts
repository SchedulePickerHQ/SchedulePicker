import type { Command } from "../../types";
import { sendBuildContextMenu } from "../../utils/messages";
import { saveSyntaxSetting } from "../../utils/storage";

export class PlainTextCommand implements Command {
	async execute() {
		await saveSyntaxSetting("plainText");
		await sendBuildContextMenu();
	}
}
