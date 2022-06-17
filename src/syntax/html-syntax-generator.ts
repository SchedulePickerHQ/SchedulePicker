import { Member, MyGroupEvent, ScheduleEvent } from '../events/schedule';
import { DateTime } from '../util/date-time';
import { AbstractSyntaxGenerator } from './abstract-syntax-generator';
import { getEventMenuColorCode } from './event-menu-color';

export class HtmlSyntaxGenerator extends AbstractSyntaxGenerator {
    createTitle(dateTime: DateTime) {
        return `<span>[ ${dateTime.format('YYYY-MM-DD')} の予定 ]</span>`;
    }

    createEvent(domain: string, event: ScheduleEvent | MyGroupEvent) {
        const timeRange = this.createTimeRange(event);
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

    private createTimeRange(event: ScheduleEvent | MyGroupEvent) {
        if (event.isAllDay) {
            return this.createEventMenu('終日');
        }

        const start = event.isContinuingFromYesterday ? '(前日)' : event.startTime.format('HH:mm');
        const end = event.isContinuingToTomorrow ? '(翌日)' : event.endTime.format('HH:mm');
        return `<span>${start}-${end}</span>`;
    }

    private createEventMenu(eventMenu: string) {
        return `<span style="background-color: ${getEventMenuColorCode(
            eventMenu,
        )}; display: inline-block; padding: 2px; color: rgb(255, 255, 255); font-size: 12px; border-radius: 2px; line-height: 1.0;">${eventMenu}</span>`;
    }

    private createSubject(domain: string, eventId: string, subject: string) {
        return `<a href="https://${domain}/g/schedule/view.csp?event=${eventId}">${subject}</a>`;
    }

    private createMembers(members: Member[]) {
        return `<span style="color: #607d8b;">${members
            .map((member) => member.name)
            .join(', ')
            .replace(/, $/, '')}</span>`;
    }
}
