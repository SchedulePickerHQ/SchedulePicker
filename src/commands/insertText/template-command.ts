import { searchNextBusinessDateTime, searchPreviousBusinessDateTime } from '../../garoon/general';
import { getScheduleEvents } from '../../garoon/schedule';
import { getSyntax, getTemplateText } from '../../storage/storage';
import { SyntaxFactory } from '../../syntax/syntax-factory';
import { createEndOfTime, createStartOfTime, getNowDateTime } from '../../utils/date-time';
import { InsertTextCommand } from './insert-text-command';

const SPECIAL_TEMPLATE_CHARACTOR = {
    TODAY_TITLE: '{%TODAY_TITLE%}',
    TOMORROW_TITLE: '{%TOMORROW_TITLE%}',
    YESTERDAY_TITLE: '{%YESTERDAY_TITLE%}',
    NEXT_BUSINESS_DAY_TITLE: '{%NEXT_BUSINESS_DAY_TITLE%}',
    PREVIOUS_BUSINESS_DAY_TITLE: '{%PREVIOUS_BUSINESS_DAY_TITLE%}',
    TODAY: '{%TODAY%}',
    TOMORROW: '{%TOMORROW%}',
    YESTERDAY: '{%YESTERDAY%}',
    NEXT_BUSINESS_DAY: '{%NEXT_BUSINESS_DAY%}',
    PREVIOUS_BUSINESS_DAY: '{%PREVIOUS_BUSINESS_DAY%}',
} as const;

export class TemplateCommand extends InsertTextCommand {
    protected async createInsertText(domain: string): Promise<string | null> {
        const syntax = await getSyntax();
        const factory = new SyntaxFactory().create(syntax);
        let templateText = await getTemplateText();

        if (templateText.includes(SPECIAL_TEMPLATE_CHARACTOR.TODAY_TITLE)) {
            const dateTime = getNowDateTime();
            const title = factory.createTitle(dateTime);
            templateText = templateText.replaceAll(SPECIAL_TEMPLATE_CHARACTOR.TODAY_TITLE, title);
        }

        if (templateText.includes(SPECIAL_TEMPLATE_CHARACTOR.TOMORROW_TITLE)) {
            const dateTime = getNowDateTime();
            dateTime.date += 1;
            const title = factory.createTitle(dateTime);
            templateText = templateText.replaceAll(SPECIAL_TEMPLATE_CHARACTOR.TOMORROW_TITLE, title);
        }

        if (templateText.includes(SPECIAL_TEMPLATE_CHARACTOR.YESTERDAY_TITLE)) {
            const dateTime = getNowDateTime();
            dateTime.date -= 1;
            const title = factory.createTitle(dateTime);
            templateText = templateText.replaceAll(SPECIAL_TEMPLATE_CHARACTOR.YESTERDAY_TITLE, title);
        }

        if (templateText.includes(SPECIAL_TEMPLATE_CHARACTOR.NEXT_BUSINESS_DAY_TITLE)) {
            const dateTime = await searchNextBusinessDateTime(domain);
            const title = factory.createTitle(dateTime);
            templateText = templateText.replaceAll(SPECIAL_TEMPLATE_CHARACTOR.NEXT_BUSINESS_DAY_TITLE, title);
        }

        if (templateText.includes(SPECIAL_TEMPLATE_CHARACTOR.PREVIOUS_BUSINESS_DAY_TITLE)) {
            const dateTime = await searchPreviousBusinessDateTime(domain);
            const title = factory.createTitle(dateTime);
            templateText = templateText.replaceAll(SPECIAL_TEMPLATE_CHARACTOR.PREVIOUS_BUSINESS_DAY_TITLE, title);
        }

        if (templateText.includes(SPECIAL_TEMPLATE_CHARACTOR.TODAY)) {
            const dateTime = getNowDateTime();
            const events = await getScheduleEvents(domain, {
                startTime: createStartOfTime(dateTime),
                endTime: createEndOfTime(dateTime),
            });
            const schedule = factory.createEvents(events);
            templateText = templateText.replaceAll(SPECIAL_TEMPLATE_CHARACTOR.TODAY, schedule);
        }

        if (templateText.includes(SPECIAL_TEMPLATE_CHARACTOR.TOMORROW)) {
            const dateTime = getNowDateTime();
            dateTime.date += 1;
            const events = await getScheduleEvents(domain, {
                startTime: createStartOfTime(dateTime),
                endTime: createEndOfTime(dateTime),
            });
            const schedule = factory.createEvents(events);
            templateText = templateText.replaceAll(SPECIAL_TEMPLATE_CHARACTOR.TOMORROW, schedule);
        }

        if (templateText.includes(SPECIAL_TEMPLATE_CHARACTOR.YESTERDAY)) {
            const dateTime = getNowDateTime();
            dateTime.date -= 1;
            const events = await getScheduleEvents(domain, {
                startTime: createStartOfTime(dateTime),
                endTime: createEndOfTime(dateTime),
            });
            const schedule = factory.createEvents(events);
            templateText = templateText.replaceAll(SPECIAL_TEMPLATE_CHARACTOR.YESTERDAY, schedule);
        }

        if (templateText.includes(SPECIAL_TEMPLATE_CHARACTOR.NEXT_BUSINESS_DAY)) {
            const dateTime = await searchNextBusinessDateTime(domain);
            const events = await getScheduleEvents(domain, {
                startTime: createStartOfTime(dateTime),
                endTime: createEndOfTime(dateTime),
            });
            const schedule = factory.createEvents(events);
            templateText = templateText.replaceAll(SPECIAL_TEMPLATE_CHARACTOR.NEXT_BUSINESS_DAY, schedule);
        }

        if (templateText.includes(SPECIAL_TEMPLATE_CHARACTOR.PREVIOUS_BUSINESS_DAY)) {
            const dateTime = await searchPreviousBusinessDateTime(domain);
            const events = await getScheduleEvents(domain, {
                startTime: createStartOfTime(dateTime),
                endTime: createEndOfTime(dateTime),
            });
            const schedule = factory.createEvents(events);
            templateText = templateText.replaceAll(SPECIAL_TEMPLATE_CHARACTOR.PREVIOUS_BUSINESS_DAY, schedule);
        }

        return templateText;
    }
}
