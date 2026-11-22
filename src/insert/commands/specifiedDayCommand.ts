import type { Command } from "../../types";
import { formatDate, parseDateInput, today } from "../../utils/datetime";
import { ScheduleCommand } from "./scheduleCommand";
import type { SpecifiedDayDeps } from "./types";

export class SpecifiedDayCommand implements Command {
	constructor(private deps: SpecifiedDayDeps) {}

	async execute(): Promise<void> {
		const promptResult = this.deps.env.prompt(
			this.deps.env.getMessage("prompt_specified_date_description"),
			formatDate(today()),
		);

		if (promptResult === null) {
			return;
		}

		const date = parseDateInput(promptResult);
		if (date === null) {
			this.deps.env.showError("error_invalid_date_format", promptResult);
			return;
		}

		const scheduleCommand = new ScheduleCommand({
			...this.deps,
			resolveDate: () => date,
		});
		await scheduleCommand.execute();
	}
}
