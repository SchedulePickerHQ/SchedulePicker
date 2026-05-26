import {
	convertToEndOfDay,
	convertToStartOfDay,
	dateTime,
} from "../../utils/datetime";
import type { TemplateDeps } from "./types";

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

export const replaceDayPlaceholders = async (
	text: string,
	deps: TemplateDeps,
): Promise<string> => {
	if (text.includes(TEMPLATE_PLACEHOLDER.TODAY)) {
		const today = dateTime();
		const title = `${today.format(DATE_FORMAT)} (${deps.getDayOfWeek(today)})`;
		text = text.replaceAll(TEMPLATE_PLACEHOLDER.TODAY, title);
	}

	if (text.includes(TEMPLATE_PLACEHOLDER.TOMORROW)) {
		const tomorrow = dateTime().add(1, "day");
		const title = `${tomorrow.format(DATE_FORMAT)} (${deps.getDayOfWeek(tomorrow)})`;
		text = text.replaceAll(TEMPLATE_PLACEHOLDER.TOMORROW, title);
	}

	if (text.includes(TEMPLATE_PLACEHOLDER.YESTERDAY)) {
		const yesterday = dateTime().subtract(1, "day");
		const title = `${yesterday.format(DATE_FORMAT)} (${deps.getDayOfWeek(yesterday)})`;
		text = text.replaceAll(TEMPLATE_PLACEHOLDER.YESTERDAY, title);
	}

	if (text.includes(TEMPLATE_PLACEHOLDER.NEXT_BUSINESS_DAY)) {
		const nextBusinessDay = await deps.getNextBusinessDay(deps.env.hostname);
		const title = `${nextBusinessDay.format(DATE_FORMAT)} (${deps.getDayOfWeek(nextBusinessDay)})`;
		text = text.replaceAll(TEMPLATE_PLACEHOLDER.NEXT_BUSINESS_DAY, title);
	}

	if (text.includes(TEMPLATE_PLACEHOLDER.PREVIOUS_BUSINESS_DAY)) {
		const previousBusinessDay = await deps.getPreviousBusinessDay(
			deps.env.hostname,
		);
		const title = `${previousBusinessDay.format(DATE_FORMAT)} (${deps.getDayOfWeek(previousBusinessDay)})`;
		text = text.replaceAll(TEMPLATE_PLACEHOLDER.PREVIOUS_BUSINESS_DAY, title);
	}

	return text;
};

export const replaceEventPlaceholders = async (
	text: string,
	deps: TemplateDeps,
): Promise<string> => {
	const eventPlaceholders = [
		TEMPLATE_PLACEHOLDER.TODAY_EVENTS,
		TEMPLATE_PLACEHOLDER.TOMORROW_EVENTS,
		TEMPLATE_PLACEHOLDER.YESTERDAY_EVENTS,
		TEMPLATE_PLACEHOLDER.NEXT_BUSINESS_DAY_EVENTS,
		TEMPLATE_PLACEHOLDER.PREVIOUS_BUSINESS_DAY_EVENTS,
	];
	if (!eventPlaceholders.some((p) => text.includes(p))) {
		return text;
	}

	const periodEventIncluded = await deps.loadPeriodEventSetting();
	const syntax = await deps.loadSyntaxSetting();
	const formatter = deps.createFormatter(syntax);

	if (text.includes(TEMPLATE_PLACEHOLDER.TODAY_EVENTS)) {
		const now = dateTime();
		const startTime = convertToStartOfDay(now);
		const endTime = convertToEndOfDay(now);
		const events = await deps.getUserEvents(deps.env.hostname, {
			startTime,
			endTime,
			periodEventIncluded,
		});
		text = text.replaceAll(
			TEMPLATE_PLACEHOLDER.TODAY_EVENTS,
			formatter.createEvents(deps.env.hostname, events),
		);
	}

	if (text.includes(TEMPLATE_PLACEHOLDER.TOMORROW_EVENTS)) {
		const tomorrow = dateTime().add(1, "day");
		const startTime = convertToStartOfDay(tomorrow);
		const endTime = convertToEndOfDay(tomorrow);
		const events = await deps.getUserEvents(deps.env.hostname, {
			startTime,
			endTime,
			periodEventIncluded,
		});
		text = text.replaceAll(
			TEMPLATE_PLACEHOLDER.TOMORROW_EVENTS,
			formatter.createEvents(deps.env.hostname, events),
		);
	}

	if (text.includes(TEMPLATE_PLACEHOLDER.YESTERDAY_EVENTS)) {
		const yesterday = dateTime().subtract(1, "day");
		const startTime = convertToStartOfDay(yesterday);
		const endTime = convertToEndOfDay(yesterday);
		const events = await deps.getUserEvents(deps.env.hostname, {
			startTime,
			endTime,
			periodEventIncluded,
		});
		text = text.replaceAll(
			TEMPLATE_PLACEHOLDER.YESTERDAY_EVENTS,
			formatter.createEvents(deps.env.hostname, events),
		);
	}

	if (text.includes(TEMPLATE_PLACEHOLDER.NEXT_BUSINESS_DAY_EVENTS)) {
		const nextBusinessDay = await deps.getNextBusinessDay(deps.env.hostname);
		const startTime = convertToStartOfDay(nextBusinessDay);
		const endTime = convertToEndOfDay(nextBusinessDay);
		const events = await deps.getUserEvents(deps.env.hostname, {
			startTime,
			endTime,
			periodEventIncluded,
		});
		text = text.replaceAll(
			TEMPLATE_PLACEHOLDER.NEXT_BUSINESS_DAY_EVENTS,
			formatter.createEvents(deps.env.hostname, events),
		);
	}

	if (text.includes(TEMPLATE_PLACEHOLDER.PREVIOUS_BUSINESS_DAY_EVENTS)) {
		const previousBusinessDay = await deps.getPreviousBusinessDay(
			deps.env.hostname,
		);
		const startTime = convertToStartOfDay(previousBusinessDay);
		const endTime = convertToEndOfDay(previousBusinessDay);
		const events = await deps.getUserEvents(deps.env.hostname, {
			startTime,
			endTime,
			periodEventIncluded,
		});
		text = text.replaceAll(
			TEMPLATE_PLACEHOLDER.PREVIOUS_BUSINESS_DAY_EVENTS,
			formatter.createEvents(deps.env.hostname, events),
		);
	}

	return text;
};
