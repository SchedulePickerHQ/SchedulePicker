import type { UserEvent } from "../../schedule/events";
import { type DateTime, getDayOfWeek } from "../../utils/datetime";
import { escapeHtml } from "../escapeHtml";
import { getEventMenuColor } from "../eventMenuColor";
import type { Renderer } from "../renderer";
import type { Segment } from "../segment";

const DATE_FORMAT = "YYYY/MM/DD";

export class StyledRenderer implements Renderer {
	constructor(private hostname: string) {}

	render(segments: Segment[]) {
		return segments.map((segment) => this.renderSegment(segment)).join("");
	}

	private renderSegment(segment: Segment) {
		switch (segment.type) {
			case "text":
				// 生テキストをそのまま HTML に載せると < や & が構文として解釈され、
				// \n はただの空白に潰れる。文字として・改行として明示的に表現する
				return escapeHtml(segment.value).replaceAll("\n", "<br>");
			case "title":
				return this.renderTitle(segment.date);
			case "events":
				return segment.events
					.map((event) => this.renderEvent(event))
					.join("<br>");
		}
	}

	private renderTitle(date: DateTime) {
		return `<span>[ ${chrome.i18n.getMessage(
			"event_title",
			`${date.format(DATE_FORMAT)} (${getDayOfWeek(date)})`,
		)} ]</span>`;
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
		if (event.isAllDay) {
			return this.renderEventMenu("終日");
		}

		const start = event.isContinuingFromYesterday
			? "--------"
			: event.startTime.format("HH:mm");
		const end = event.isContinuingToTomorrow
			? "--------"
			: event.endTime.format("HH:mm");
		return `<span>${start}-${end}</span>`;
	}

	private renderEventMenu(eventMenu: string) {
		return `<span style="background-color: ${getEventMenuColor(eventMenu)}; display: inline-block; padding: 2px; color: rgb(255, 255, 255); font-size: 12px; border-radius: 2px; line-height: 1.0;">${escapeHtml(eventMenu)}</span>`;
	}

	private renderSubject(eventId: string, subject: string) {
		// 件名は Garoon 由来の外部データで < や & を含みうるため、忠実に表示するにはエスケープする
		return `<a href="https://${this.hostname}/g/schedule/view.csp?event=${eventId}">${escapeHtml(subject)}</a>`;
	}
}
