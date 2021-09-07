import {
    convertToISOString,
    createEndOfTime,
    createStartOfTime,
    DateTime,
    isAfterDateTime,
    isSameDateTime,
    parseISOString,
} from '../utils/date-time';
import * as GaroonApi from './api';

type ScheduleEventsQuery = {
    startTime: DateTime;
    endTime: DateTime;
    target?: {
        id: string;
        type: 'user';
    };
};

export type ScheduleEvent = {
    id: string;
    subject: string;
    startTime: DateTime;
    endTime: DateTime;
    eventType: 'REGULAR' | 'REPEATING' | 'ALL_DAY';
    eventMenu: string;
    attendees: Array<{
        id: string;
        name: string;
    }>;
    visibilityType?: 'PUBLIC' | 'PRIVATE';
    isAllDay: boolean;
    isStartOnly: boolean;
};

const convertToScheduleEvent = (
    gScheduleEvent: GaroonApi.ScheduleEvent,
    queryStartTime: DateTime,
    queryEndTime: DateTime,
): ScheduleEvent => {
    let startTime = parseISOString(gScheduleEvent.start.dateTime);
    let endTime = gScheduleEvent.isStartOnly ? null : parseISOString(gScheduleEvent.end.dateTime);

    if (!isSameDateTime(queryStartTime, startTime)) {
        startTime = createStartOfTime(queryStartTime);
    }

    if (endTime === null || !isSameDateTime(queryEndTime, endTime)) {
        endTime = createEndOfTime(queryEndTime);
    }

    const isPrivateEvent = gScheduleEvent.visibilityType === 'PRIVATE';
    const subject = isPrivateEvent ? '非公開予定' : gScheduleEvent.subject;
    const eventMenu = isPrivateEvent ? '' : gScheduleEvent.eventMenu;

    return {
        id: gScheduleEvent.id,
        subject,
        startTime,
        endTime,
        eventType: gScheduleEvent.eventType,
        eventMenu,
        attendees: gScheduleEvent.attendees.map((attendance) => ({
            id: attendance.id,
            name: attendance.name,
        })),
        visibilityType: gScheduleEvent.visibilityType,
        isAllDay: gScheduleEvent.isAllDay,
        isStartOnly: gScheduleEvent.isStartOnly,
    };
};

const sortByTime = (event: ScheduleEvent, nextEvent: ScheduleEvent) => {
    if (event.isAllDay) {
        return 1;
    }

    if (nextEvent.isAllDay) {
        return -1;
    }

    return isAfterDateTime(event.startTime, nextEvent.startTime) ? 1 : -1;
};

export const getScheduleEvents = async (domain: string, query: ScheduleEventsQuery): Promise<ScheduleEvent[]> => {
    const events = await GaroonApi.getScheduleEvents(domain, {
        rangeStart: convertToISOString(query.startTime),
        rangeEnd: convertToISOString(query.endTime),
        targetType: query.target?.type,
        target: query.target?.id,
    });
    return events.map((event) => convertToScheduleEvent(event, query.startTime, query.endTime)).sort(sortByTime);
};
