import type { UserEvent } from "../../schedule/events";
import type { Renderer } from "../renderer";
import type { Segment } from "../segment";
import { timeRangeText, titleText } from "./shared";

export class PlainRenderer implements Renderer {
	render(segments: Segment[]) {
		return segments.map((segment) => this.renderSegment(segment)).join("");
	}

	private renderSegment(segment: Segment) {
		switch (segment.type) {
			case "text":
				return segment.value;
			case "title":
				return titleText(segment.date);
			case "events":
				return segment.events
					.map((event) => this.renderEvent(event))
					.join("\n");
		}
	}

	private renderEvent(event: UserEvent) {
		const timeRange = timeRangeText(event) ?? this.renderEventMenu("終日");
		const eventMenu =
			event.eventMenu === "" ? null : this.renderEventMenu(event.eventMenu);
		return eventMenu === null
			? `${timeRange} ${event.subject}`
			: `${timeRange} ${eventMenu} ${event.subject}`;
	}

	private renderEventMenu(eventMenu: string) {
		return `[${eventMenu}]`;
	}
}
