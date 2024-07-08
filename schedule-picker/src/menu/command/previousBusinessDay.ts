import { getPreviousBusinessDateTime } from "~schedule/businessDateTime";
import { getUserEvents } from "~schedule/events";
import { loadAllDayEventIncludedSetting, loadSyntaxSetting } from "~storage";
import { SyntaxGeneratorFactory } from "~syntax/factory";
import { convertToEndOfDay, convertToStartOfDay } from "~utils/datetime";
import { insertTextAtCursorPosition } from "~utils/insertion";

import type { Command } from "../../utils/interface";

export class PreviousBusinessDayCommand implements Command {
  async execute() {
    const previousBusinessDay = await getPreviousBusinessDateTime(location.hostname);
    const startTime = convertToStartOfDay(previousBusinessDay);
    const endTime = convertToEndOfDay(previousBusinessDay);
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
        generator.createTitle(previousBusinessDay) +
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
