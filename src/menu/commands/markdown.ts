import type { Command } from "../../types";
import { sendBuildContextMenu } from "../../utils/messages";
import { saveSyntaxSetting } from "../../utils/storage";

export class MarkdownCommand implements Command {
	async execute() {
		await saveSyntaxSetting("markdown");
		await sendBuildContextMenu();
	}
}
