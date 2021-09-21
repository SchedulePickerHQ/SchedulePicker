import { ScheduleEvent } from '../schedule';
import * as GaroonApi from '../api';

export const mockGaroonApiScheduleEvents: GaroonApi.ScheduleEvent[] = [
    {
        'id': '2652948',
        'eventType': 'REGULAR',
        'eventMenu': '',
        'subject': '繰越予定 9/19 終日',
        'isAllDay': false,
        'isStartOnly': false,
        'attendees': [
            {
                'id': '1',
                'name': 'ユーザー1',
            },
        ],
        'start': {
            'dateTime': '2021-09-18T23:00:00+09:00',
            'timeZone': 'Asia/Tokyo',
        },
        'end': {
            'dateTime': '2021-09-20T01:00:00+09:00',
            'timeZone': 'Asia/Tokyo',
        },
        'visibilityType': 'PUBLIC',
    },
    {
        'id': '2652949',
        'eventType': 'REGULAR',
        'eventMenu': '',
        'subject': '繰越予定 9/19 終わり',
        'isAllDay': false,
        'isStartOnly': false,
        'attendees': [
            {
                'id': '1',
                'name': 'ユーザー1',
            },
        ],
        'start': {
            'dateTime': '2021-09-18T23:05:00+09:00',
            'timeZone': 'Asia/Tokyo',
        },
        'end': {
            'dateTime': '2021-09-19T08:00:00+09:00',
            'timeZone': 'Asia/Tokyo',
        },
        'visibilityType': 'PUBLIC',
    },
    {
        'id': '2652940',
        'eventType': 'REGULAR',
        'eventMenu': '休み',
        'subject': '終日予定',
        'isAllDay': true,
        'isStartOnly': false,
        'attendees': [
            {
                'id': '1',
                'name': 'ユーザー1',
            },
        ],
        'start': {
            'dateTime': '2021-09-19T00:00:00+09:00',
            'timeZone': 'Asia/Tokyo',
        },
        'end': {
            'dateTime': '2021-09-19T23:59:59+09:00',
            'timeZone': 'Asia/Tokyo',
        },
        'visibilityType': 'PUBLIC',
    },
    {
        'id': '2652942',
        'eventType': 'REGULAR',
        'eventMenu': 'タスク',
        'subject': '[Skip] スキップされた予定',
        'isAllDay': true,
        'isStartOnly': false,
        'attendees': [
            {
                'id': '1',
                'name': 'ユーザー1',
            },
        ],
        'start': {
            'dateTime': '2021-09-19T00:00:00+09:00',
            'timeZone': 'Asia/Tokyo',
        },
        'end': {
            'dateTime': '2021-09-19T23:59:59+09:00',
            'timeZone': 'Asia/Tokyo',
        },
        'visibilityType': 'PUBLIC',
    },
    {
        'id': '2652943',
        'eventType': 'REGULAR',
        'eventMenu': '',
        'subject': '終日非公開予定',
        'isAllDay': true,
        'isStartOnly': false,
        'attendees': [
            {
                'id': '1',
                'name': 'ユーザー1',
            },
        ],
        'start': {
            'dateTime': '2021-09-19T00:00:00+09:00',
            'timeZone': 'Asia/Tokyo',
        },
        'end': {
            'dateTime': '2021-09-19T23:59:59+09:00',
            'timeZone': 'Asia/Tokyo',
        },
        'visibilityType': 'PRIVATE',
    },
    {
        'id': '2652944',
        'eventType': 'REGULAR',
        'eventMenu': '',
        'subject': '[Skip] スキップされた非公開予定',
        'isAllDay': true,
        'isStartOnly': false,
        'attendees': [
            {
                'id': '1',
                'name': 'ユーザー1',
            },
        ],
        'start': {
            'dateTime': '2021-09-19T00:00:00+09:00',
            'timeZone': 'Asia/Tokyo',
        },
        'end': {
            'dateTime': '2021-09-19T23:59:59+09:00',
            'timeZone': 'Asia/Tokyo',
        },
        'visibilityType': 'PRIVATE',
    },
    {
        'id': '2652936',
        'eventType': 'REGULAR',
        'eventMenu': '',
        'subject': '予定1',
        'isAllDay': false,
        'isStartOnly': false,
        'attendees': [
            {
                'id': '1',
                'name': 'ユーザー1',
            },
        ],
        'start': {
            'dateTime': '2021-09-19T09:00:00+09:00',
            'timeZone': 'Asia/Tokyo',
        },
        'end': {
            'dateTime': '2021-09-19T10:00:00+09:00',
            'timeZone': 'Asia/Tokyo',
        },
        'visibilityType': 'PUBLIC',
    },
    {
        'id': '2652937',
        'eventType': 'REGULAR',
        'eventMenu': '',
        'subject': '予定2',
        'isAllDay': false,
        'isStartOnly': false,
        'attendees': [
            {
                'id': '1',
                'name': 'ユーザー1',
            },
        ],
        'start': {
            'dateTime': '2021-09-19T10:00:00+09:00',
            'timeZone': 'Asia/Tokyo',
        },
        'end': {
            'dateTime': '2021-09-19T10:15:00+09:00',
            'timeZone': 'Asia/Tokyo',
        },
        'visibilityType': 'PUBLIC',
    },
    {
        'id': '2652938',
        'eventType': 'REGULAR',
        'eventMenu': '打合',
        'subject': '予定3',
        'isAllDay': false,
        'isStartOnly': false,
        'attendees': [
            {
                'id': '1',
                'name': 'ユーザー1',
            },
        ],
        'start': {
            'dateTime': '2021-09-19T10:00:00+09:00',
            'timeZone': 'Asia/Tokyo',
        },
        'end': {
            'dateTime': '2021-09-19T10:30:00+09:00',
            'timeZone': 'Asia/Tokyo',
        },
        'visibilityType': 'PUBLIC',
    },
    {
        'id': '2652939',
        'eventType': 'REGULAR',
        'eventMenu': '出張',
        'subject': '予定4（非公開）',
        'isAllDay': false,
        'isStartOnly': false,
        'attendees': [
            {
                'id': '1',
                'name': 'ユーザー1',
            },
        ],
        'start': {
            'dateTime': '2021-09-19T10:00:00+09:00',
            'timeZone': 'Asia/Tokyo',
        },
        'end': {
            'dateTime': '2021-09-19T11:00:00+09:00',
            'timeZone': 'Asia/Tokyo',
        },
        'visibilityType': 'PRIVATE',
    },
    {
        'id': '2652941',
        'eventType': 'REGULAR',
        'eventMenu': '複業',
        'subject': '開始時刻のみ',
        'isAllDay': false,
        'isStartOnly': true,
        'attendees': [
            {
                'id': '1',
                'name': 'ユーザー1',
            },
        ],
        'start': {
            'dateTime': '2021-09-19T11:00:00+09:00',
            'timeZone': 'Asia/Tokyo',
        },
        // 実際は end プロパティが存在しない
        'end': {
            'dateTime': '',
            'timeZone': '',
        },
        'visibilityType': 'PUBLIC',
    },
    {
        'id': '2652947',
        'eventType': 'REGULAR',
        'eventMenu': '勉強会',
        'subject': '繰り返し予定',
        'isAllDay': false,
        'isStartOnly': false,
        'attendees': [
            {
                'id': '1',
                'name': 'ユーザー1',
            },
        ],
        'start': {
            'dateTime': '2021-09-19T14:00:00+09:00',
            'timeZone': 'Asia/Tokyo',
        },
        'end': {
            'dateTime': '2021-09-19T14:45:00+09:00',
            'timeZone': 'Asia/Tokyo',
        },
        'visibilityType': 'PUBLIC',
    },
    {
        'id': '2652950',
        'eventType': 'REGULAR',
        'eventMenu': '往訪',
        'subject': '繰越予定 9/19 始まり',
        'isAllDay': false,
        'isStartOnly': false,
        'attendees': [
            {
                'id': '1',
                'name': 'ユーザー1',
            },
        ],
        'start': {
            'dateTime': '2021-09-19T23:00:00+09:00',
            'timeZone': 'Asia/Tokyo',
        },
        'end': {
            'dateTime': '2021-09-20T03:00:00+09:00',
            'timeZone': 'Asia/Tokyo',
        },
        'visibilityType': 'PUBLIC',
    },
];

