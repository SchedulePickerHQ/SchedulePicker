import browser from 'webextension-polyfill';
import { CommandMessage, COMMAND_ID } from './commands/sender';
import { assertExists } from './utils/asserts';
import { insertTextAtCaret } from './utils/insert-text';
import { LOADING_STATUS, showLoading } from './utils/loading';

browser.runtime.onMessage.addListener((commandMessage: CommandMessage) => {
    switch (commandMessage.id) {
        case COMMAND_ID.LOADING:
            showLoading(commandMessage.message === LOADING_STATUS.SHOW);
            break;
        case COMMAND_ID.INSERT_TEXT:
            assertExists(document.activeElement);
            insertTextAtCaret(window, document.activeElement as HTMLElement | null, commandMessage.message);
            break;
        case COMMAND_ID.ERROR:
            alert('SchedulePicker: ' + commandMessage.message);
            break;
        default:
            throw new Error('Not found command message id');
    }
});
