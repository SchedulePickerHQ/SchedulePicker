import { searchNextBusinessDateTime } from '../../garoon/general';
import { getScheduleEvents } from '../../garoon/schedule';
import { getSyntax } from '../../storage/storage';
import { SyntaxFactory } from '../../syntax/syntax-factory';
import { createEndOfTime, createStartOfTime } from '../../utils/date-time';
import { InsertTextCommand } from './insert-text-command';

export class NextBusinessDayCommand extends InsertTextCommand {
    protected async createInsertText(domain: string): Promise<string | null> {
        const dateTime = await searchNextBusinessDateTime(domain);
        const events = await getScheduleEvents(domain, {
            startTime: createStartOfTime(dateTime),
            endTime: createEndOfTime(dateTime),
        });
        const syntax = await getSyntax();
        const factory = new SyntaxFactory().create(syntax);
        return factory.createTitle(dateTime) + factory.getNewLine() + factory.createEvents(events);
    }
}
