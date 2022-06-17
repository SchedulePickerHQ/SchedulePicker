import { isSupportBrowser } from '../support-browser';

describe('isSupportBrowser', () => {
    test.each([
        { browser: 'chrome', support: true },
        { browser: 'firefox', support: true },
        { browser: 'opera', support: false },
        { browser: 'ie', support: false },
    ])('Supported browser', ({ browser, support }) => {
        expect(isSupportBrowser(browser)).toBe(support);
    });
});
