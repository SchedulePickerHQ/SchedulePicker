import browser from 'webextension-polyfill';
import { ActionMessage, ACTION_MESSAGE_ID } from './actions/abstract-action';
import { LOADING_STATUS, showLoading } from './utils/loading';

browser.runtime.onMessage.addListener((actionMessage: ActionMessage) => {
    switch (actionMessage.id) {
        case ACTION_MESSAGE_ID.LOADING:
            showLoading(actionMessage.message === LOADING_STATUS.SHOW);
            break;
        case ACTION_MESSAGE_ID.SCHEDULE_EVENTS:
            // TODO: execCommand は廃止されるので別の方法を考える
            document.execCommand('insertText', false, actionMessage.message);
            break;
        default:
            throw new Error('Not found action message id');
    }
});
