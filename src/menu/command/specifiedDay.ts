import { getUserEvents } from "~schedule/events";
import { loadPeriodEventIncludedSetting, loadSyntaxSetting } from "~storage";
import { SyntaxGeneratorFactory } from "~syntax/factory";
import { convertToEndOfDay, convertToStartOfDay, dateTime, isValidDateFormat } from "~utils/datetime";
import { insertTextAtCursorPosition } from "~utils/insertion";

import type { Command } from "../../utils/interface";

export class SpecifiedDayCommand implements Command {
  async execute() {
    const promptResult = prompt(
      chrome.i18n.getMessage("prompt_specified_date_description"),
      dateTime().format("YYYY/MM/DD")
    );
    if (promptResult === null) {
      // キャンセルが押されたとき
      return null;
    }

    if (!isValidDateFormat(promptResult)) {
      alert(chrome.i18n.getMessage("error_invalid_date_format", promptResult));
      return null;
    }

    const specifiedDateTime = dateTime(promptResult);
    const startTime = convertToStartOfDay(specifiedDateTime);
    const endTime = convertToEndOfDay(specifiedDateTime);
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
        generator.createTitle(specifiedDateTime) +
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
