import DOMPurify from "dompurify";

export const insertTextAtCursorPosition = (text: string) => {
  const targetEl = document.activeElement;

  if (!(targetEl instanceof HTMLElement)) {
    throw new Error("Active element is not an HTMLElement.");
  }

  if (isTextareaElement(targetEl) || isInputElement(targetEl)) {
    const selectionStart = targetEl.selectionStart;
    const selectionEnd = targetEl.selectionEnd;
    const startText = targetEl.value.slice(0, selectionStart);
    const endText = targetEl.value.slice(selectionEnd);
    targetEl.value = startText + text + endText;

    // 挿入文字列の末尾にカーソルを移動させる
    targetEl.focus();
    targetEl.selectionEnd = selectionStart + text.length;

    // textarea に入力される文字列をリアルタイムで状態管理しているようなページだと、
    // 拡張機能側で textarea の value を変更しても change イベントが発火せず、再レンダリングしたときに
    // ページ側で管理している状態で TextArea が上書きされてしまうので、能動的に change イベントを発火させる。
    targetEl.dispatchEvent(new window.Event("change", { bubbles: true }));
  } else if (targetEl.isContentEditable) {
    const selection = document.getSelection();
    const range = selection.getRangeAt(0);
    range.deleteContents();

    const node = document.createElement("span");
    node.style.whiteSpace = "pre";
    node.innerHTML = DOMPurify.sanitize(text);
    range.insertNode(node);

    // 挿入文字列の末尾にカーソルを移動させる
    targetEl.focus();
    selection.collapseToEnd();
  }
};

const isInputElement = (target: Element | null): target is HTMLInputElement => target?.tagName === "INPUT";

const isTextareaElement = (target: Element | null): target is HTMLTextAreaElement => target?.tagName === "TEXTAREA";
