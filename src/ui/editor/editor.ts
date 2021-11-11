import Quill from 'quill';

const PLACEHOLDER = '[ {%TODAY%}の予定 ]\n{%TODAY_EVENTS%}';

interface Editor {
    getText: () => string;
}

const OPTIONS = {
    debug: 'info',
    placeholder: PLACEHOLDER,
    theme: 'snow',
    modules: {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }, 'blockquote', 'code-block'],
            ['link', { 'align': [] }, 'clean'],
        ],
    },
    formats: [
        'background',
        'bold',
        'color',
        'italic',
        'link',
        'strike',
        'underline',
        'blockquote',
        'header',
        'align',
        'code-block',
    ],
};

export const createEditor = (el: HTMLElement): Editor => {
    const editor = new Quill(el, OPTIONS);
    return {
        getText: editor.getText,
    };
};
