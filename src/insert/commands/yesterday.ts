import { getUserEvents } from "../../schedule/events";
import { createFormatter } from "../../syntax/formatter";
import type { Command } from "../../types";
import {
	convertToEndOfDay,
	convertToStartOfDay,
	dateTime,
} from "../../utils/datetime";
import { loadPeriodEventSetting, loadSyntaxSetting } from "../../utils/storage";
import { insertTextAtCursorPosition } from "../cursor";

export class YesterdayCommand implements Command {
	async execute() {
		const yesterday = dateTime().subtract(1, "day");
		const startTime = convertToStartOfDay(yesterday);
		const endTime = convertToEndOfDay(yesterday);
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
				generator.createTitle(yesterday) +
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
