import { VisibleForTesting } from '../api';

describe('createFetchUrl', () => {
    const { createFetchUrl } = VisibleForTesting;
    const domain = 'hogehoge';

    test('no parameters', () => {
        expect(createFetchUrl(domain, {})).toBe('https://hogehoge/g/api/v1/schedule/events?orderBy=start+asc');
    });

    test('rangeStart', () => {
        expect(createFetchUrl(domain, { rangeStart: '2021-09-04T13:17:52.384Z' })).toBe(
            'https://hogehoge/g/api/v1/schedule/events?orderBy=start+asc&rangeStart=2021-09-04T13%3A17%3A52.384Z',
        );
    });

    test('rangeEnd', () => {
        expect(createFetchUrl(domain, { rangeEnd: '2021-09-05T13:17:52.384Z' })).toBe(
            'https://hogehoge/g/api/v1/schedule/events?orderBy=start+asc&rangeEnd=2021-09-05T13%3A17%3A52.384Z',
        );
    });

    test('rangeStart, rangeEnd, targetType, target', () => {
        expect(
            createFetchUrl(domain, {
                rangeStart: '2021-09-04T13:17:52.384Z',
                rangeEnd: '2021-09-05T13:17:52.384Z',
                targetType: 'user',
                target: '1',
            }),
        ).toBe(
            'https://hogehoge/g/api/v1/schedule/events?orderBy=start+asc&rangeStart=2021-09-04T13%3A17%3A52.384Z&rangeEnd=2021-09-05T13%3A17%3A52.384Z&targetType=user&target=1',
        );
    });
});
