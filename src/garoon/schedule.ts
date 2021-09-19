import {
    dateTimeToISOString,
    createEndOfTime,
    createStartOfTime,
    DateTime,
    isAfterDateTime,
    isSameDate,
    stringToDateTime,
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
    eventType: 'REGULAR' | 'REPEATING';
    eventMenu: string;
    attendees: Array<{
        id: string;
        name: string;
    }>;
    visibilityType?: 'PUBLIC' | 'PRIVATE';
    isAllDay: boolean;
    isStartOnly: boolean;
};

const isEventTypeRegularOrRepeating = (
    eventType: 'REGULAR' | 'REPEATING' | 'ALL_DAY',
): eventType is 'REGULAR' | 'REPEATING' => eventType === 'REGULAR' || eventType === 'REPEATING';

const convertToScheduleEvent = (
    gScheduleEvent: GaroonApi.ScheduleEvent,
    queryStartTime: DateTime,
    queryEndTime: DateTime,
): ScheduleEvent => {
    let startTime = stringToDateTime(gScheduleEvent.start.dateTime);
    let endTime = gScheduleEvent.isStartOnly ? null : stringToDateTime(gScheduleEvent.end.dateTime);

    if (!isSameDate(queryStartTime, startTime)) {
        startTime = createStartOfTime(queryStartTime);
    }

    if (endTime === null || !isSameDate(queryEndTime, endTime)) {
        endTime = createEndOfTime(queryEndTime);
    }

    const isPrivateEvent = gScheduleEvent.visibilityType === 'PRIVATE';
    const subject = isPrivateEvent ? '非公開予定' : gScheduleEvent.subject;
    const eventMenu = isPrivateEvent ? '' : gScheduleEvent.eventMenu;

    console.assert(
        isEventTypeRegularOrRepeating(gScheduleEvent.eventType),
        `Error: ${gScheduleEvent.subject} event type is "ALL_DAY"`,
    );

    return {
        id: gScheduleEvent.id,
        subject,
        startTime,
        endTime,
        eventType: gScheduleEvent.eventType as 'REGULAR' | 'REPEATING',
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
        rangeStart: dateTimeToISOString(query.startTime),
        rangeEnd: dateTimeToISOString(query.endTime),
        targetType: query.target?.type,
        target: query.target?.id,
    });
    return events
        .filter((event) => isEventTypeRegularOrRepeating(event.eventType)) // 期間予定を除外する
        .map((event) => convertToScheduleEvent(event, query.startTime, query.endTime))
        .sort(sortByTime);
};
