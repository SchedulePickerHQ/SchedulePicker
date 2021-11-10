// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./browser.d.ts" />

export const isFirefox = (): boolean => typeof InstallTrigger !== 'undefined';
