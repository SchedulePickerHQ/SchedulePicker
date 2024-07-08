import { getUserEvents } from "~schedule/events";
import { loadAllDayEventIncludedSetting, loadSyntaxSetting } from "~storage";
import { SyntaxGeneratorFactory } from "~syntax/factory";
import { convertToEndOfDay, convertToStartOfDay, dateTime } from "~utils/datetime";
import { insertTextAtCursorPosition } from "~utils/insertion";

import type { Command } from "../../utils/interface";

export class TodayCommand implements Command {
  async execute() {
    const now = dateTime();
    const startTime = convertToStartOfDay(now);
    const endTime = convertToEndOfDay(now);
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
        generator.createTitle(now) + generator.getNewLine() + generator.createEvents(location.hostname, events);

      insertTextAtCursorPosition(text);
    } catch (e) {
      console.error(e);
      alert(chrome.i18n.getMessage("error_get_events"));
    } finally {
      document.body.style.cursor = "auto";
    }
  }
}
