import browser from 'webextension-polyfill';

type Syntax = 'html' | 'markdown';

type StorageInitValue = {
    SYNTAX: Syntax;
    TEMPLATE_TEXT: string;
};

const STORAGE_KEY = {
    SYNTAX: 'syntax',
    TEMPLATE_TEXT: 'templateText',
} as const;

const STORAGE_INIT_VALUE: StorageInitValue = {
    SYNTAX: 'html',
    TEMPLATE_TEXT: '', // TODO: 利用者が理解しやすい初期値を考える
};

export const setSyntax = async (syntax: Syntax) => {
    await browser.storage.sync.set({ [STORAGE_KEY.SYNTAX]: syntax });
};

export const getSyntax = async (): Promise<Syntax> => {
    const item = await browser.storage.sync.get(STORAGE_KEY.SYNTAX);

    if (Object.keys(item).length === 0) {
        return STORAGE_INIT_VALUE.SYNTAX;
    }

    return item[STORAGE_KEY.SYNTAX] as Syntax;
};