export const mockScheduleEvents: ScheduleEvent[] = [
    {
        'id': '2652949',
        'subject': '繰越予定 9/19 終わり',
        'startTime': {
            'year': 2021,
            'month': 9,
            'date': 19,
            'hour': 0,
            'minute': 0,
        },
        'endTime': {
            'year': 2021,
            'month': 9,
            'date': 19,
            'hour': 8,
            'minute': 0,
        },
        'eventType': 'REGULAR',
        'eventMenu': '',
        'attendees': [
            {
                'id': '1',
                'name': 'ユーザー1',
            },
        ],
        'visibilityType': 'PUBLIC',
        'isAllDay': false,
        'isStartOnly': false,
    },
    {
        'id': '2652948',
        'subject': '繰越予定 9/19 終日',
        'startTime': {
            'year': 2021,
            'month': 9,
            'date': 19,
            'hour': 0,
            'minute': 0,
        },
        'endTime': {
            'year': 2021,
            'month': 9,
            'date': 19,
            'hour': 23,
            'minute': 59,
        },
        'eventType': 'REGULAR',
        'eventMenu': '',
        'attendees': [
            {
                'id': '1',
                'name': 'ユーザー1',
            },
        ],
        'visibilityType': 'PUBLIC',
        'isAllDay': false,
        'isStartOnly': false,
    },
    {
        'id': '2652936',
        'subject': '予定1',
        'startTime': {
            'year': 2021,
            'month': 9,
            'date': 19,
            'hour': 9,
            'minute': 0,
        },
        'endTime': {
            'year': 2021,
            'month': 9,
            'date': 19,
            'hour': 10,
            'minute': 0,
        },
        'eventType': 'REGULAR',
        'eventMenu': '',
        'attendees': [
            {
                'id': '1',
                'name': 'ユーザー1',
            },
        ],
        'visibilityType': 'PUBLIC',
        'isAllDay': false,
        'isStartOnly': false,
    },
    {
        'id': '2652939',
        'subject': '非公開予定',
        'startTime': {
            'year': 2021,
            'month': 9,
            'date': 19,
            'hour': 10,
            'minute': 0,
        },
        'endTime': {
            'year': 2021,
            'month': 9,
            'date': 19,
            'hour': 11,
            'minute': 0,
        },
        'eventType': 'REGULAR',
        'eventMenu': '',
        'attendees': [
            {
                'id': '1',
                'name': 'ユーザー1',
            },
        ],
        'visibilityType': 'PRIVATE',
        'isAllDay': false,
        'isStartOnly': false,
    },
    {
        'id': '2652938',
        'subject': '予定3',
        'startTime': {
            'year': 2021,
            'month': 9,
            'date': 19,
            'hour': 10,
            'minute': 0,
        },
        'endTime': {
            'year': 2021,
            'month': 9,
            'date': 19,
            'hour': 10,
            'minute': 30,
        },
        'eventType': 'REGULAR',
        'eventMenu': '打合',
        'attendees': [
            {
                'id': '1',
                'name': 'ユーザー1',
            },
        ],
        'visibilityType': 'PUBLIC',
        'isAllDay': false,
        'isStartOnly': false,
    },
    {
        'id': '2652937',
        'subject': '予定2',
        'startTime': {
            'year': 2021,
            'month': 9,
            'date': 19,
            'hour': 10,
            'minute': 0,
        },
        'endTime': {
            'year': 2021,
            'month': 9,
            'date': 19,
            'hour': 10,
            'minute': 15,
        },
        'eventType': 'REGULAR',
        'eventMenu': '',
        'attendees': [
            {
                'id': '1',
                'name': 'ユーザー1',
            },
        ],
        'visibilityType': 'PUBLIC',
        'isAllDay': false,
        'isStartOnly': false,
    },
    {
        'id': '2652941',
        'subject': '開始時刻のみ',
        'startTime': {
            'year': 2021,
            'month': 9,
            'date': 19,
            'hour': 11,
            'minute': 0,
        },
        'endTime': {
            'year': 2021,
            'month': 9,
            'date': 19,
            'hour': 23,
            'minute': 59,
        },
        'eventType': 'REGULAR',
        'eventMenu': '複業',
        'attendees': [
            {
                'id': '1',
                'name': 'ユーザー1',
            },
        ],
        'visibilityType': 'PUBLIC',
        'isAllDay': false,
        'isStartOnly': true,
    },
    {
        'id': '2652947',
        'subject': '繰り返し予定',
        'startTime': {
            'year': 2021,
            'month': 9,
            'date': 19,
            'hour': 14,
            'minute': 0,
        },
        'endTime': {
            'year': 2021,
            'month': 9,
            'date': 19,
            'hour': 14,
            'minute': 45,
        },
        'eventType': 'REGULAR',
        'eventMenu': '勉強会',
        'attendees': [
            {
                'id': '1',
                'name': 'ユーザー1',
            },
        ],
        'visibilityType': 'PUBLIC',
        'isAllDay': false,
        'isStartOnly': false,
    },
    {
        'id': '2652950',
        'subject': '繰越予定 9/19 始まり',
        'startTime': {
            'year': 2021,
            'month': 9,
            'date': 19,
            'hour': 23,
            'minute': 0,
        },
        'endTime': {
            'year': 2021,
            'month': 9,
            'date': 19,
            'hour': 23,
            'minute': 59,
        },
        'eventType': 'REGULAR',
        'eventMenu': '往訪',
        'attendees': [
            {
                'id': '1',
                'name': 'ユーザー1',
            },
        ],
        'visibilityType': 'PUBLIC',
        'isAllDay': false,
        'isStartOnly': false,
    },
    {
        'id': '2652940',
        'subject': '終日予定',
        'startTime': {
            'year': 2021,
            'month': 9,
            'date': 19,
            'hour': 0,
            'minute': 0,
        },
        'endTime': {
            'year': 2021,
            'month': 9,
            'date': 19,
            'hour': 23,
            'minute': 59,
        },
        'eventType': 'REGULAR',
        'eventMenu': '休み',
        'attendees': [
            {
                'id': '1',
                'name': 'ユーザー1',
            },
        ],
        'visibilityType': 'PUBLIC',
        'isAllDay': true,
        'isStartOnly': false,
    },
    {
        'id': '2652942',
        'subject': '[Skip] スキップされた予定',
        'startTime': {
            'year': 2021,
            'month': 9,
            'date': 19,
            'hour': 0,
            'minute': 0,
        },
        'endTime': {
            'year': 2021,
            'month': 9,
            'date': 19,
            'hour': 23,
            'minute': 59,
        },
        'eventType': 'REGULAR',
        'eventMenu': 'タスク',
        'attendees': [
            {
                'id': '1',
                'name': 'ユーザー1',
            },
        ],
        'visibilityType': 'PUBLIC',
        'isAllDay': true,
        'isStartOnly': false,
    },
    {
        'id': '2652943',
        'subject': '非公開予定',
        'startTime': {
            'year': 2021,
            'month': 9,
            'date': 19,
            'hour': 0,
            'minute': 0,
        },
        'endTime': {
            'year': 2021,
            'month': 9,
            'date': 19,
            'hour': 23,
            'minute': 59,
        },
        'eventType': 'REGULAR',
        'eventMenu': '',
        'attendees': [
            {
                'id': '1',
                'name': 'ユーザー1',
            },
        ],
        'visibilityType': 'PRIVATE',
        'isAllDay': true,
        'isStartOnly': false,
    },
    {
        'id': '2652944',
        'subject': '非公開予定',
        'startTime': {
            'year': 2021,
            'month': 9,
            'date': 19,
            'hour': 0,
            'minute': 0,
        },
        'endTime': {
            'year': 2021,
            'month': 9,
            'date': 19,
            'hour': 23,
            'minute': 59,
        },
        'eventType': 'REGULAR',
        'eventMenu': '',
        'attendees': [
            {
                'id': '1',
                'name': 'ユーザー1',
            },
        ],
        'visibilityType': 'PRIVATE',
        'isAllDay': true,
        'isStartOnly': false,
    },
];
