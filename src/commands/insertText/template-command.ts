import { searchNextBusinessDateTime, searchPreviousBusinessDateTime } from '../../garoon/general';
import { getMyGroupEvents, getScheduleEvents } from '../../garoon/schedule';
import { getSyntax, getTemplateText } from '../../storage/storage';
import { SyntaxGeneratorFactory } from '../../syntax/syntax-generator-factory';
import { createEndOfTime, createStartOfTime, formatDateTime, getNowDateTime } from '../../utils/date-time';
import { TEMPLATE_PLACEHOLDER } from '../../utils/__test__/template-placeholder';
import { InsertTextCommand } from './insert-text-command';

const DATE_FORMAT = 'YYYY-MM-DD';

const normalizeHtml = (html: string): string =>
    html.replaceAll(/<p[^>]*>/g, '<div role="paragraph">').replaceAll('</p>', '</div>'); // TODO: テストを書く

export class TemplateCommand extends InsertTextCommand {
    protected async createSchedule(domain: string, groupId: string | null): Promise<string | null> {
        const syntax = await getSyntax();
        const generator = new SyntaxGeneratorFactory().create(syntax);
        let templateText = await getTemplateText();

        if (syntax === 'html') {
            templateText = normalizeHtml(templateText);
        }

        if (syntax === 'markdown') {
            // TODO
        }

        if (templateText.includes(TEMPLATE_PLACEHOLDER.TODAY)) {
            const dateTime = getNowDateTime();
            const title = formatDateTime(dateTime, DATE_FORMAT);
            templateText = templateText.replaceAll(TEMPLATE_PLACEHOLDER.TODAY, title);
        }

        if (templateText.includes(TEMPLATE_PLACEHOLDER.TOMORROW)) {
            const dateTime = getNowDateTime();
            dateTime.date += 1;
            const title = formatDateTime(dateTime, DATE_FORMAT);
            templateText = templateText.replaceAll(TEMPLATE_PLACEHOLDER.TOMORROW, title);
        }

        if (templateText.includes(TEMPLATE_PLACEHOLDER.YESTERDAY)) {
            const dateTime = getNowDateTime();
            dateTime.date -= 1;
            const title = formatDateTime(dateTime, DATE_FORMAT);
            templateText = templateText.replaceAll(TEMPLATE_PLACEHOLDER.YESTERDAY, title);
        }

        if (templateText.includes(TEMPLATE_PLACEHOLDER.NEXT_BUSINESS_DAY)) {
            const dateTime = await searchNextBusinessDateTime(domain);
            const title = formatDateTime(dateTime, DATE_FORMAT);
            templateText = templateText.replaceAll(TEMPLATE_PLACEHOLDER.NEXT_BUSINESS_DAY, title);
        }

        if (templateText.includes(TEMPLATE_PLACEHOLDER.PREVIOUS_BUSINESS_DAY)) {
            const dateTime = await searchPreviousBusinessDateTime(domain);
            const title = formatDateTime(dateTime, DATE_FORMAT);
            templateText = templateText.replaceAll(TEMPLATE_PLACEHOLDER.PREVIOUS_BUSINESS_DAY, title);
        }

        if (templateText.includes(TEMPLATE_PLACEHOLDER.TODAY_EVENTS)) {
            const dateTime = getNowDateTime();
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
            const schedule = generator.createEvents(domain, events);
            templateText = templateText.replaceAll(TEMPLATE_PLACEHOLDER.TODAY_EVENTS, schedule);
        }

        if (templateText.includes(TEMPLATE_PLACEHOLDER.TOMORROW_EVENTS)) {
            const dateTime = getNowDateTime();
            dateTime.date += 1;
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
            const schedule = generator.createEvents(domain, events);
            templateText = templateText.replaceAll(TEMPLATE_PLACEHOLDER.TOMORROW_EVENTS, schedule);
        }

        if (templateText.includes(TEMPLATE_PLACEHOLDER.YESTERDAY_EVENTS)) {
            const dateTime = getNowDateTime();
            dateTime.date -= 1;
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
            const schedule = generator.createEvents(domain, events);
            templateText = templateText.replaceAll(TEMPLATE_PLACEHOLDER.YESTERDAY_EVENTS, schedule);
        }

        if (templateText.includes(TEMPLATE_PLACEHOLDER.NEXT_BUSINESS_DAY_EVENTS)) {
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
            const schedule = generator.createEvents(domain, events);
            templateText = templateText.replaceAll(TEMPLATE_PLACEHOLDER.NEXT_BUSINESS_DAY_EVENTS, schedule);
        }

        if (templateText.includes(TEMPLATE_PLACEHOLDER.PREVIOUS_BUSINESS_DAY_EVENTS)) {
            const dateTime = await searchPreviousBusinessDateTime(domain);
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
            const schedule = generator.createEvents(domain, events);
            templateText = templateText.replaceAll(TEMPLATE_PLACEHOLDER.PREVIOUS_BUSINESS_DAY_EVENTS, schedule);
        }

        return templateText;
    }
}
