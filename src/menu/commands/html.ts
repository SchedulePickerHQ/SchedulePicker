import type { Command } from "../../types";
import { sendBuildContextMenu } from "../../utils/messages";
import { saveSyntaxSetting } from "../../utils/storage";

export class HTMLCommand implements Command {
	async execute() {
		await saveSyntaxSetting("html");
		await sendBuildContextMenu();
	}
}
