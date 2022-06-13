import browser from 'webextension-polyfill';
import { CommandFactory } from './command/command-factory';
import { MESSAGE_CONTEXT, ToContentMessage } from './send-message/to-content';
import { assert } from './util/assert';
import { isString } from './util/type-check';
import { clearUUID } from './util/uuid';

browser.runtime.onMessage.addListener((message: ToContentMessage, _) => {
    if (message.context === MESSAGE_CONTEXT.CONTEXT_MENU_CLICKED) {
        const { tab, info } = message;
        if (tab?.id === undefined && tab?.url === undefined) {
            return;
        }

        assert(isString(info.menuItemId));
        const command = new CommandFactory().create({ id: clearUUID(info.menuItemId), info, tab });
        command.execute();
    }
});
