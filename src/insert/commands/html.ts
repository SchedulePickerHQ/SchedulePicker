import type { Command } from "../../types";
import { sendBuildContextMenu } from "../../utils/messaging";
import { saveSyntaxSetting } from "../../utils/storage";

export class HtmlCommand implements Command {
	async execute() {
		await saveSyntaxSetting("html");
		await sendBuildContextMenu();
	}
}
