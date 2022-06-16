import { searchNextBusinessDateTime } from '../../events/general';
import { getMyGroupEvents, getScheduleEvents } from '../../events/schedule';
import { getAllDayEventsIncluded, getSyntax } from '../../storage';
import { SyntaxGeneratorFactory } from '../../syntax/syntax-generator-factory';
import { convertToEndOfDay, convertToStartOfDay } from '../../util/date-time';
import { AbstractInsertScheduleCommand } from './abstract-insert-schedule-command';

export class NextBusinessDayCommand extends AbstractInsertScheduleCommand {
    protected async getSchedule(domain: string, groupId: string | null): Promise<string | null> {
        const nextBusinessDayDateTime = await searchNextBusinessDateTime(domain);
        const startTime = convertToStartOfDay(nextBusinessDayDateTime);
        const endTime = convertToEndOfDay(nextBusinessDayDateTime);
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
        return (
            generator.createTitle(nextBusinessDayDateTime) +
            generator.getNewLine() +
            generator.createEvents(domain, events)
        );
    }
}
