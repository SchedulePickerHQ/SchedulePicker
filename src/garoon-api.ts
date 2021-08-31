import GaroonSoap from 'garoon-soap';
import {
    BaseGetCalendarEventType,
    ItemVersionResultType,
    ItemVersionType,
    MyGroupType,
} from 'garoon-soap/dist/type/base';

type Parameters = {
    rangeStart: Date;
    rangeEnd: Date;
    targetType?: 'user' | 'organization' | 'facility';
    target?: string;
};

// スケジュールオブジェクト https://developer.cybozu.io/hc/ja/articles/115005314266
type ScheduleEvent = {
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
    eventType: string;
    eventMenu: string;
    attendees: Array<{
        id: string;
        name: string;
    }>;
    visibilityType: string;
    isAllDay: boolean;
    isStartOnly: boolean;
};

export type MyGroupVersion = ItemVersionResultType;

export type MyGroup = MyGroupType;

export type CalendarEvent = BaseGetCalendarEventType;

const createBaseUrl = (domain: string) => `https://${domain}/g/`;

const createFetchUrl = (domain: string, parameters: Parameters) => {
    const { rangeStart, rangeEnd, targetType, target } = parameters;
    const url = new URL(`${createBaseUrl(domain)}api/v1/schedule/events`);
    url.searchParams.append('orderBy', 'start asc');

    if (rangeStart !== null && rangeStart !== undefined) {
        url.searchParams.append('rangeStart', rangeStart.toISOString());
    }

    if (rangeEnd !== null && rangeEnd !== undefined) {
        url.searchParams.append('rangeEnd', rangeEnd.toISOString());
    }

    if (targetType !== null && targetType !== undefined) {
        url.searchParams.append('targetType', targetType);
    }

    if (target !== null && target !== undefined) {
        url.searchParams.append('target', target);
    }

    return url;
};

// 予定の取得 https://developer.cybozu.io/hc/ja/articles/360000440583
export const getScheduleEvents = async (domain: string, parameters: Parameters) => {
    const url = createFetchUrl(domain, parameters);
    const response = (await fetch(url.toString(), {
        method: 'GET',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
    })
        .then(async (response) => response.json())
        .catch((error) => {
            throw error;
        })) as ScheduleEvent;
    return response;
};

// Myグループの更新情報を取得する https://developer.cybozu.io/hc/ja/articles/202511470
export const getMyGroupVersions = async (domain: string, myGroupItems: ItemVersionType[]): Promise<MyGroupVersion[]> =>
    new GaroonSoap(createBaseUrl(domain)).base.getMyGroupVersions(myGroupItems);

// Myグループを取得する https://developer.cybozu.io/hc/ja/articles/202511470
export const getMyGroupByIds = async (domain: string, myGroupIds: string[]): Promise<MyGroup[]> =>
    new GaroonSoap(createBaseUrl(domain)).base.getMyGroupsById(myGroupIds);

// カレンダーのイベントを取得する https://developer.cybozu.io/hc/ja/articles/202288574
export const getCalendarEvents = async (domain: string): Promise<CalendarEvent[]> =>
    new GaroonSoap(createBaseUrl(domain)).base.getCalendarEvents();
