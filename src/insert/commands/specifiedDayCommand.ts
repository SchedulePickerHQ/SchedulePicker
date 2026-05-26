import type { Command } from "../../types";
import {
	convertToEndOfDay,
	convertToStartOfDay,
	dateTime,
	isValidDateFormat,
} from "../../utils/datetime";
import type { ScheduleDeps } from "./types";

type SpecifiedDayDeps = Omit<ScheduleDeps, "resolveDate">;

export class SpecifiedDayCommand implements Command {
	constructor(private deps: SpecifiedDayDeps) {}

	async execute(): Promise<void> {
		const promptResult = this.deps.env.prompt(
			this.deps.env.getMessage("prompt_specified_date_description"),
			dateTime().format("YYYY/MM/DD"),
		);

		if (promptResult === null) {
			return;
		}

		if (!isValidDateFormat(promptResult)) {
			this.deps.env.showError("error_invalid_date_format", promptResult);
			return;
		}

		const specifiedDateTime = dateTime(promptResult);
		const startTime = convertToStartOfDay(specifiedDateTime);
		const endTime = convertToEndOfDay(specifiedDateTime);
		const periodEventIncluded = await this.deps.loadPeriodEventSetting();
		const syntax = await this.deps.loadSyntaxSetting();
		const formatter = this.deps.createFormatter(syntax);

		try {
			this.deps.env.setCursor("progress");

			const events = await this.deps.getUserEvents(this.deps.env.hostname, {
				startTime,
				endTime,
				periodEventIncluded,
			});

			const text =
				formatter.createTitle(specifiedDateTime) +
				formatter.getNewLine() +
				formatter.createEvents(this.deps.env.hostname, events);

			this.deps.insertText(text);
		} catch (e) {
			console.error(e);
			this.deps.env.showError("error_get_events");
		} finally {
			this.deps.env.setCursor("auto");
		}
	}
}
