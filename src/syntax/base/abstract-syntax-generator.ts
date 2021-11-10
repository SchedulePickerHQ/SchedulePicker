import { MyGroupEvent, ScheduleEvent } from '../../garoon/schedule';
import { DateTime } from '../../utils/date-time';

export interface SyntaxGenerator {
    createTitle(date: DateTime): string;
    createEvents(domain: string, events: ScheduleEvent[] | MyGroupEvent[]): string;
    getNewLine(): string;
}

export abstract class AbstractSyntaxGenerator implements SyntaxGenerator {
    abstract createTitle(date: DateTime): string;
    abstract createEvent(domain: string, event: ScheduleEvent | MyGroupEvent): string;
    abstract createEvents(domain: string, events: ScheduleEvent[] | MyGroupEvent[]): string;
    abstract getNewLine(): string;

    protected isMyGroupEvent(event: ScheduleEvent | MyGroupEvent): event is MyGroupEvent {
        return 'members' in event;
    }
}
