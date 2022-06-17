import { MyGroupEvent, ScheduleEvent } from '../events/schedule';
import { DateTime } from '../util/date-time';

export interface SyntaxGenerator {
    createTitle(dateTime: DateTime): string;
    createEvents(domain: string, events: ScheduleEvent[] | MyGroupEvent[]): string;
    getNewLine(): string;
}

export abstract class AbstractSyntaxGenerator implements SyntaxGenerator {
    abstract createTitle(dateTime: DateTime): string;
    abstract createEvent(domain: string, event: ScheduleEvent | MyGroupEvent): string;
    abstract createEvents(domain: string, events: ScheduleEvent[] | MyGroupEvent[]): string;
    abstract getNewLine(): string;

    protected isMyGroupEvent(event: ScheduleEvent | MyGroupEvent): event is MyGroupEvent {
        return 'members' in event;
    }
}
