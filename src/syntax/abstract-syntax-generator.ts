import { MyGroupEvent, Event } from '../api/schedule';
import { DateTime } from '../util/date-time';

export interface SyntaxGenerator {
    createTitle(dateTime: DateTime): string;
    createEvents(domain: string, events: Event[] | MyGroupEvent[]): string;
    getNewLine(): string;
}

export abstract class AbstractSyntaxGenerator implements SyntaxGenerator {
    abstract createTitle(dateTime: DateTime): string;
    abstract createEvent(domain: string, event: Event | MyGroupEvent): string;
    abstract createEvents(domain: string, events: Event[] | MyGroupEvent[]): string;
    abstract getNewLine(): string;

    protected isMyGroupEvent(event: Event | MyGroupEvent): event is MyGroupEvent {
        return 'members' in event;
    }
}
