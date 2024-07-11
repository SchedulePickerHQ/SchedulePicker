import { getNextBusinessDateTime } from "~schedule/businessDateTime";
import { getUserEvents } from "~schedule/events";
import { loadPeriodEventIncludedSetting, loadSyntaxSetting } from "~storage";
import { SyntaxGeneratorFactory } from "~syntax/factory";
import { convertToEndOfDay, convertToStartOfDay } from "~utils/datetime";
import { insertTextAtCursorPosition } from "~utils/insertion";

import type { Command } from "../../utils/interface";

export class NextBusinessDayCommand implements Command {
  async execute() {
    const nextBusinessDay = await getNextBusinessDateTime(location.hostname);
    const startTime = convertToStartOfDay(nextBusinessDay);
    const endTime = convertToEndOfDay(nextBusinessDay);
    const periodEventIncluded = await loadPeriodEventIncludedSetting();
    const syntax = await loadSyntaxSetting();
    const generator = new SyntaxGeneratorFactory().create(syntax);

    try {
      document.body.style.cursor = "progress";

      const events = await getUserEvents(location.hostname, {
        startTime,
        endTime,
        periodEventIncluded
      });

      const text =
        generator.createTitle(nextBusinessDay) +
        generator.getNewLine() +
        generator.createEvents(location.hostname, events);

      insertTextAtCursorPosition(text);
    } catch (e) {
      console.error(e);
      alert(chrome.i18n.getMessage("error_get_events"));
    } finally {
      document.body.style.cursor = "auto";
    }
  }
}
