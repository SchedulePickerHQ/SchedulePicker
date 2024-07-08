import { getUserEvents } from "~schedule/events";
import { loadAllDayEventIncludedSetting, loadSyntaxSetting } from "~storage";
import { SyntaxGeneratorFactory } from "~syntax/factory";
import { convertToEndOfDay, convertToStartOfDay, dateTime } from "~utils/datetime";
import { insertTextAtCursorPosition } from "~utils/insertion";

import type { Command } from "../../utils/interface";

export class TomorrowCommand implements Command {
  async execute() {
    const tomorrow = dateTime().add(1, "day");
    const startTime = convertToStartOfDay(tomorrow);
    const endTime = convertToEndOfDay(tomorrow);
    const alldayEventIncluded = await loadAllDayEventIncludedSetting();
    const syntax = await loadSyntaxSetting();
    const generator = new SyntaxGeneratorFactory().create(syntax);

    try {
      document.body.style.cursor = "progress";

      const events = await getUserEvents(location.hostname, {
        startTime,
        endTime,
        alldayEventIncluded
      });

      const text =
        generator.createTitle(tomorrow) + generator.getNewLine() + generator.createEvents(location.hostname, events);

      insertTextAtCursorPosition(text);
    } catch (e) {
      console.error(e);
      alert(chrome.i18n.getMessage("error_get_events"));
    } finally {
      document.body.style.cursor = "auto";
    }
  }
}
