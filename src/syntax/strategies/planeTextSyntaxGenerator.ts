import type { UserEvent } from "~schedule/events";
import type { SyntaxGenerator } from "~syntax/interface";
import { getDayOfWeek, type DateTime } from "~utils/datetime";

export class PlaneTextSyntaxGenerator implements SyntaxGenerator {
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

  private createEvent(_: string, event: UserEvent) {
    const timeRange = this.createTimeRange(event);
    const subject = event.subject;
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
    return `[${eventMenu}]`;
  }
}
