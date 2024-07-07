import GaroonSoap from "garoon-soap";
import { type BaseGetCalendarEventType } from "garoon-soap/dist/type/base";

type ScheduleEventsParameters = {
  rangeStart?: string;
  rangeEnd?: string;
  targetType?: "user" | "organization" | "facility";
  target?: string;
};

// スケジュールオブジェクト https://developer.cybozu.io/hc/ja/articles/115005314266
// 予定の終了時刻が登録されていないとき end キーが存在しない
export type ScheduleEvent =
  | {
      id: string;
      subject: string;
      start: {
        dateTime: string;
        timeZone: string;
      };
      end: {
        dateTime: string;
        timeZone: string;
      };
      eventType: "REGULAR" | "REPEATING" | "ALL_DAY" | "TEMPORARY";
      eventMenu: string;
      visibilityType?: "PUBLIC" | "PRIVATE";
      isAllDay: boolean;
      isStartOnly: boolean;
    }
  | {
      id: string;
      subject: string;
      start: {
        dateTime: string;
        timeZone: string;
      };
      eventType: "REGULAR" | "REPEATING" | "ALL_DAY";
      eventMenu: string;
      attendees: Array<{
        id: string;
        name: string;
      }>;
      visibilityType?: "PUBLIC" | "PRIVATE";
      isAllDay: boolean;
      isStartOnly: boolean;
    };

// 予定の取得 https://developer.cybozu.io/hc/ja/articles/360000440583
export const getScheduleEvents = async (
  hostname: string,
  parameters: ScheduleEventsParameters
): Promise<ScheduleEvent[]> => {
  const { rangeStart, rangeEnd, targetType, target } = parameters;
  const url = new URL(`https://${hostname}/g/api/v1/schedule/events`);
  url.searchParams.append("orderBy", "start asc");

  if (rangeStart !== undefined) {
    url.searchParams.append("rangeStart", rangeStart);
  }

  if (rangeEnd !== undefined) {
    url.searchParams.append("rangeEnd", rangeEnd);
  }

  if (targetType !== undefined) {
    url.searchParams.append("targetType", targetType);
  }

  if (target !== undefined) {
    url.searchParams.append("target", target);
  }

  const response = (await fetch(url, {
    method: "GET",
    headers: { "X-Requested-With": "XMLHttpRequest" }
  })
    .then(async (response) => response.json())
    .catch((error) => {
      throw error;
    })) as { events: ScheduleEvent[]; hasNext: boolean };
  return response.events;
};

// カレンダーのイベントを取得する https://developer.cybozu.io/hc/ja/articles/202288574
export const getCalendarEvents = async (hostname: string): Promise<BaseGetCalendarEventType[]> =>
  new GaroonSoap(`https://${hostname}/g/`).base.getCalendarEvents();
