import browser from 'webextension-polyfill';
import { LoadingStatus } from '../utils/loading';

export const COMMAND_MESSAGE_ID = {
    LOADING: 'Loading',
    SCHEDULE: 'Schedule',
} as const;

export type CommandMessage = {
    id: TypeOfValues<typeof COMMAND_MESSAGE_ID>;
    message: string;
};

export const sendLoadingStatus = async (tabId: number, status: LoadingStatus) => {
    await browser.tabs.sendMessage(tabId, {
        id: COMMAND_MESSAGE_ID.LOADING,
        message: status,
    });
};

export const sendSchedule = async (tabId: number, schedule: string) => {
    await browser.tabs.sendMessage(tabId, {
        id: COMMAND_MESSAGE_ID.SCHEDULE,
        message: schedule,
    });
};
