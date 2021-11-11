import Quill from 'quill';

const PLACEHOLDER = '[ {%TODAY%}の予定 ]\n{%TODAY_EVENTS%}';

interface Editor {
    getText: () => string;
}

const OPTIONS = {
    debug: 'info',
    placeholder: PLACEHOLDER,
    theme: 'snow',
} as const;

export const createEditor = (el: HTMLElement): Editor => {
    const editor = new Quill(el, OPTIONS);
    return {
        getText: editor.getText,
    };
};
