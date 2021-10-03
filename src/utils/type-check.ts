export const isButtonElement = (target: Element | null): target is HTMLButtonElement => target?.tagName === 'BUTTON';

export const isInputElement = (target: Element | null): target is HTMLInputElement => target?.tagName === 'INPUT';

export const isTextareaElement = (target: Element | null): target is HTMLTextAreaElement =>
    target?.tagName === 'TEXTAREA';

export const isIframeElement = (target: HTMLElement): target is HTMLIFrameElement => target.tagName === 'IFRAME';

export const isString = (value: unknown): value is string => typeof value === 'string';
