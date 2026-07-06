import type { UserEvent } from "../../schedule/events";
import type { DateTime } from "../../utils/datetime";
import { formatDateWithDayOfWeek } from "../../utils/datetime";
import type { Renderer } from "../renderer";
import type { Segment } from "../segment";

export class PlainRenderer implements Renderer {
	render(segments: Segment[]) {
		return segments.map((segment) => this.renderSegment(segment)).join("");
	}

	private renderSegment(segment: Segment) {
		switch (segment.type) {
			case "text":
				return segment.value;
			case "title":
				return this.renderTitle(segment.date);
			case "events":
				return segment.events
					.map((event) => this.renderEvent(event))
					.join("\n");
		}
	}

	private renderTitle(date: DateTime) {
		return `[ ${chrome.i18n.getMessage("event_title", formatDateWithDayOfWeek(date))} ]`;
	}

	private renderEvent(event: UserEvent) {
		const timeRange = this.renderTimeRange(event);
		const eventMenu =
			event.eventMenu === "" ? null : this.renderEventMenu(event.eventMenu);
		return eventMenu === null
			? `${timeRange} ${event.subject}`
			: `${timeRange} ${eventMenu} ${event.subject}`;
	}

	private renderTimeRange(event: UserEvent) {
		if (event.isAllDay) {
			return this.renderEventMenu("終日");
		}

		const start = event.isContinuingFromYesterday
			? "--------"
			: event.startTime.format("HH:mm");
		const end = event.isContinuingToTomorrow
			? "--------"
			: event.endTime.format("HH:mm");
		return `${start}-${end}`;
	}

	private renderEventMenu(eventMenu: string) {
		return `[${eventMenu}]`;
	}
}
