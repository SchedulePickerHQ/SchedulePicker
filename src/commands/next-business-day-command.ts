import { searchNextBusinessDateTime } from '../garoon/general';
import { getScheduleEvents } from '../garoon/schedule';
import { getSyntax } from '../storage/storage';
import { SyntaxFactory } from '../syntax/base/syntax-factory';
import { createEndOfTime, createStartOfTime } from '../utils/date-time';
import { ScheduleCommand } from './base/schedule-command';

export class NextBusinessDayCommand extends ScheduleCommand {
    async createSchedule(domain: string): Promise<string | null> {
        const dateTime = await searchNextBusinessDateTime(domain);
        const events = await getScheduleEvents(domain, {
            startTime: createStartOfTime(dateTime),
            endTime: createEndOfTime(dateTime),
        });
        const syntax = await getSyntax();
        const factory = new SyntaxFactory().create(syntax);
        return factory.createTitle(dateTime) + factory.createEvents(events);
    }
}
