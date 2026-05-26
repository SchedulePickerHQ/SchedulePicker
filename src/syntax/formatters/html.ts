import type { UserEvent } from "../../schedule/events";
import { type DateTime, getDayOfWeek } from "../../utils/datetime";
import { getEventMenuEmoji } from "../eventMenuEmoji";
import type { Formatter } from "../formatter";

export class HtmlFormatter implements Formatter {
	createTitle(dateTime: DateTime) {
		return `<span>[ ${chrome.i18n.getMessage(
			"event_title",
			`${dateTime.format("YYYY/MM/DD")} (${getDayOfWeek(dateTime)})`,
		)} ]</span>`;
	}

	createEvents(hostname: string, events: UserEvent[]) {
		return events
			.map(
				(event) => `${this.createEvent(hostname, event)}${this.getNewLine()}`,
			)
			.join("")
			.replace(new RegExp(`${this.getNewLine()}$`), "");
	}

	getNewLine() {
		return "<br>";
	}

	private createEvent(hostname: string, event: UserEvent) {
		const timeRange = this.createTimeRange(event);
		const subject = this.createSubject(hostname, event.id, event.subject);
		const eventMenu =
			event.eventMenu === "" ? null : this.createEventMenu(event.eventMenu);
		return eventMenu === null
			? `<span>${timeRange} ${subject}</span>`
			: `<span>${timeRange} ${eventMenu} ${subject}</span>`;
	}

	private createTimeRange(event: UserEvent) {
		if (event.isAllDay) {
			return this.createEventMenu("終日");
		}

		const start = event.isContinuingFromYesterday
			? "--------"
			: event.startTime.format("HH:mm");
		const end = event.isContinuingToTomorrow
			? "--------"
			: event.endTime.format("HH:mm");
		return `<span>${start}-${end}</span>`;
	}

	private createEventMenu(eventMenu: string) {
		return `${getEventMenuEmoji(eventMenu)}${eventMenu}`;
	}

	private createSubject(hostname: string, eventId: string, subject: string) {
		return `<a href="https://${hostname}/g/schedule/view.csp?event=${eventId}">${subject}</a>`;
	}
}
