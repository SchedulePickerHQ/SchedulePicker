import { sendOpenSettingsPage } from "~messages";

import type { Command } from "../../utils/interface";

export class SettingsCommand implements Command {
  async execute() {
    await sendOpenSettingsPage();
  }
}
