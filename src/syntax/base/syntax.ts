import { ScheduleEvent } from '../../garoon/schedule';
import { DateTime } from '../../utils/date-time';

export abstract class Syntax {
    abstract createTitle(date: DateTime): string;
    abstract createEvent(event: ScheduleEvent): string;
    abstract createEvents(events: ScheduleEvent[]): string;
}
