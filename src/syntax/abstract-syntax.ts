import { ScheduleEvent } from '../garoon/schedule';
import { DateTime } from '../utils/date-time';

export interface Syntax {
    createTitle(date: DateTime): string;
    createEvent(event: ScheduleEvent): string;
    createEvents(events: ScheduleEvent[]): string;
}

export abstract class AbstractSyntax implements Syntax {
    protected getEventMenuColorCode(eventMenu: string): string {
        switch (eventMenu) {
            case '終日':
                return '#9acd32';
            default:
                // Throw new Error(`Not implement color of "${eventMenu}"`);
                return '#898989';
        }
    }

    abstract createTitle(date: DateTime): string;
    abstract createEvent(event: ScheduleEvent): string;
    abstract createEvents(events: ScheduleEvent[]): string;
}
