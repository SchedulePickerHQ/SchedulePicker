import { getScheduleEvents } from '../garoon/schedule';
import { getSyntax } from '../storage/storage';
import { SyntaxFactory } from '../syntax/base/syntax-factory';
import { createEndOfTime, createStartOfTime, getNowDateTime } from '../utils/date-time';
import { ScheduleCommand } from './base/schedule-command';

export class TomorrowCommand extends ScheduleCommand {
    async createSchedule(domain: string): Promise<string | null> {
        const dateTime = getNowDateTime();
        dateTime.date += 1;
        const events = await getScheduleEvents(domain, {
            startTime: createStartOfTime(dateTime),
            endTime: createEndOfTime(dateTime),
        });
        const syntax = await getSyntax();
        const factory = new SyntaxFactory().create(syntax);
        return factory.createTitle(dateTime) + factory.createEvents(events);
    }
}
