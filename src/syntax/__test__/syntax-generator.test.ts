import { ScheduleEvent } from '../../garoon/schedule';
import { d_2021_09_18 } from '../../utils/__test__/mock-datetime';
import { SyntaxGeneratorFactory } from '../syntax-generator-factory';

const domain = 'domain';
const htmlSyntaxGenerator = new SyntaxGeneratorFactory().create('html');
const markdownSyntaxGenerator = new SyntaxGeneratorFactory().create('markdown');

const mockRegularEvent: ScheduleEvent = {
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
};

const mockRegularEventWithEventMenu: ScheduleEvent = {
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
};

const mockAllDayEvent: ScheduleEvent = {
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
};

const mockAllDayEventWithEventMenu: ScheduleEvent = {
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
};

// TODO: 余力があったらテストを実装する
// const mockMyGroupRegularEvent = {};

// const mockMyGroupEventWithEventMenu = {};

// const mockMyGroupAllDayEvent = {};

// const mockMyGroupAllDayEventWithEventMenu = {};

describe('createTitle', () => {
    test('html', () => {
        expect(htmlSyntaxGenerator.createTitle(d_2021_09_18)).toBe('<span>[ 2021-09-18 の予定 ]</span>');
    });

    test('markdown', () => {
        expect(markdownSyntaxGenerator.createTitle(d_2021_09_18)).toBe('[ 2021-09-18 の予定 ]');
    });
});

describe('createEvents', () => {
    test.each([
        [
            mockRegularEvent,
            `<span><span>09:00-10:00</span> <a href="https://${domain}/g/schedule/view.csp?event=2652936">予定1</a></span>`,
        ],
        [
            mockRegularEventWithEventMenu,
            `<span><span>10:00-10:30</span> <span style="background-color: #3182dc; display: inline-block; margin-right: 3px; padding: 2px 2px 1px; color: rgb(255, 255, 255); font-size: 11.628px; border-radius: 2px; line-height: 1.1;">打合</span> <a href="https://${domain}/g/schedule/view.csp?event=2652938">予定3</a></span>`,
        ],
        [
            mockAllDayEvent,
            `<span><span style="background-color: #9acd32; display: inline-block; margin-right: 3px; padding: 2px 2px 1px; color: rgb(255, 255, 255); font-size: 11.628px; border-radius: 2px; line-height: 1.1;">終日</span> <a href="https://${domain}/g/schedule/view.csp?event=2652943">非公開予定</a></span>`,
        ],
        [
            mockAllDayEventWithEventMenu,
            `<span><span style="background-color: #9acd32; display: inline-block; margin-right: 3px; padding: 2px 2px 1px; color: rgb(255, 255, 255); font-size: 11.628px; border-radius: 2px; line-height: 1.1;">終日</span> <span style="background-color: #f44848; display: inline-block; margin-right: 3px; padding: 2px 2px 1px; color: rgb(255, 255, 255); font-size: 11.628px; border-radius: 2px; line-height: 1.1;">休み</span> <a href="https://${domain}/g/schedule/view.csp?event=2652940">終日予定</a></span>`,
        ],
    ])('html', (event, expected) => {
        expect(htmlSyntaxGenerator.createEvents(domain, [event])).toBe(expected);
    });

    test.each([
        [mockRegularEvent, `09:00-10:00 [予定1](https://${domain}/g/schedule/view.csp?event=2652936)`],
        [
            mockRegularEventWithEventMenu,
            `10:00-10:30 <span style="color: #3182dc;">[打合]</span> [予定3](https://${domain}/g/schedule/view.csp?event=2652938)`,
        ],
        [
            mockAllDayEvent,
            `<span style="color: #9acd32;">[終日]</span> [非公開予定](https://${domain}/g/schedule/view.csp?event=2652943)`,
        ],
        [
            mockAllDayEventWithEventMenu,
            `<span style="color: #9acd32;">[終日]</span> <span style="color: #f44848;">[休み]</span> [終日予定](https://${domain}/g/schedule/view.csp?event=2652940)`,
        ],
    ])('markdown', (event, expected) => {
        expect(markdownSyntaxGenerator.createEvents(domain, [event])).toBe(expected);
    });
});
