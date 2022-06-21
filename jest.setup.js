import messages from './static/_locales/ja/messages.json';

jest.mock('webextension-polyfill', () => {
    return {
        i18n: {
            getMessage: (key) => messages[key].message,
        },
    };
});
