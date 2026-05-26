import type { Command } from "../../types";
import { dateTime, isValidDateFormat } from "../../utils/datetime";
import { ScheduleCommand } from "./scheduleCommand";
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

		const scheduleCommand = new ScheduleCommand({
			...this.deps,
			resolveDate: () => dateTime(promptResult),
		});
		await scheduleCommand.execute();
	}
}
