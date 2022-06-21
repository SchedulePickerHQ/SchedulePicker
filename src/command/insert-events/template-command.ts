import { searchNextBusinessDateTime, searchPreviousBusinessDateTime } from '../../api/general';
import { getEvents, getMyGroupEvents } from '../../api/schedule';
import { getAllDayEventsIncluded, getSyntax, getTemplateText } from '../../storage';
import { SyntaxGeneratorFactory } from '../../syntax/syntax-generator-factory';
import { convertToEndOfDay, convertToStartOfDay, dateTime } from '../../util/date-time';
import { AbstractInsertEventsCommand } from './abstract-insert-events-command';

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

export class TemplateCommand extends AbstractInsertEventsCommand {
    protected async getEvents(domain: string, groupId: string | null): Promise<string | null> {
        const syntax = await getSyntax();
        const generator = new SyntaxGeneratorFactory().create(syntax);
        let templateText = await getTemplateText();

        if (templateText.includes(SPECIAL_TEMPLATE_CHARACTER.TODAY)) {
            const title = dateTime().format(DATE_FORMAT);
            templateText = templateText.replaceAll(SPECIAL_TEMPLATE_CHARACTER.TODAY, title);
        }

        if (templateText.includes(SPECIAL_TEMPLATE_CHARACTER.TOMORROW)) {
            const title = dateTime().add(1, 'day').format(DATE_FORMAT);
            templateText = templateText.replaceAll(SPECIAL_TEMPLATE_CHARACTER.TOMORROW, title);
        }

        if (templateText.includes(SPECIAL_TEMPLATE_CHARACTER.YESTERDAY)) {
            const title = dateTime().subtract(1, 'day').format(DATE_FORMAT);
            templateText = templateText.replaceAll(SPECIAL_TEMPLATE_CHARACTER.YESTERDAY, title);
        }

        if (templateText.includes(SPECIAL_TEMPLATE_CHARACTER.NEXT_BUSINESS_DAY)) {
            const nextBusinessDateTime = await searchNextBusinessDateTime(domain);
            const title = nextBusinessDateTime.format(DATE_FORMAT);
            templateText = templateText.replaceAll(SPECIAL_TEMPLATE_CHARACTER.NEXT_BUSINESS_DAY, title);
        }

        if (templateText.includes(SPECIAL_TEMPLATE_CHARACTER.PREVIOUS_BUSINESS_DAY)) {
            const previousBusinessDateTime = await searchPreviousBusinessDateTime(domain);
            const title = previousBusinessDateTime.format(DATE_FORMAT);
            templateText = templateText.replaceAll(SPECIAL_TEMPLATE_CHARACTER.PREVIOUS_BUSINESS_DAY, title);
        }

        if (templateText.includes(SPECIAL_TEMPLATE_CHARACTER.TODAY_EVENTS)) {
            const now = dateTime();
            const startTime = convertToStartOfDay(now);
            const endTime = convertToEndOfDay(now);
            const alldayEventsIncluded = await getAllDayEventsIncluded();
            const events =
                groupId === null
                    ? await getEvents(domain, {
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
            templateText = templateText.replaceAll(
                SPECIAL_TEMPLATE_CHARACTER.TODAY_EVENTS,
                generator.createEvents(domain, events),
            );
        }

        if (templateText.includes(SPECIAL_TEMPLATE_CHARACTER.TOMORROW_EVENTS)) {
            const tomorrowDateTime = dateTime().add(1, 'day');
            const startTime = convertToStartOfDay(tomorrowDateTime);
            const endTime = convertToEndOfDay(tomorrowDateTime);
            const alldayEventsIncluded = await getAllDayEventsIncluded();
            const events =
                groupId === null
                    ? await getEvents(domain, {
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
            templateText = templateText.replaceAll(
                SPECIAL_TEMPLATE_CHARACTER.TOMORROW_EVENTS,
                generator.createEvents(domain, events),
            );
        }

        if (templateText.includes(SPECIAL_TEMPLATE_CHARACTER.YESTERDAY_EVENTS)) {
            const yesterdayDateTime = dateTime().subtract(1, 'day');
            const startTime = convertToStartOfDay(yesterdayDateTime);
            const endTime = convertToEndOfDay(yesterdayDateTime);
            const alldayEventsIncluded = await getAllDayEventsIncluded();
            const events =
                groupId === null
                    ? await getEvents(domain, {
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
            templateText = templateText.replaceAll(
                SPECIAL_TEMPLATE_CHARACTER.YESTERDAY_EVENTS,
                generator.createEvents(domain, events),
            );
        }

        if (templateText.includes(SPECIAL_TEMPLATE_CHARACTER.NEXT_BUSINESS_DAY_EVENTS)) {
            const nextBusinessDayDateTime = await searchNextBusinessDateTime(domain);
            const startTime = convertToStartOfDay(nextBusinessDayDateTime);
            const endTime = convertToEndOfDay(nextBusinessDayDateTime);
            const alldayEventsIncluded = await getAllDayEventsIncluded();
            const events =
                groupId === null
                    ? await getEvents(domain, {
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
            templateText = templateText.replaceAll(
                SPECIAL_TEMPLATE_CHARACTER.NEXT_BUSINESS_DAY_EVENTS,
                generator.createEvents(domain, events),
            );
        }

        if (templateText.includes(SPECIAL_TEMPLATE_CHARACTER.PREVIOUS_BUSINESS_DAY_EVENTS)) {
            const previousBusinessDayDateTime = await searchNextBusinessDateTime(domain);
            const startTime = convertToStartOfDay(previousBusinessDayDateTime);
            const endTime = convertToEndOfDay(previousBusinessDayDateTime);
            const alldayEventsIncluded = await getAllDayEventsIncluded();
            const events =
                groupId === null
                    ? await getEvents(domain, {
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
            templateText = templateText.replaceAll(
                SPECIAL_TEMPLATE_CHARACTER.PREVIOUS_BUSINESS_DAY_EVENTS,
                generator.createEvents(domain, events),
            );
        }

        return templateText;
    }
}
