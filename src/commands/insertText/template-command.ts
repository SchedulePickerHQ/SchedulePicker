import { searchNextBusinessDateTime, searchPreviousBusinessDateTime } from '../../garoon/general';
import { getScheduleEvents } from '../../garoon/schedule';
import { getSyntax, getTemplateText } from '../../storage/storage';
import { SyntaxFactory } from '../../syntax/syntax-factory';
import { createEndOfTime, createStartOfTime, getNowDateTime, formatDateTime } from '../../utils/date-time';
import { InsertTextCommand } from './insert-text-command';

const SPECIAL_TEMPLATE_CHARACTER = {
    TODAY: '{%TODAY%}',
    TOMORROW: '{%TOMORROW%}',
    YESTERDAY: '{%YESTERDAY%}',
    NEXT_BUSINESS_DAY: '{%NEXT_BUSINESS_DAY%}',
    PREVIOUS_BUSINESS_DAY: '{%PREVIOUS_BUSINESS_DAY%}',
    TODAY_EVENTS: '{%TODAY_EVENTS%}',
    TOMORROW_EVENTS: '{%TOMORROW_EVENTS%}',
    YESTERDAY_EVENTS: '{%YESTERDAY_EVENTS%}',
    NEXT_BUSINESS_DAY_EVENTS: '{%NEXT_BUSINESS_DAY_EVENTS%}',
    PREVIOUS_BUSINESS_DAY_EVENTS: '{%PREVIOUS_BUSINESS_DAY_EVENTS%}',
} as const;

const DATE_FORMAT = 'YYYY-MM-DD';

export class TemplateCommand extends InsertTextCommand {
    protected async createInsertText(domain: string): Promise<string | null> {
        const syntax = await getSyntax();
        const factory = new SyntaxFactory().create(syntax);
        let templateText = await getTemplateText();

        if (templateText.includes(SPECIAL_TEMPLATE_CHARACTER.TODAY)) {
            const dateTime = getNowDateTime();
            const title = formatDateTime(dateTime, DATE_FORMAT);
            templateText = templateText.replaceAll(SPECIAL_TEMPLATE_CHARACTER.TODAY, title);
        }

        if (templateText.includes(SPECIAL_TEMPLATE_CHARACTER.TOMORROW)) {
            const dateTime = getNowDateTime();
            dateTime.date += 1;
            const title = formatDateTime(dateTime, DATE_FORMAT);
            templateText = templateText.replaceAll(SPECIAL_TEMPLATE_CHARACTER.TOMORROW, title);
        }

        if (templateText.includes(SPECIAL_TEMPLATE_CHARACTER.YESTERDAY)) {
            const dateTime = getNowDateTime();
            dateTime.date -= 1;
            const title = formatDateTime(dateTime, DATE_FORMAT);
            templateText = templateText.replaceAll(SPECIAL_TEMPLATE_CHARACTER.YESTERDAY, title);
        }

        if (templateText.includes(SPECIAL_TEMPLATE_CHARACTER.NEXT_BUSINESS_DAY)) {
            const dateTime = await searchNextBusinessDateTime(domain);
            const title = formatDateTime(dateTime, DATE_FORMAT);
            templateText = templateText.replaceAll(SPECIAL_TEMPLATE_CHARACTER.NEXT_BUSINESS_DAY, title);
        }

        if (templateText.includes(SPECIAL_TEMPLATE_CHARACTER.PREVIOUS_BUSINESS_DAY)) {
            const dateTime = await searchPreviousBusinessDateTime(domain);
            const title = formatDateTime(dateTime, DATE_FORMAT);
            templateText = templateText.replaceAll(SPECIAL_TEMPLATE_CHARACTER.PREVIOUS_BUSINESS_DAY, title);
        }

        if (templateText.includes(SPECIAL_TEMPLATE_CHARACTER.TODAY_EVENTS)) {
            const dateTime = getNowDateTime();
            const events = await getScheduleEvents(domain, {
                startTime: createStartOfTime(dateTime),
                endTime: createEndOfTime(dateTime),
            });
            const schedule = factory.createEvents(events);
            templateText = templateText.replaceAll(SPECIAL_TEMPLATE_CHARACTER.TODAY_EVENTS, schedule);
        }

        if (templateText.includes(SPECIAL_TEMPLATE_CHARACTER.TOMORROW_EVENTS)) {
            const dateTime = getNowDateTime();
            dateTime.date += 1;
            const events = await getScheduleEvents(domain, {
                startTime: createStartOfTime(dateTime),
                endTime: createEndOfTime(dateTime),
            });
            const schedule = factory.createEvents(events);
            templateText = templateText.replaceAll(SPECIAL_TEMPLATE_CHARACTER.TOMORROW_EVENTS, schedule);
        }

        if (templateText.includes(SPECIAL_TEMPLATE_CHARACTER.YESTERDAY_EVENTS)) {
            const dateTime = getNowDateTime();
            dateTime.date -= 1;
            const events = await getScheduleEvents(domain, {
                startTime: createStartOfTime(dateTime),
                endTime: createEndOfTime(dateTime),
            });
            const schedule = factory.createEvents(events);
            templateText = templateText.replaceAll(SPECIAL_TEMPLATE_CHARACTER.YESTERDAY_EVENTS, schedule);
        }

        if (templateText.includes(SPECIAL_TEMPLATE_CHARACTER.NEXT_BUSINESS_DAY_EVENTS)) {
            const dateTime = await searchNextBusinessDateTime(domain);
            const events = await getScheduleEvents(domain, {
                startTime: createStartOfTime(dateTime),
                endTime: createEndOfTime(dateTime),
            });
            const schedule = factory.createEvents(events);
            templateText = templateText.replaceAll(SPECIAL_TEMPLATE_CHARACTER.NEXT_BUSINESS_DAY_EVENTS, schedule);
        }

        if (templateText.includes(SPECIAL_TEMPLATE_CHARACTER.PREVIOUS_BUSINESS_DAY_EVENTS)) {
            const dateTime = await searchPreviousBusinessDateTime(domain);
            const events = await getScheduleEvents(domain, {
                startTime: createStartOfTime(dateTime),
                endTime: createEndOfTime(dateTime),
            });
            const schedule = factory.createEvents(events);
            templateText = templateText.replaceAll(SPECIAL_TEMPLATE_CHARACTER.PREVIOUS_BUSINESS_DAY_EVENTS, schedule);
        }

        return templateText;
    }
}
