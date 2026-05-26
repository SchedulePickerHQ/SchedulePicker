import { getPreviousBusinessDay } from "../../schedule/businessDay";
import { getUserEvents } from "../../schedule/events";
import { createFormatter } from "../../syntax/formatter";
import type { Command } from "../../types";
import { convertToEndOfDay, convertToStartOfDay } from "../../utils/datetime";
import { loadPeriodEventSetting, loadSyntaxSetting } from "../../utils/storage";
import { insertTextAtCursorPosition } from "../cursor";

export class PreviousBusinessDayCommand implements Command {
	async execute() {
		const previousBusinessDay = await getPreviousBusinessDay(location.hostname);
		const startTime = convertToStartOfDay(previousBusinessDay);
		const endTime = convertToEndOfDay(previousBusinessDay);
		const periodEventIncluded = await loadPeriodEventSetting();
		const syntax = await loadSyntaxSetting();
		const generator = createFormatter(syntax);

		try {
			document.body.style.cursor = "progress";

			const events = await getUserEvents(location.hostname, {
				startTime,
				endTime,
				periodEventIncluded,
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
