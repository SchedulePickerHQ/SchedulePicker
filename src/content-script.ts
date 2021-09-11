import browser from 'webextension-polyfill';
import { ActionMessage, ACTION_MESSAGE_ID } from './actions/base/abstract-action';
import { assertExists } from './utils/asserts';
import { LOADING_STATUS, showLoading } from './utils/loading';

browser.runtime.onMessage.addListener((actionMessage: ActionMessage) => {
    switch (actionMessage.id) {
        case ACTION_MESSAGE_ID.LOADING:
            showLoading(actionMessage.message === LOADING_STATUS.SHOW);
            break;
        case ACTION_MESSAGE_ID.SCHEDULE_EVENTS:
            assertExists(document.activeElement);
            insertTextAtCaret(document.activeElement as HTMLElement, actionMessage.message);
            break;
        default:
            throw new Error('Not found action message id');
    }
});

const isTextAreaOrInputEl = (target: HTMLElement): target is HTMLInputElement | HTMLTextAreaElement =>
    target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

const insertTextAtCaret = (target: HTMLElement, text: string) => {
    if (isTextAreaOrInputEl(target)) {
        const selectionStart = target.selectionStart;
        const selectionEnd = target.selectionEnd;
        assertExists(selectionStart);
        assertExists(selectionEnd);
        const startText = target.value.slice(0, selectionStart);
        const endText = target.value.slice(selectionEnd);
        target.value = startText + text + endText;

        // textarea に入力される文字列をリアルタイムで状態管理しているようなページだと、
        // 拡張機能側で textarea の value を変更しても change イベントが発火せず、再レンダリングしたときに
        // ページ側で管理している状態で TextArea が上書きされてしまうので、能動的に change イベントを発火させる。
        target.dispatchEvent(new window.Event('change', { bubbles: true }));
    } else if (target.isContentEditable) {
        const selection = document.getSelection();
        assertExists(selection);
        const range = selection.getRangeAt(0);
        range.deleteContents();

        const node = document.createElement('div');
        node.style.whiteSpace = 'pre';
        node.innerHTML = text;
        range.insertNode(node);

        // カーソルを末尾に移動させる。
        target.focus();
        selection.collapseToEnd();
    }
};
