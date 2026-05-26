import {
	getNextBusinessDay,
	getPreviousBusinessDay,
} from "../../schedule/businessDay";
import { getUserEvents } from "../../schedule/events";
import { createFormatter } from "../../syntax/formatter";
import type { Command } from "../../types";
import {
	convertToEndOfDay,
	convertToStartOfDay,
	dateTime,
	getDayOfWeek,
} from "../../utils/datetime";
import {
	loadPeriodEventSetting,
	loadSyntaxSetting,
	loadTemplateText,
} from "../../utils/storage";
import { insertTextAtCursorPosition } from "../cursor";

const TEMPLATE_PLACEHOLDER = {
	TODAY: "{%TODAY%}",
	TOMORROW: "{%TOMORROW%}",
	YESTERDAY: "{%YESTERDAY%}",
	NEXT_BUSINESS_DAY: "{%NEXT_BUSINESS_DAY%}",
	PREVIOUS_BUSINESS_DAY: "{%PREVIOUS_BUSINESS_DAY%}",
	TODAY_EVENTS: "{%TODAY_EVENTS%}",
	TOMORROW_EVENTS: "{%TOMORROW_EVENTS%}",
	YESTERDAY_EVENTS: "{%YESTERDAY_EVENTS%}",
	NEXT_BUSINESS_DAY_EVENTS: "{%NEXT_BUSINESS_DAY_EVENTS%}",
	PREVIOUS_BUSINESS_DAY_EVENTS: "{%PREVIOUS_BUSINESS_DAY_EVENTS%}",
} as const;

const DATE_FORMAT = "YYYY/MM/DD";

export class TemplateCommand implements Command {
	async execute() {
		const templateText = await loadTemplateText();

		try {
			document.body.style.cursor = "progress";

			insertTextAtCursorPosition(
				await replaceEventPlaceholders(
					await replaceDayPlaceholders(templateText),
				),
			);
		} catch (e) {
			console.error(e);
			alert(chrome.i18n.getMessage("error_get_events"));
		} finally {
			document.body.style.cursor = "auto";
		}
	}
}

const replaceDayPlaceholders = async (text: string): Promise<string> => {
	if (text.includes(TEMPLATE_PLACEHOLDER.TODAY)) {
		const today = dateTime();
		const title = `${today.format(DATE_FORMAT)} (${getDayOfWeek(today)})`;
		text = text.replaceAll(TEMPLATE_PLACEHOLDER.TODAY, title);
	}

	if (text.includes(TEMPLATE_PLACEHOLDER.TOMORROW)) {
		const tomorrow = dateTime().add(1, "day");
		const title = `${tomorrow.format(DATE_FORMAT)} (${getDayOfWeek(tomorrow)})`;
		text = text.replaceAll(TEMPLATE_PLACEHOLDER.TOMORROW, title);
	}

	if (text.includes(TEMPLATE_PLACEHOLDER.YESTERDAY)) {
		const yesterday = dateTime().subtract(1, "day");
		const title = `${yesterday.format(DATE_FORMAT)} (${getDayOfWeek(yesterday)})`;
		text = text.replaceAll(TEMPLATE_PLACEHOLDER.YESTERDAY, title);
	}

	if (text.includes(TEMPLATE_PLACEHOLDER.NEXT_BUSINESS_DAY)) {
		const nextBusinessDay = await getNextBusinessDay(location.hostname);
		const title = `${nextBusinessDay.format(DATE_FORMAT)} (${getDayOfWeek(nextBusinessDay)})`;
		text = text.replaceAll(TEMPLATE_PLACEHOLDER.NEXT_BUSINESS_DAY, title);
	}

	if (text.includes(TEMPLATE_PLACEHOLDER.PREVIOUS_BUSINESS_DAY)) {
		const previousBusinessDay = await getPreviousBusinessDay(location.hostname);
		const title = `${previousBusinessDay.format(DATE_FORMAT)} (${getDayOfWeek(previousBusinessDay)})`;
		text = text.replaceAll(TEMPLATE_PLACEHOLDER.PREVIOUS_BUSINESS_DAY, title);
	}

	return text;
};

const replaceEventPlaceholders = async (text: string): Promise<string> => {
	const periodEventIncluded = await loadPeriodEventSetting();
	const syntax = await loadSyntaxSetting();
	const generator = createFormatter(syntax);

	if (text.includes(TEMPLATE_PLACEHOLDER.TODAY_EVENTS)) {
		const now = dateTime();
		const startTime = convertToStartOfDay(now);
		const endTime = convertToEndOfDay(now);
		const events = await getUserEvents(location.hostname, {
			startTime,
			endTime,
			periodEventIncluded,
		});
		text = text.replaceAll(
			TEMPLATE_PLACEHOLDER.TODAY_EVENTS,
			generator.createEvents(location.hostname, events),
		);
	}

	if (text.includes(TEMPLATE_PLACEHOLDER.TOMORROW_EVENTS)) {
		const tomorrow = dateTime().add(1, "day");
		const startTime = convertToStartOfDay(tomorrow);
		const endTime = convertToEndOfDay(tomorrow);
		const events = await getUserEvents(location.hostname, {
			startTime,
			endTime,
			periodEventIncluded,
		});
		text = text.replaceAll(
			TEMPLATE_PLACEHOLDER.TOMORROW_EVENTS,
			generator.createEvents(location.hostname, events),
		);
	}

	if (text.includes(TEMPLATE_PLACEHOLDER.YESTERDAY_EVENTS)) {
		const yesterday = dateTime().subtract(1, "day");
		const startTime = convertToStartOfDay(yesterday);
		const endTime = convertToEndOfDay(yesterday);
		const events = await getUserEvents(location.hostname, {
			startTime,
			endTime,
			periodEventIncluded,
		});
		text = text.replaceAll(
			TEMPLATE_PLACEHOLDER.YESTERDAY_EVENTS,
			generator.createEvents(location.hostname, events),
		);
	}

	if (text.includes(TEMPLATE_PLACEHOLDER.NEXT_BUSINESS_DAY_EVENTS)) {
		const nextBusinessDay = await getNextBusinessDay(location.hostname);
		const startTime = convertToStartOfDay(nextBusinessDay);
		const endTime = convertToEndOfDay(nextBusinessDay);
		const events = await getUserEvents(location.hostname, {
			startTime,
			endTime,
			periodEventIncluded,
		});
		text = text.replaceAll(
			TEMPLATE_PLACEHOLDER.NEXT_BUSINESS_DAY_EVENTS,
			generator.createEvents(location.hostname, events),
		);
	}

	if (text.includes(TEMPLATE_PLACEHOLDER.PREVIOUS_BUSINESS_DAY_EVENTS)) {
		const previousBusinessDay = await getPreviousBusinessDay(location.hostname);
		const startTime = convertToStartOfDay(previousBusinessDay);
		const endTime = convertToEndOfDay(previousBusinessDay);
		const events = await getUserEvents(location.hostname, {
			startTime,
			endTime,
			periodEventIncluded,
		});
		text = text.replaceAll(
			TEMPLATE_PLACEHOLDER.PREVIOUS_BUSINESS_DAY_EVENTS,
			generator.createEvents(location.hostname, events),
		);
	}

	return text;
};
