import type { Command } from "../../types";
import { sendBuildContextMenu } from "../../utils/messaging";
import { saveSyntaxSetting } from "../../utils/storage";

export class MarkdownCommand implements Command {
	async execute() {
		await saveSyntaxSetting("markdown");
		await sendBuildContextMenu();
	}
}
