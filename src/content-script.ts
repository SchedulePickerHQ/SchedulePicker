import DOMPurify from 'dompurify';
import browser from 'webextension-polyfill';
import { CommandMessage, COMMAND_ID } from './commands/sender';
import { assertExists } from './utils/asserts';
import { isInputElement, isTextareaElement } from './utils/element-type-check';
import { LOADING_STATUS, showLoading } from './utils/loading';

browser.runtime.onMessage.addListener((commandMessage: CommandMessage) => {
    switch (commandMessage.id) {
        case COMMAND_ID.LOADING:
            showLoading(commandMessage.message === LOADING_STATUS.SHOW);
            break;
        case COMMAND_ID.INSERT_TEXT:
            assertExists(document.activeElement);
            insertTextAtCaret(document.activeElement as HTMLElement | null, commandMessage.message);
            break;
        default:
            throw new Error('Not found command message id');
    }
});

const insertTextAtCaret = (target: HTMLElement | null, text: string) => {
    assertExists(target);

    if (isTextareaElement(target) || isInputElement(target)) {
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
        node.innerHTML = DOMPurify.sanitize(text);
        range.insertNode(node);

        // カーソルを末尾に移動させる。
        target.focus();
        selection.collapseToEnd();
    }
};
