import { getScheduleEvents } from '../../garoon/schedule';
import { getSyntax } from '../../storage/storage';
import { SyntaxFactory } from '../../syntax/syntax-factory';
import {
    createEndOfTime,
    createStartOfTime,
    formatDateTime,
    getNowDateTime,
    isValidDateFormat,
    stringToDateTime,
} from '../../utils/date-time';
import { InsertTextCommand } from './insert-text-command';

export class SpecifiedDayCommand extends InsertTextCommand {
    protected async createInsertText(domain: string): Promise<string | null> {
        const promptResult = window.prompt(
            '取得したい予定の日付を入力してください\n例: 2021/09/19',
            formatDateTime(getNowDateTime(), 'YYYY/MM/DD'),
        );
        if (promptResult === null) {
            // キャンセルが押されたとき
            return null;
        }

        if (!isValidDateFormat(promptResult)) {
            window.alert(`"${promptResult}"は無効な日付フォーマットです`);
            throw new Error('Invalid date format');
        }

        const dateTime = stringToDateTime(promptResult);
        const events = await getScheduleEvents(domain, {
            startTime: createStartOfTime(dateTime),
            endTime: createEndOfTime(dateTime),
        });
        const syntax = await getSyntax();
        const factory = new SyntaxFactory().create(syntax);
        return factory.createTitle(dateTime) + factory.getNewLine() + factory.createEvents(events);
    }
}
