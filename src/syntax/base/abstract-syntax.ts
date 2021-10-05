import { MyGroupEvent, ScheduleEvent } from '../../garoon/schedule';
import { DateTime } from '../../utils/date-time';

export interface SyntaxGenerator {
    createTitle(date: DateTime): string;
    createEvents(events: ScheduleEvent[] | MyGroupEvent[]): string;
    getNewLine(): string;
}

export abstract class AbstractSyntax implements SyntaxGenerator {
    protected isMyGroupEvent(event: ScheduleEvent | MyGroupEvent): event is MyGroupEvent {
        return 'members' in event;
    }

    abstract createTitle(date: DateTime): string;
    abstract createEvent(event: ScheduleEvent | MyGroupEvent): string;
    abstract createEvents(events: ScheduleEvent[] | MyGroupEvent[]): string;
    abstract getNewLine(): string;
}
