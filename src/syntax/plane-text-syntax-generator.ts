import { i18n } from 'webextension-polyfill';
import { Event, Member, MyGroupEvent } from '../api/schedule';
import { DateTime } from '../util/date-time';
import { AbstractSyntaxGenerator } from './abstract-syntax-generator';

export class PlaneTextSyntaxGenerator extends AbstractSyntaxGenerator {
    createTitle(dateTime: DateTime) {
        return `[ ${i18n.getMessage('event_title', dateTime.format('YYYY-MM-DD'))} ]`;
    }

    createEvent(_: string, event: Event | MyGroupEvent) {
        const timeRange = this.createTimeRange(event);
        const subject = event.subject;
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
        return `[${eventMenu}]`;
    }

    private createMembers(members: Member[]) {
        return `: ${members
            .map((member) => member.name)
            .join(', ')
            .replace(/, $/, '')}`;
    }
}
