import { insertTextAtCursorPosition } from "../../insert/cursor";
import { getNextBusinessDateTime } from "../../insert/schedule/businessDateTime";
import { getUserEvents } from "../../insert/schedule/events";
import { SyntaxGeneratorFactory } from "../../insert/syntax/factory";
import type { Command } from "../../types";
import { convertToEndOfDay, convertToStartOfDay } from "../../utils/datetime";
import {
	loadPeriodEventIncludedSetting,
	loadSyntaxSetting,
} from "../../utils/storage";

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
				periodEventIncluded,
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
