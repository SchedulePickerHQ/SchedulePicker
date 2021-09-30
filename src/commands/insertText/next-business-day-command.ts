import { searchNextBusinessDateTime } from '../../garoon/general';
import { getMyGroupEvents, getScheduleEvents } from '../../garoon/schedule';
import { getSyntax } from '../../storage/storage';
import { SyntaxFactory } from '../../syntax/syntax-factory';
import { createEndOfTime, createStartOfTime } from '../../utils/date-time';
import { InsertTextCommand } from './insert-text-command';

export class NextBusinessDayCommand extends InsertTextCommand {
    protected async createSchedule(domain: string, groupId: string | null): Promise<string | null> {
        const dateTime = await searchNextBusinessDateTime(domain);
        const startTime = createStartOfTime(dateTime);
        const endTime = createEndOfTime(dateTime);
        const events =
            groupId === null
                ? await getScheduleEvents(domain, {
                      startTime,
                      endTime,
                  })
                : await getMyGroupEvents(domain, {
                      groupId,
                      startTime,
                      endTime,
                  });
        const syntax = await getSyntax();
        const factory = new SyntaxFactory().create(syntax);
        return factory.createTitle(dateTime) + factory.getNewLine() + factory.createEvents(events);
    }
}
