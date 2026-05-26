import { insertTextAtCursorPosition } from "../../insert/cursor";
import { getUserEvents } from "../../insert/schedule/events";
import { createSyntaxGenerator } from "../../insert/syntax/factory";
import type { Command } from "../../types";
import {
	convertToEndOfDay,
	convertToStartOfDay,
	dateTime,
} from "../../utils/datetime";
import {
	loadPeriodEventIncludedSetting,
	loadSyntaxSetting,
} from "../../utils/storage";

export class TomorrowCommand implements Command {
	async execute() {
		const tomorrow = dateTime().add(1, "day");
		const startTime = convertToStartOfDay(tomorrow);
		const endTime = convertToEndOfDay(tomorrow);
		const periodEventIncluded = await loadPeriodEventIncludedSetting();
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
				generator.createTitle(tomorrow) +
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
