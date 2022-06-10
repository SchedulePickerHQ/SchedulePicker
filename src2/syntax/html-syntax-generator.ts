import { Member } from '../content/events/schedule';
import { DateTime } from '../util/date-time';
import { AbstractSyntaxGenerator } from './abstract-syntax-generator';
import { getEventMenuColorCode } from './event-menu-color';

export class HtmlSyntaxGenerator extends AbstractSyntaxGenerator {
    createTitle(dateTime: DateTime) {
        return `<span>[ ${dateTime.format('YYYY-MM-DD')} の予定 ]</span>`;
    }

    createEvent(domain: string, event: ScheduleEvent | MyGroupEvent) {
        const timeRange = event.isAllDay
            ? this.createEventMenu('終日')
            : this.createTimeRange(event.startTime, event.endTime);
        const subject = this.createSubject(domain, event.id, event.subject);
        const eventMenu = event.eventMenu === '' ? null : this.createEventMenu(event.eventMenu);

        if (eventMenu === null) {
            return this.isMyGroupEvent(event)
                ? `<span>${timeRange} ${subject} ${this.createMembers(event.members)}</span>`
                : `<span>${timeRange} ${subject}</span>`;
        }

        return this.isMyGroupEvent(event)
            ? `<span>${timeRange} ${eventMenu} ${subject} ${this.createMembers(event.members)}</span>`
            : `<span>${timeRange} ${eventMenu} ${subject}</span>`;
    }

    createEvents(domain: string, events: ScheduleEvent[] | MyGroupEvent[]) {
        return events
            .map((event) => `${this.createEvent(domain, event)}${this.getNewLine()}`)
            .join('')
            .replace(new RegExp(`${this.getNewLine()}$`), '');
    }

    getNewLine() {
        return '<br>';
    }

    private createTimeRange(startTime: DateTime, endTime: DateTime) {
        const formattedStartTime = startTime.format('HH:mm');
        const formattedEndTime = endTime.format('HH:mm');
        return `<span>${formattedStartTime}-${formattedEndTime}</span>`;
    }

    private createEventMenu(eventMenu: string) {
        return `<span style="background-color: ${getEventMenuColorCode(
            eventMenu,
        )}; display: inline-block; margin-right: 3px; padding: 2px 2px 1px; color: rgb(255, 255, 255); font-size: 11.628px; border-radius: 2px; line-height: 1.1;">${eventMenu}</span>`;
    }

    private createSubject(domain: string, eventId: string, subject: string) {
        return `<a href="https://${domain}/g/schedule/view.csp?event=${eventId}">${subject}</a>`;
    }

    private createMembers(members: Member[]) {
        return `<span style="color: #b99976;">(${members
            .map((member) => member.name)
            .join(', ')
            .replace(/, $/, '')})</span>`;
    }
}
