import { i18n } from 'webextension-polyfill';
import { getMyGroupEvents, getScheduleEvents } from '../../events/schedule';
import { getAllDayEventsIncluded, getSyntax } from '../../storage';
import { SyntaxGeneratorFactory } from '../../syntax/syntax-generator-factory';
import { convertToEndOfDay, convertToStartOfDay, dateTime, isValidDateFormat } from '../../util/date-time';
import { showAlert } from '../../view/alert';
import { AbstractInsertScheduleCommand } from './abstract-insert-schedule-command';

export class SpecifiedDayCommand extends AbstractInsertScheduleCommand {
    protected async getSchedule(domain: string, groupId: string | null): Promise<string | null> {
        const promptResult = window.prompt(
            '取得したい予定の日付を入力してください\n例: 2021/09/19',
            dateTime().format('YYYY/MM/DD'),
        );
        if (promptResult === null) {
            // キャンセルが押されたとき
            return null;
        }

        if (!isValidDateFormat(promptResult)) {
            // showAlert(`"${promptResult}"は無効な日付フォーマットです`);
            showAlert(i18n.getMessage('error_invalid_date_format', promptResult));
            return null;
        }

        const resultDateTime = dateTime(promptResult);
        const startTime = convertToStartOfDay(resultDateTime);
        const endTime = convertToEndOfDay(resultDateTime);
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
        return generator.createTitle(resultDateTime) + generator.getNewLine() + generator.createEvents(domain, events);
    }
}
