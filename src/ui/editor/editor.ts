import DOMPurify from 'dompurify';
import Quill from 'quill';

const PLACEHOLDER = '[ {%TODAY%}の予定 ]\n{%TODAY_EVENTS%}';

interface Editor {
    getContents: () => string;
    setContents: (text: string) => void;
}

const OPTIONS = {
    debug: false,
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
        getContents: () => normalizeContents(editor.root.innerHTML),
        setContents: (contents: string) => {
            editor.root.innerHTML = DOMPurify.sanitize(contents);
        },
    };
};

const normalizeContents = (contents: string): string =>
    contents.startsWith('<p>') && contents.endsWith('</p>') ? contents : `<p>${contents}</p>`;

export const VisibleForTesting = {
    normalizeContents,
};
