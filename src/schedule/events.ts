import { convertToEndOfDay, convertToStartOfDay, dateTime, type DateTime } from "~utils/datetime";

import { getScheduleEvents, type ScheduleEvent } from "./api/garoon";

type UserEventsQuery = {
  startTime: DateTime;
  endTime: DateTime;
  periodEventIncluded: boolean;
};

export type UserEvent = {
  id: string;
  subject: string;
  startTime: DateTime;
  endTime: DateTime;
  eventType: "REGULAR" | "REPEATING" | "ALL_DAY" | "TEMPORARY";
  eventMenu: string;
  visibilityType?: "PUBLIC" | "PRIVATE";
  isStartOnly: boolean;
  isAllDay: boolean;
  isContinuingFromYesterday: boolean;
  isContinuingToTomorrow: boolean;
};

export const getUserEvents = async (hostname: string, query: UserEventsQuery): Promise<UserEvent[]> => {
  const events = await getScheduleEvents(hostname, {
    rangeStart: query.startTime.toISOString(),
    rangeEnd: query.endTime.toISOString()
  });

  return events
    .filter((event) => (query.periodEventIncluded ? true : event.eventType !== "ALL_DAY"))
    .map((event) => convertToUserEvent(event, query.startTime, query.endTime))
    .sort(sortByTime);
};

const convertToUserEvent = (
  scheduleEvent: ScheduleEvent,
  queryStartTime: DateTime,
  queryEndTime: DateTime
): UserEvent => {
  const scheduleEventStartTime = dateTime(scheduleEvent.start.dateTime);
  const isContinuingFromYesterday = scheduleEventStartTime.isBefore(queryStartTime, "day");
  const startTime = isContinuingFromYesterday ? convertToStartOfDay(queryStartTime) : scheduleEventStartTime;

  const scheduleEventEndTime =
    !scheduleEvent.isStartOnly && "end" in scheduleEvent ? dateTime(scheduleEvent.end.dateTime) : null;
  const isContinuingToTomorrow = scheduleEventEndTime === null || scheduleEventEndTime.isAfter(queryEndTime, "day");
  const endTime = isContinuingToTomorrow ? convertToEndOfDay(queryEndTime) : scheduleEventEndTime;

  const isPrivateEvent = scheduleEvent.visibilityType === "PRIVATE";
  const subject = isPrivateEvent ? "非公開予定" : scheduleEvent.subject;
  const eventMenu = isPrivateEvent ? "" : scheduleEvent.eventMenu;

  return {
    id: scheduleEvent.id,
    subject,
    startTime,
    endTime,
    eventType: scheduleEvent.eventType,
    eventMenu,
    visibilityType: scheduleEvent.visibilityType,
    isAllDay: scheduleEvent.isAllDay,
    isStartOnly: scheduleEvent.isStartOnly,
    isContinuingFromYesterday,
    isContinuingToTomorrow
  };
};

const sortByTime = (event1: UserEvent, event2: UserEvent) => {
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
