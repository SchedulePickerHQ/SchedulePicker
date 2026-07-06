import type { Formatter } from "../../syntax/formatter";
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
		const decoration = await this.deps.loadDecorationSetting();

		try {
			this.deps.env.setCursor("progress");

			const events = await this.deps.getUserEvents(this.deps.env.hostname, {
				startTime,
				endTime,
				periodEventIncluded,
			});

			const buildText = (formatter: Formatter) =>
				formatter.createTitle(targetDate) +
				formatter.getNewLine() +
				formatter.createEvents(this.deps.env.hostname, events);

			const plainText = buildText(this.deps.createFormatter("plain"));
			const styledHtml =
				decoration === "styled"
					? buildText(this.deps.createFormatter("styled"))
					: undefined;

			this.deps.paste(plainText, styledHtml);
		} catch (e) {
			handleCommandError(e, this.deps.env);
		} finally {
			this.deps.env.setCursor("auto");
		}
	}
}
