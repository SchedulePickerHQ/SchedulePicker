import browser from 'webextension-polyfill';
import { CommandMessage, COMMAND_ID } from './commands/sender';
import { InsertionFactory } from './ui/insertion/insertion-factory';
import { LOADING_STATUS, showLoading } from './ui/loading/loading';
import { assertExists } from './utils/asserts';
import { isSupportBrowser } from './utils/support-browser';

browser.runtime.onMessage.addListener((commandMessage: CommandMessage) => {
    switch (commandMessage.id) {
        case COMMAND_ID.LOADING: {
            showLoading(commandMessage.message === LOADING_STATUS.SHOW);
            break;
        }

        case COMMAND_ID.INSERT_TEXT: {
            assertExists(document.activeElement);
            const browserEnv = process.env.BROWSER_ENV;

            if (isSupportBrowser(browserEnv)) {
                const insertion = new InsertionFactory().create(browserEnv);
                insertion.insertTextAtCaret(
                    window,
                    document.activeElement as HTMLElement | null,
                    commandMessage.message,
                );
            } else {
                throw new Error('Unsupported browser.');
            }

            break;
        }

        case COMMAND_ID.ERROR: {
            alert('SchedulePicker: ' + commandMessage.message);
            break;
        }

        default: {
            throw new Error('Not found command message id');
        }
    }
});
