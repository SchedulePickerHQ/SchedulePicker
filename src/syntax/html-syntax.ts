import { ScheduleEvent } from '../garoon/schedule';
import { DateTime, formatDateTime } from '../utils/date-time';
import { Syntax } from './base/syntax';
import { getEventMenuColorCode } from './colors';

export class HtmlSyntax extends Syntax {
    createTitle(dateTime: DateTime) {
        return `<span>[ ${formatDateTime(dateTime, 'YYYY-MM-DD')} の予定 ]</span>`;
    }

    createEvent(event: ScheduleEvent) {
        const timeRange = this.createTimeRange(event.startTime, event.endTime);
        const subject = this.createSubject(event.id, event.subject);
        const eventMenu = event.eventMenu === '' ? null : this.createEventMenu(event.eventMenu);

        if (eventMenu === null) {
            return `<span>${timeRange} ${subject}</span>`;
        }

        if (event.isAllDay) {
            return `<span>${eventMenu} ${subject}</span>`;
        }

        return `<span>${timeRange} ${eventMenu} ${subject}</span>`;
    }

    createEvents(events: ScheduleEvent[]) {
        return events
            .map((event) => `${this.createEvent(event)}${this.getNewLine()}`)
            .join('')
            .replace(new RegExp(`${this.getNewLine()}$`), '');
    }

    getNewLine(): string {
        return '<br>';
    }

    private createTimeRange(startTime: DateTime, endTime: DateTime) {
        const formattedStartTime = formatDateTime(startTime, 'HH:mm');
        const formattedEndTime = formatDateTime(endTime, 'HH:mm');
        return `<span>${formattedStartTime}-${formattedEndTime}</span>`;
    }

    private createEventMenu(eventMenu: string) {
        return `<span style="background-color: ${getEventMenuColorCode(
            eventMenu,
        )}; display: inline-block; margin-right: 3px; padding: 2px 2px 1px; color: rgb(255, 255, 255); font-size: 11.628px; border-radius: 2px; line-height: 1.1;">${eventMenu}</span>`;
    }

    private createSubject(eventId: string, subject: string) {
        return `<a href="https://bozuman.cybozu.com/g/schedule/view.csp?event=${eventId}">${subject}</a>`;
    }
}
