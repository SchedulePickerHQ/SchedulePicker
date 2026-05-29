import type { Command } from "../../types";
import { convertToEndOfDay, convertToStartOfDay } from "../../utils/datetime";
import { handleCommandError } from "./handleCommandError";
import type { ScheduleDeps } from "./types";

export class ScheduleCommand implements Command {
	constructor(private deps: ScheduleDeps) {}

	async execute(): Promise<void> {
		const targetDate = await this.deps.resolveDate();
		const startTime = convertToStartOfDay(targetDate);
		const endTime = convertToEndOfDay(targetDate);
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
				formatter.createTitle(targetDate) +
				formatter.getNewLine() +
				formatter.createEvents(this.deps.env.hostname, events);

			this.deps.paste(text, syntax);
		} catch (e) {
			handleCommandError(e, this.deps.env);
		} finally {
			this.deps.env.setCursor("auto");
		}
	}
}
