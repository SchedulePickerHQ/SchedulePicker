export type SupportBrowser = 'chrome' | 'firefox';

export const isSupportBrowser = (unknown: unknown): unknown is SupportBrowser =>
    unknown === 'chrome' || unknown === 'firefox';
