import { isButtonElement, isInputElement, isTextareaElement } from '../element-type-check';

const buttonEl = document.createElement('button');
const textareaEl = document.createElement('textarea');
const inputEl = document.createElement('input');

describe('isButtonElement', () => {
    test('Button element', () => {
        expect(isButtonElement(buttonEl)).toBe(true);
    });

    test('Not button element', () => {
        expect(isButtonElement(inputEl)).toBe(false);
    });
});

describe('isInputElement', () => {
    test('Input element', () => {
        expect(isInputElement(inputEl)).toBe(true);
    });

    test('Not input element', () => {
        expect(isInputElement(buttonEl)).toBe(false);
    });
});

describe('isTextareaElement', () => {
    test('Textarea element', () => {
        expect(isTextareaElement(textareaEl)).toBe(true);
    });

    test('Not Textarea element', () => {
        expect(isTextareaElement(inputEl)).toBe(false);
    });
});
