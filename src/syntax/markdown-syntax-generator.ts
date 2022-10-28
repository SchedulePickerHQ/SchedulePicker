import { i18n } from 'webextension-polyfill';
import { Event, Member, MyGroupEvent } from '../api/schedule';
import { DateTime, getDayOfWeek } from '../util/date-time';
import { AbstractSyntaxGenerator } from './abstract-syntax-generator';
import { getEventMenuColorCode } from './event-menu-color';

export class MarkdownSyntaxGenerator extends AbstractSyntaxGenerator {
    createTitle(dateTime: DateTime) {
        return `[ ${i18n.getMessage('event_title', `${dateTime.format('YYYY/MM/DD')}(${getDayOfWeek(dateTime)})`)} ]`;
    }

    createEvent(domain: string, event: Event | MyGroupEvent) {
        const timeRange = this.createTimeRange(event);
        const subject = this.createSubject(domain, event.id, event.subject);
        const eventMenu = event.eventMenu === '' ? null : this.createEventMenu(event.eventMenu);

        if (eventMenu === null) {
            return this.isMyGroupEvent(event)
                ? `${timeRange} ${subject} ${this.createMembers(event.members)}`
                : `${timeRange} ${subject}`;
        }

        return this.isMyGroupEvent(event)
            ? `${timeRange} ${eventMenu} ${subject} ${this.createMembers(event.members)}`
            : `${timeRange} ${eventMenu} ${subject}`;
    }

    createEvents(domain: string, events: Event[]) {
        return events
            .map((event) => `${this.createEvent(domain, event)}${this.getNewLine()}`)
            .join('')
            .replace(new RegExp(`${this.getNewLine()}$`), '');
    }

    getNewLine() {
        return '\n';
    }

    private createTimeRange(event: Event | MyGroupEvent) {
        if (event.isAllDay) {
            return this.createEventMenu('終日');
        }

        const start = event.isContinuingFromYesterday ? 'XXXX' : event.startTime.format('HH:mm');
        const end = event.isContinuingToTomorrow ? 'XXXX' : event.endTime.format('HH:mm');
        return `${start}-${end}`;
    }

    private createEventMenu(eventMenu: string) {
        return `<span style="color: ${getEventMenuColorCode(eventMenu)};">[${eventMenu}]</span>`;
    }

    private createSubject(domain: string, eventId: string, subject: string) {
        return `[${subject}](https://${domain}/g/schedule/view.csp?event=${eventId})`;
    }

    private createMembers(members: Member[]) {
        return `<span style="color: #607d8b;">: ${members
            .map((member) => member.name)
            .join(', ')
            .replace(/, $/, '')}</span>`;
    }
}
