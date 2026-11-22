import type { Command } from "../../types";
import { formatDate } from "../../utils/dateFormat";
import { ScheduleCommand } from "./scheduleCommand";
import type { SpecifiedDayDeps } from "./types";

// 区切りは / と - を受け付け、月と日は 1 桁でもよい（例: 2025/1/5、2025-01-05）。
// 2025/02/30 のような存在しない日付は、別の日付に読み替えずに null にする
const parseDateInput = (input: string): Temporal.PlainDate | null => {
	const match = /^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/.exec(input);
	if (match === null) {
		return null;
	}
	try {
		return Temporal.PlainDate.from(
			{
				year: Number(match[1]),
				month: Number(match[2]),
				day: Number(match[3]),
			},
			{ overflow: "reject" },
		);
	} catch {
		return null;
	}
};

export class SpecifiedDayCommand implements Command {
	constructor(private deps: SpecifiedDayDeps) {}

	async execute(): Promise<void> {
		const promptResult = this.deps.env.prompt(
			this.deps.env.getMessage("prompt_specified_date_description"),
			formatDate(Temporal.Now.plainDateISO()),
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
