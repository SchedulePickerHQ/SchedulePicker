import { sendBuildContextMenu } from "~messages";
import { saveSyntaxSetting } from "~storage";

import type { Command } from "../../utils/interface";

export class HTMLCommand implements Command {
  async execute() {
    await saveSyntaxSetting("html");
    await sendBuildContextMenu();
  }
}
