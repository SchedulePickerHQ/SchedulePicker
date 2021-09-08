import browser, { Menus, Tabs } from 'webextension-polyfill';
import { LoadingStatus } from '../utils/loading';

export const ACTION_MESSAGE_ID = {
    LOADING: 'Loading',
    SCHEDULE_EVENTS: 'ScheduleEvents',
} as const;

export type ActionMessage = {
    id: TypeOfValues<typeof ACTION_MESSAGE_ID>;
    message: string;
};

export interface Action {
    execute(info: browser.Menus.OnClickData, tab: browser.Tabs.Tab): void;
}

export abstract class AbstractAction implements Action {
    protected async postLoadingStatus(tabId: number, status: LoadingStatus) {
        await browser.tabs.sendMessage(tabId, {
            id: ACTION_MESSAGE_ID.LOADING,
            message: status,
        });
    }

    protected async postScheduleEvents(tabId: number, events: string) {
        await browser.tabs.sendMessage(tabId, {
            id: ACTION_MESSAGE_ID.SCHEDULE_EVENTS,
            message: events,
        });
    }

    abstract execute(info: Menus.OnClickData, tab: Tabs.Tab): void;
}
