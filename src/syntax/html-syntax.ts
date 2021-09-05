import { ScheduleEvent } from '../garoon/schedule';
import { DateTime, formatDateTime } from '../utils/date-time';
import { AbstractSyntax } from './abstract-syntax';

export class HtmlSyntax extends AbstractSyntax {
    createTitle(dateTime: DateTime) {
        return `<div>[ ${formatDateTime(dateTime, 'YYYY-MM-DD')} の予定 ]</div>`;
    }

    createEvent(event: ScheduleEvent) {
        throw new Error('Method not implemented.');
    }

    createEvents(events: ScheduleEvent[]) {
        throw new Error('Method not implemented.');
    }
}
