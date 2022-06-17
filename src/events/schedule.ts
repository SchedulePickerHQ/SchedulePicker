import * as GaroonApi from '../api/garoon-api';
import { assert, assertExists } from '../util/assert';
import { convertToEndOfDay, convertToStartOfDay, dateTime, DateTime } from '../util/date-time';
import { getMyGroups } from './general';

type ScheduleEventsQuery = {
    startTime: DateTime;
    endTime: DateTime;
    alldayEventsIncluded: boolean;
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
    isStartOnly: boolean;
    isAllDay: boolean;
    isContinuingFromYesterday: boolean;
    isContinuingToTomorrow: boolean;
};

type MyGroupEventsQuery = {
    groupId: string;
    startTime: DateTime;
    endTime: DateTime;
    alldayEventsIncluded: boolean;
};

export type Member = {
    id: string;
    name: string;
};

export type MyGroupEvent = ScheduleEvent & {
    members: Member[];
};

const isEventTypeRegularOrRepeating = (
    eventType: 'REGULAR' | 'REPEATING' | 'ALL_DAY',
): eventType is 'REGULAR' | 'REPEATING' => eventType === 'REGULAR' || eventType === 'REPEATING';

const convertToScheduleEvent = (
    gScheduleEvent: GaroonApi.ScheduleEvent,
    queryStartTime: DateTime,
    queryEndTime: DateTime,
): ScheduleEvent => {
    let startTime = dateTime(gScheduleEvent.start.dateTime);
    let endTime = gScheduleEvent.isStartOnly ? null : dateTime(gScheduleEvent.end.dateTime);

    if (endTime === null) {
        endTime = convertToEndOfDay(queryEndTime);
    }

    const isContinuingFromYesterday = startTime.isBefore(queryStartTime, 'day');
    if (isContinuingFromYesterday) {
        startTime = convertToStartOfDay(queryStartTime);
    }

    const isContinuingToTomorrow = endTime.isAfter(queryEndTime, 'day');
    if (isContinuingToTomorrow) {
        endTime = convertToEndOfDay(queryEndTime);
    }

    const isPrivateEvent = gScheduleEvent.visibilityType === 'PRIVATE';
    const subject = isPrivateEvent ? '非公開予定' : gScheduleEvent.subject;
    const eventMenu = isPrivateEvent ? '' : gScheduleEvent.eventMenu;

    assert(
        isEventTypeRegularOrRepeating(gScheduleEvent.eventType),
        `Error: ${gScheduleEvent.subject} event type is "ALL_DAY"`,
    );

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
        isContinuingFromYesterday,
        isContinuingToTomorrow,
    };
};

const sortByTime = (event1: ScheduleEvent, event2: ScheduleEvent) => {
    if (event1.isAllDay) {
        return 1;
    }

    if (event2.isAllDay) {
        return -1;
    }

    if (event1.startTime.isSame(event2.startTime)) {
        if (event1.endTime.isSame(event2.endTime)) {
            return 0;
        }

        return event1.endTime.isAfter(event2.endTime) ? 1 : -1;
    }

    return event1.startTime.isAfter(event2.startTime) ? 1 : -1;
};

export const getScheduleEvents = async (domain: string, query: ScheduleEventsQuery): Promise<ScheduleEvent[]> => {
    const events = await GaroonApi.getScheduleEvents(domain, {
        rangeStart: query.startTime.toISOString(),
        rangeEnd: query.endTime.toISOString(),
        targetType: query.target?.type,
        target: query.target?.id,
    });

    return events
        .filter((event) =>
            isEventTypeRegularOrRepeating(event.eventType) && query.alldayEventsIncluded ? true : !event.isAllDay,
        ) // 期間予定を除外する && 終日予定を含まない設定の場合は終日予定を除外する
        .map((event) => convertToScheduleEvent(event, query.startTime, query.endTime))
        .sort(sortByTime);
};

export const getMyGroupEvents = async (domain: string, query: MyGroupEventsQuery): Promise<MyGroupEvent[]> => {
    const { groupId, startTime, endTime, alldayEventsIncluded } = query;
    const myGroups = await getMyGroups(domain);
    const myGroupMembers = myGroups.find((group) => group.key === groupId)?.belong_member;
    assertExists(myGroupMembers);

    const eventsList = await Promise.all(
        myGroupMembers.map(async (userId) => {
            const events = await getScheduleEvents(domain, {
                startTime,
                endTime,
                alldayEventsIncluded,
                target: { id: userId, type: 'user' },
            });
            return events;
        }),
    );

    return eventsList
        .reduce((uniqueEvents: ScheduleEvent[], events: ScheduleEvent[]) => {
            const filter = events.filter((event) => !uniqueEvents.some((uniqueEvent) => uniqueEvent.id === event.id));
            return uniqueEvents.concat(filter);
        }, [])
        .sort(sortByTime)
        .map((event) => {
            const members = event.attendees.filter((attendee) => myGroupMembers.includes(attendee.id));
            return {
                ...event,
                members,
            };
        });
};

export const VisibleForTesting = {
    isEventTypeRegularOrRepeating,
    convertToScheduleEvent,
    sortByTime,
};
