import type { UserEvent } from "~schedule/events";
import { getEventMenuColorCode } from "~syntax/eventMenuColors";
import type { SyntaxGenerator } from "~syntax/interface";
import { getDayOfWeek, type DateTime } from "~utils/datetime";

export class MarkdownSyntaxGenerator implements SyntaxGenerator {
  createTitle(dateTime: DateTime) {
    return `[ ${chrome.i18n.getMessage("event_title", `${dateTime.format("YYYY/MM/DD")} (${getDayOfWeek(dateTime)})`)} ]`;
  }

  createEvents(hostname: string, events: UserEvent[]) {
    return events
      .map((event) => `${this.createEvent(hostname, event)}${this.getNewLine()}`)
      .join("")
      .replace(new RegExp(`${this.getNewLine()}$`), "");
  }

  getNewLine() {
    return "\n";
  }

  private createEvent(hostname: string, event: UserEvent) {
    const timeRange = this.createTimeRange(event);
    const subject = this.createSubject(hostname, event.id, event.subject);
    const eventMenu = event.eventMenu === "" ? null : this.createEventMenu(event.eventMenu);
    return eventMenu === null ? `${timeRange} ${subject}` : `${timeRange} ${eventMenu} ${subject}`;
  }

  private createTimeRange(event: UserEvent) {
    if (event.isAllDay) {
      return this.createEventMenu("終日");
    }

    const start = event.isContinuingFromYesterday ? "--------" : event.startTime.format("HH:mm");
    const end = event.isContinuingToTomorrow ? "--------" : event.endTime.format("HH:mm");
    return `${start}-${end}`;
  }

  private createEventMenu(eventMenu: string) {
    return `<span style="color: ${getEventMenuColorCode(eventMenu)};">[${eventMenu}]</span>`;
  }

  private createSubject(hostname: string, eventId: string, subject: string) {
    return `[${subject}](https://${hostname}/g/schedule/view.csp?event=${eventId})`;
  }
}
