import browser from 'webextension-polyfill';

browser.runtime.onMessage.addListener((message: string) => {
    console.log(message);
});
