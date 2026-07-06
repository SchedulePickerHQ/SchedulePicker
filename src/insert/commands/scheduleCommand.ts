import type { Segment } from "../../render/segment";
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

			const segments: Segment[] = [
				{ type: "title", date: targetDate },
				{ type: "text", value: "\n" },
				{ type: "events", events },
			];

			this.deps.paste(
				this.deps.buildPasteContent(
					decoration,
					segments,
					this.deps.env.hostname,
				),
			);
		} catch (e) {
			handleCommandError(e, this.deps.env);
		} finally {
			this.deps.env.setCursor("auto");
		}
	}
}
