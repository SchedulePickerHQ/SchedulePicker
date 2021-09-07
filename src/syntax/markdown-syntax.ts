import { ScheduleEvent } from '../garoon/schedule';
import { DateTime, formatDateTime } from '../utils/date-time';
import { AbstractSyntax } from './abstract-syntax';

export class MarkdownSyntax extends AbstractSyntax {
    createTitle(dateTime: DateTime) {
        return `[ ${formatDateTime(dateTime, 'YYYY-MM-DD')} の予定 ]`;
    }

    createEvent(event: ScheduleEvent) {
        const timeRange = this.createTimeRange(event.startTime, event.endTime);
        const subject = this.createSubject(event.id, event.subject);
        const eventMenu = event.eventMenu === '' ? null : this.createEventMenu(event.eventMenu);

        if (eventMenu === null) {
            return `${timeRange} ${subject}\n`;
        }

        if (event.isAllDay) {
            return `${eventMenu} ${subject}\n`;
        }

        return `${timeRange} ${eventMenu} ${subject}\n`;
    }

    createEvents(events: ScheduleEvent[]) {
        return events.map((event) => this.createEvent(event)).join('');
    }

    private createTimeRange(startTime: DateTime, endTime: DateTime) {
        const formattedStartTime = formatDateTime(startTime, 'hh:mm');
        const formattedEndTime = formatDateTime(endTime, 'hh:mm');
        return `${formattedStartTime}-${formattedEndTime}`;
    }

    private createEventMenu(eventMenu: string) {
        return `<span style="color: ${this.getEventMenuColorCode(eventMenu)};">[${eventMenu}]</span>`;
    }

    private createSubject(eventId: string, subject: string) {
        return `[${subject}](https://bozuman.cybozu.com/g/schedule/view.csp?event=${eventId})`;
    }
}
