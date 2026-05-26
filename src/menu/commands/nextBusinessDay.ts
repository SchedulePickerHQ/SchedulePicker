import { insertTextAtCursorPosition } from "../../insert/cursor";
import { getNextBusinessDateTime } from "../../insert/schedule/businessDateTime";
import { getUserEvents } from "../../insert/schedule/events";
import { createSyntaxGenerator } from "../../insert/syntax/factory";
import type { Command } from "../../types";
import { convertToEndOfDay, convertToStartOfDay } from "../../utils/datetime";
import { loadPeriodEventSetting, loadSyntaxSetting } from "../../utils/storage";

export class NextBusinessDayCommand implements Command {
	async execute() {
		const nextBusinessDay = await getNextBusinessDateTime(location.hostname);
		const startTime = convertToStartOfDay(nextBusinessDay);
		const endTime = convertToEndOfDay(nextBusinessDay);
		const periodEventIncluded = await loadPeriodEventSetting();
		const syntax = await loadSyntaxSetting();
		const generator = createSyntaxGenerator(syntax);

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
