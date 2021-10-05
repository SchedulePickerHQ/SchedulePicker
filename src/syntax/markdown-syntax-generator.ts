import { Member, ScheduleEvent } from '../garoon/schedule';
import { DateTime, formatDateTime } from '../utils/date-time';
import { AbstractSyntax } from './base/abstract-syntax';
import { COLOR, getEventMenuColorCode } from './colors';

export class MarkdownSyntaxGenerator extends AbstractSyntax {
    createTitle(dateTime: DateTime) {
        return `[ ${formatDateTime(dateTime, 'YYYY-MM-DD')} の予定 ]`;
    }

    createEvent(event: ScheduleEvent) {
        const timeRange = this.createTimeRange(event.startTime, event.endTime);
        const subject = this.createSubject(event.id, event.subject);
        const eventMenu = event.eventMenu === '' ? null : this.createEventMenu(event.eventMenu);

        if (eventMenu === null) {
            return this.isMyGroupEvent(event)
                ? `${timeRange} ${subject} ${this.createMembers(event.members)}`
                : `${timeRange} ${subject}`;
        }

        if (event.isAllDay) {
            return this.isMyGroupEvent(event)
                ? `${eventMenu} ${subject} ${this.createMembers(event.members)}`
                : `${eventMenu} ${subject}`;
        }

        return this.isMyGroupEvent(event)
            ? `${timeRange} ${eventMenu} ${subject} ${this.createMembers(event.members)}`
            : `${timeRange} ${eventMenu} ${subject}`;
    }

    createEvents(events: ScheduleEvent[]) {
        return events
            .map((event) => `${this.createEvent(event)}${this.getNewLine()}`)
            .join('')
            .replace(new RegExp(`${this.getNewLine()}$`), '');
    }

    getNewLine() {
        return '\n';
    }

    private createTimeRange(startTime: DateTime, endTime: DateTime) {
        const formattedStartTime = formatDateTime(startTime, 'HH:mm');
        const formattedEndTime = formatDateTime(endTime, 'HH:mm');
        return `${formattedStartTime}-${formattedEndTime}`;
    }

    private createEventMenu(eventMenu: string) {
        return `<span style="color: ${getEventMenuColorCode(eventMenu)};">[${eventMenu}]</span>`;
    }

    private createSubject(eventId: string, subject: string) {
        return `[${subject}](https://bozuman.cybozu.com/g/schedule/view.csp?event=${eventId})`;
    }

    private createMembers(members: Member[]) {
        return `<span style="color: ${COLOR.BROWN};">(${members
            .map((member) => member.name)
            .join(', ')
            .replace(/, $/, '')})</span>`;
    }
}
