import { DateTime, parseISOString } from '../utils/date-time';
import { getCalendarEvents } from './api';

export const getPublicHolidays = async (domain: string): Promise<DateTime[]> => {
    const calendarEvents = await getCalendarEvents(domain);
    return calendarEvents
        .filter((event) => event.type === 'public_holiday')
        .map((holidayEvent) => parseISOString(holidayEvent.date.toISOString()));
};
