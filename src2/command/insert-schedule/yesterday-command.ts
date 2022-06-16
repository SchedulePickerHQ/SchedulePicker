import { getMyGroupEvents, getScheduleEvents } from '../../events/schedule';
import { getAllDayEventsIncluded, getSyntax } from '../../storage';
import { SyntaxGeneratorFactory } from '../../syntax/syntax-generator-factory';
import { convertToEndOfDay, convertToStartOfDay, dateTime } from '../../util/date-time';
import { AbstractInsertScheduleCommand } from './abstract-insert-schedule-command';

export class YesterdayCommand extends AbstractInsertScheduleCommand {
    protected async getSchedule(domain: string, groupId: string | null): Promise<string | null> {
        const yesterdayDateTime = dateTime().subtract(1, 'day');
        const startTime = convertToStartOfDay(yesterdayDateTime);
        const endTime = convertToEndOfDay(yesterdayDateTime);
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
            generator.createTitle(yesterdayDateTime) + generator.getNewLine() + generator.createEvents(domain, events)
        );
    }
}
