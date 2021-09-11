import { ScheduleEvent } from '../garoon/schedule';
import { DateTime, formatDateTime } from '../utils/date-time';
import { AbstractSyntax } from './abstract-syntax';
import { getEventMenuColorCode } from './colors';

export class HtmlSyntax extends AbstractSyntax {
    createTitle(dateTime: DateTime) {
        return `<div>[ ${formatDateTime(dateTime, 'YYYY-MM-DD')} の予定 ]</div>`;
    }

    createEvent(event: ScheduleEvent) {
        const timeRange = this.createTimeRange(event.startTime, event.endTime);
        const subject = this.createSubject(event.id, event.subject);
        const eventMenu = event.eventMenu === '' ? null : this.createEventMenu(event.eventMenu);

        if (eventMenu === null) {
            return `<div>${timeRange} ${subject}</div>`;
        }

        if (event.isAllDay) {
            return `<div>${eventMenu} ${subject}</div>`;
        }

        return `<div>${timeRange} ${eventMenu} ${subject}</div>`;
    }

    createEvents(events: ScheduleEvent[]) {
        return events.map((event) => this.createEvent(event)).join('');
    }

    private createTimeRange(startTime: DateTime, endTime: DateTime) {
        const formattedStartTime = formatDateTime(startTime, 'HH:mm');
        const formattedEndTime = formatDateTime(endTime, 'HH:mm');
        return `<span>${formattedStartTime}-${formattedEndTime}</span>`;
    }

    private createEventMenu(eventMenu: string) {
        return `<span
                    style="background-color: ${getEventMenuColorCode(eventMenu)};
                    display: inline-block; 
                    margin-right: 3px; 
                    padding: 2px 2px 1px; 
                    color: rgb(255, 255, 255); 
                    font-size: 11.628px; 
                    border-radius: 2px; 
                    line-height: 1.1;">${eventMenu}</span>`;
    }

    private createSubject(eventId: string, subject: string) {
        return `<a href="https://bozuman.cybozu.com/g/schedule/view.csp?event=${eventId}">${subject}</a>`;
    }
}
