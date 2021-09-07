import browser, { Menus, Tabs } from 'webextension-polyfill';
import { LoadingStatus } from '../utils/loading';

export const ACTION_MESSAGE = {
    LOADING: 'Loading',
    SCHEDULE_EVENTS: 'ScheduleEvents',
} as const;

export type ActionMessage = {
    id: TypeOfValues<typeof ACTION_MESSAGE>;
    tabId: number;
    message: string;
};

export interface Action {
    execute(info: browser.Menus.OnClickData, tab: browser.Tabs.Tab): void;
}

export abstract class AbstractAction implements Action {
    protected async sendLoadingStatus(tabId: number, status: LoadingStatus) {
        await browser.tabs.sendMessage(tabId, {
            id: ACTION_MESSAGE.LOADING,
            tabId,
            status,
        });
    }

    protected async sendScheduleEvents(tabId: number, events: string) {
        await browser.tabs.sendMessage(tabId, {
            id: ACTION_MESSAGE.SCHEDULE_EVENTS,
            tabId,
            events,
        });
    }

    abstract execute(info: Menus.OnClickData, tab: Tabs.Tab): void;
}
