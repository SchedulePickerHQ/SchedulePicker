import { getNextBusinessDateTime, getPreviousBusinessDateTime } from "~schedule/businessDateTime";
import { getUserEvents } from "~schedule/events";
import { loadPeriodEventIncludedSetting, loadSyntaxSetting, loadTemplateText } from "~storage";
import { SyntaxGeneratorFactory } from "~syntax/factory";
import { convertToEndOfDay, convertToStartOfDay, dateTime, getDayOfWeek } from "~utils/datetime";
import { insertTextAtCursorPosition } from "~utils/insertion";

import type { Command } from "../../utils/interface";

const SPECIAL_TEMPLATE_CHARACTER = {
  TODAY: "{%TODAY%}",
  TOMORROW: "{%TOMORROW%}",
  YESTERDAY: "{%YESTERDAY%}",
  NEXT_BUSINESS_DAY: "{%NEXT_BUSINESS_DAY%}",
  PREVIOUS_BUSINESS_DAY: "{%PREVIOUS_BUSINESS_DAY%}",
  TODAY_EVENTS: "{%TODAY_EVENTS%}",
  TOMORROW_EVENTS: "{%TOMORROW_EVENTS%}",
  YESTERDAY_EVENTS: "{%YESTERDAY_EVENTS%}",
  NEXT_BUSINESS_DAY_EVENTS: "{%NEXT_BUSINESS_DAY_EVENTS%}",
  PREVIOUS_BUSINESS_DAY_EVENTS: "{%PREVIOUS_BUSINESS_DAY_EVENTS%}"
} as const;

const DATE_FORMAT = "YYYY/MM/DD";

export class TemplateCommand implements Command {
  async execute() {
    const templateText = await loadTemplateText();

    try {
      document.body.style.cursor = "progress";

      insertTextAtCursorPosition(
        await replaceSpecialEventsCharacterToUserEvents(await replaceSpecialDayCharacterToDate(templateText))
      );
    } catch (e) {
      console.error(e);
      alert(chrome.i18n.getMessage("error_get_events"));
    } finally {
      document.body.style.cursor = "auto";
    }
  }
}

const replaceSpecialDayCharacterToDate = async (text: string): Promise<string> => {
  if (text.includes(SPECIAL_TEMPLATE_CHARACTER.TODAY)) {
    const today = dateTime();
    const title = `${today.format(DATE_FORMAT)} (${getDayOfWeek(today)})`;
    text = text.replaceAll(SPECIAL_TEMPLATE_CHARACTER.TODAY, title);
  }

  if (text.includes(SPECIAL_TEMPLATE_CHARACTER.TOMORROW)) {
    const tomorrow = dateTime().add(1, "day");
    const title = `${tomorrow.format(DATE_FORMAT)} (${getDayOfWeek(tomorrow)})`;
    text = text.replaceAll(SPECIAL_TEMPLATE_CHARACTER.TOMORROW, title);
  }

  if (text.includes(SPECIAL_TEMPLATE_CHARACTER.YESTERDAY)) {
    const yesterday = dateTime().subtract(1, "day");
    const title = `${yesterday.format(DATE_FORMAT)} (${getDayOfWeek(yesterday)})`;
    text = text.replaceAll(SPECIAL_TEMPLATE_CHARACTER.YESTERDAY, title);
  }

  if (text.includes(SPECIAL_TEMPLATE_CHARACTER.NEXT_BUSINESS_DAY)) {
    const nextBusinessDay = await getNextBusinessDateTime(location.hostname);
    const title = `${nextBusinessDay.format(DATE_FORMAT)} (${getDayOfWeek(nextBusinessDay)})`;
    text = text.replaceAll(SPECIAL_TEMPLATE_CHARACTER.NEXT_BUSINESS_DAY, title);
  }

  if (text.includes(SPECIAL_TEMPLATE_CHARACTER.PREVIOUS_BUSINESS_DAY)) {
    const previousBusinessDay = await getPreviousBusinessDateTime(location.hostname);
    const title = `${previousBusinessDay.format(DATE_FORMAT)} (${getDayOfWeek(previousBusinessDay)})`;
    text = text.replaceAll(SPECIAL_TEMPLATE_CHARACTER.PREVIOUS_BUSINESS_DAY, title);
  }

  return text;
};

const replaceSpecialEventsCharacterToUserEvents = async (text: string): Promise<string> => {
  const periodEventIncluded = await loadPeriodEventIncludedSetting();
  const syntax = await loadSyntaxSetting();
  const generator = new SyntaxGeneratorFactory().create(syntax);

  if (text.includes(SPECIAL_TEMPLATE_CHARACTER.TODAY_EVENTS)) {
    const now = dateTime();
    const startTime = convertToStartOfDay(now);
    const endTime = convertToEndOfDay(now);
    const events = await getUserEvents(location.hostname, { startTime, endTime, periodEventIncluded });
    text = text.replaceAll(SPECIAL_TEMPLATE_CHARACTER.TODAY_EVENTS, generator.createEvents(location.hostname, events));
  }

  if (text.includes(SPECIAL_TEMPLATE_CHARACTER.TOMORROW_EVENTS)) {
    const tomorrow = dateTime().add(1, "day");
    const startTime = convertToStartOfDay(tomorrow);
    const endTime = convertToEndOfDay(tomorrow);
    const events = await getUserEvents(location.hostname, { startTime, endTime, periodEventIncluded });
    text = text.replaceAll(
      SPECIAL_TEMPLATE_CHARACTER.TOMORROW_EVENTS,
      generator.createEvents(location.hostname, events)
    );
  }

  if (text.includes(SPECIAL_TEMPLATE_CHARACTER.YESTERDAY_EVENTS)) {
    const yesterday = dateTime().subtract(1, "day");
    const startTime = convertToStartOfDay(yesterday);
    const endTime = convertToEndOfDay(yesterday);
    const events = await getUserEvents(location.hostname, { startTime, endTime, periodEventIncluded });
    text = text.replaceAll(
      SPECIAL_TEMPLATE_CHARACTER.YESTERDAY_EVENTS,
      generator.createEvents(location.hostname, events)
    );
  }

  if (text.includes(SPECIAL_TEMPLATE_CHARACTER.NEXT_BUSINESS_DAY_EVENTS)) {
    const nextBusinessDay = await getNextBusinessDateTime(location.hostname);
    const startTime = convertToStartOfDay(nextBusinessDay);
    const endTime = convertToEndOfDay(nextBusinessDay);
    const events = await getUserEvents(location.hostname, { startTime, endTime, periodEventIncluded });
    text = text.replaceAll(
      SPECIAL_TEMPLATE_CHARACTER.NEXT_BUSINESS_DAY_EVENTS,
      generator.createEvents(location.hostname, events)
    );
  }

  if (text.includes(SPECIAL_TEMPLATE_CHARACTER.PREVIOUS_BUSINESS_DAY_EVENTS)) {
    const previousBusinessDay = await getPreviousBusinessDateTime(location.hostname);
    const startTime = convertToStartOfDay(previousBusinessDay);
    const endTime = convertToEndOfDay(previousBusinessDay);
    const events = await getUserEvents(location.hostname, { startTime, endTime, periodEventIncluded });
    text = text.replaceAll(
      SPECIAL_TEMPLATE_CHARACTER.PREVIOUS_BUSINESS_DAY_EVENTS,
      generator.createEvents(location.hostname, events)
    );
  }

  return text;
};
