import { ScheduleEvent } from '../../garoon/schedule';
import { DateTime } from '../../utils/date-time';

export interface Syntax {
    createTitle(date: DateTime): string;
    createEvent(event: ScheduleEvent): string;
    createEvents(events: ScheduleEvent[]): string;
}

export abstract class AbstractSyntax implements Syntax {
    abstract createTitle(date: DateTime): string;
    abstract createEvent(event: ScheduleEvent): string;
    abstract createEvents(events: ScheduleEvent[]): string;
}
