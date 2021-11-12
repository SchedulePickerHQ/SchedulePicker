import DOMPurify from 'dompurify';
import Quill from 'quill';
import { assertExists } from '../../utils/asserts';
import { TemplatePlaceholder, TEMPLATE_PLACEHOLDER } from '../../utils/__test__/template-placeholder';

const PLACEHOLDER = `${TEMPLATE_PLACEHOLDER.TODAY}の予定\n${TEMPLATE_PLACEHOLDER.TODAY_EVENTS}`;

interface Editor {
    getContents: () => string;
    setContents: (text: string) => void;
}

const options = {
    debug: false,
    placeholder: PLACEHOLDER,
    theme: 'snow',
    modules: {
        toolbar: {
            container: [
                [{ 'placeholder': Object.values(TEMPLATE_PLACEHOLDER) }],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }, 'link', 'clean'],
            ],
            handlers: {
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                'placeholder': () => {}, // handlers に登録しておかないと addHandler で追加した関数が実行されない
            },
        },
    },
    formats: ['background', 'bold', 'color', 'italic', 'link', 'strike', 'underline', 'header'],
};

export const createEditor = (el: HTMLElement): Editor => {
    const quill = new Quill(el, options);
    // setupBlock();
    setupCustomPicker(quill);

    return {
        getContents: () => quill.root.innerHTML,
        setContents: (contents: string) => {
            quill.root.innerHTML = DOMPurify.sanitize(contents);
        },
    };
};

const setupCustomPicker = (quill: Quill) => {
    const placeholderLabel = document.querySelector('.ql-placeholder .ql-picker-label');
    placeholderLabel?.setAttribute('data-name', 'Placeholder');

    const placeholderOptions = Array.from(document.querySelectorAll('.ql-placeholder .ql-picker-item'));
    for (const option of placeholderOptions) {
        const dataValue = option.getAttribute('data-value');
        assertExists(dataValue);
        option?.setAttribute('data-name', dataValue);
    }

    // QuillのToolbarの型が不明
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    quill.getModule('toolbar').addHandler('placeholder', (value: TemplatePlaceholder) => {
        const cursorPosition = quill.getSelection()?.index;
        if (cursorPosition !== undefined) {
            quill.insertText(cursorPosition, value);
            quill.setSelection(cursorPosition, value.length);
        }
    });
};
