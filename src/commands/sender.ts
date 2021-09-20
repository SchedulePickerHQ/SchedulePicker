import browser from 'webextension-polyfill';
import { LoadingStatus } from '../utils/loading';

export const COMMAND_ID = {
    LOADING: 'Loading',
    INSERT_TEXT: 'InsertText',
    ERROR: 'Error',
} as const;

export type CommandMessage = {
    id: TypeOfValues<typeof COMMAND_ID>;
    message: string;
};

export const sendLoadingStatus = async (tabId: number, status: LoadingStatus) => {
    await browser.tabs.sendMessage(tabId, {
        id: COMMAND_ID.LOADING,
        message: status,
    });
};

export const sendSchedule = async (tabId: number, schedule: string) => {
    await browser.tabs.sendMessage(tabId, {
        id: COMMAND_ID.INSERT_TEXT,
        message: schedule,
    });
};

export const sendErrorMessage = async (tabId: number, message: string) => {
    await browser.tabs.sendMessage(tabId, {
        id: COMMAND_ID.ERROR,
        message,
    });
};
