import { sendBuildContextMenu } from "~messages";
import { saveSyntaxSetting } from "~storage";

import type { Command } from "../../utils/interface";

export class PlaneTextCommand implements Command {
  async execute() {
    await saveSyntaxSetting("planeText");
    await sendBuildContextMenu();
  }
}
