export const isButtonElement = (target: Element | null): target is HTMLButtonElement => target?.tagName === 'BUTTON';

export const isInputElement = (target: Element | null): target is HTMLInputElement => target?.tagName === 'INPUT';

export const isTextareaElement = (target: Element | null): target is HTMLTextAreaElement =>
    target?.tagName === 'TEXTAREA';
