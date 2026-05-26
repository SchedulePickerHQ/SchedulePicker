import { insertTextAtCursorPosition } from "../../insert/cursor";
import { getUserEvents } from "../../insert/schedule/events";
import { createSyntaxGenerator } from "../../insert/syntax/factory";
import type { Command } from "../../types";
import {
	convertToEndOfDay,
	convertToStartOfDay,
	dateTime,
} from "../../utils/datetime";
import { loadPeriodEventSetting, loadSyntaxSetting } from "../../utils/storage";

export class TodayCommand implements Command {
	async execute() {
		const now = dateTime();
		const startTime = convertToStartOfDay(now);
		const endTime = convertToEndOfDay(now);
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
				generator.createTitle(now) +
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
