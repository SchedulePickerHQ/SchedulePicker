import type { UserEvent } from "../../schedule/events";
import { escapeHtml, textToHtml } from "../escapeHtml";
import { getEventMenuColor } from "../eventMenuColor";
import type { Renderer } from "../renderer";
import type { Segment } from "../segment";
import { timeRangeText, titleText } from "./shared";

export class StyledRenderer implements Renderer {
	constructor(private hostname: string) {}

	render(segments: Segment[]) {
		return segments.map((segment) => this.renderSegment(segment)).join("");
	}

	private renderSegment(segment: Segment) {
		switch (segment.type) {
			case "text":
				return textToHtml(segment.value);
			case "title":
				return `<span>${titleText(segment.date)}</span>`;
			case "events":
				return segment.events
					.map((event) => this.renderEvent(event))
					.join("<br>");
		}
	}

	private renderEvent(event: UserEvent) {
		const timeRange = this.renderTimeRange(event);
		const subject = this.renderSubject(event.id, event.subject);
		const eventMenu =
			event.eventMenu === "" ? null : this.renderEventMenu(event.eventMenu);
		return eventMenu === null
			? `<span>${timeRange} ${subject}</span>`
			: `<span>${timeRange} ${eventMenu} ${subject}</span>`;
	}

	private renderTimeRange(event: UserEvent) {
		const text = timeRangeText(event);
		return text === null
			? this.renderEventMenu("終日")
			: `<span>${text}</span>`;
	}

	private renderEventMenu(eventMenu: string) {
		return `<span style="background-color: ${getEventMenuColor(eventMenu)}; display: inline-block; padding: 2px; color: rgb(255, 255, 255); font-size: 12px; border-radius: 2px; line-height: 1.0;">${escapeHtml(eventMenu)}</span>`;
	}

	private renderSubject(eventId: string, subject: string) {
		// 件名は Garoon 由来の外部データで < や & を含みうるため、忠実に表示するにはエスケープする
		return `<a href="https://${this.hostname}/g/schedule/view.csp?event=${eventId}">${escapeHtml(subject)}</a>`;
	}
}
