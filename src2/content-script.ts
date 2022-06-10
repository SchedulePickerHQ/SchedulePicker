import browser from 'webextension-polyfill';
import { ContextMenuMessage } from './content/message';

browser.runtime.onMessage.addListener((message: ContextMenuMessage, _) => {
    console.dir(message);
});
