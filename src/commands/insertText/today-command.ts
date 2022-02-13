import { getMyGroupEvents, getScheduleEvents } from '../../garoon/schedule';
import { getAllDayEventsIncluded, getSyntax } from '../../storage/storage';
import { SyntaxGeneratorFactory } from '../../syntax/syntax-generator-factory';
import { createEndOfTime, createStartOfTime, getNowDateTime } from '../../utils/date-time';
import { InsertTextCommand } from './insert-text-command';

export class TodayCommand extends InsertTextCommand {
    protected async createSchedule(domain: string, groupId: string | null): Promise<string | null> {
        const dateTime = getNowDateTime();
        const startTime = createStartOfTime(dateTime);
        const endTime = createEndOfTime(dateTime);
        const alldayEventsIncluded = await getAllDayEventsIncluded();
        const events =
            groupId === null
                ? await getScheduleEvents(domain, {
                      startTime,
                      endTime,
                      alldayEventsIncluded,
                  })
                : await getMyGroupEvents(domain, {
                      groupId,
                      startTime,
                      endTime,
                      alldayEventsIncluded,
                  });
        const syntax = await getSyntax();
        const generator = new SyntaxGeneratorFactory().create(syntax);
        return generator.createTitle(dateTime) + generator.getNewLine() + generator.createEvents(domain, events);
    }
}
