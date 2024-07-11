import { sendBuildContextMenu } from "~messages";
import { saveSyntaxSetting } from "~storage";

import type { Command } from "../../utils/interface";

export class MarkdownCommand implements Command {
  async execute() {
    await saveSyntaxSetting("markdown");
    await sendBuildContextMenu();
  }
}
