import DOMPurify from "dompurify";
import type { SyntaxType } from "./commands/types";

export class PasteError extends Error {
	name = "PasteError";
}

export const paste = (text: string, syntax: SyntaxType) => {
	const targetEl = document.activeElement;

	if (!(targetEl instanceof HTMLElement)) {
		throw new PasteError();
	}

	const sanitized = DOMPurify.sanitize(text);
	const mimeType = syntax === "plainText" ? "text/plain" : "text/html";
	const dataTransfer = new DataTransfer();
	dataTransfer.setData(mimeType, sanitized);
	const handled = !targetEl.dispatchEvent(
		new ClipboardEvent("paste", {
			clipboardData: dataTransfer,
			// イベントが親要素に伝播するようにする。true にしないとエディタがイベントを拾えない場合がある。
			bubbles: true,
			// preventDefault() でキャンセル可能にする。実際のペーストイベントと同じ挙動にするため true。
			cancelable: true,
		}),
	);

	if (handled) {
		return;
	}

	// ClipboardEvent が処理されなかった場合のフォールバック
	if (isTextareaElement(targetEl) || isInputElement(targetEl)) {
		const selectionStart = targetEl.selectionStart ?? targetEl.value.length;
		const selectionEnd = targetEl.selectionEnd ?? selectionStart;
		const startText = targetEl.value.slice(0, selectionStart);
		const endText = targetEl.value.slice(selectionEnd);
		targetEl.value = startText + text + endText;

		targetEl.focus();
		const cursorPos = selectionStart + text.length;
		targetEl.selectionStart = cursorPos;
		targetEl.selectionEnd = cursorPos;

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
		node.innerHTML = sanitized;
		range.insertNode(node);

		targetEl.focus();
		selection.collapseToEnd();
	}
};

const isInputElement = (target: Element | null): target is HTMLInputElement =>
	target?.tagName === "INPUT";

const isTextareaElement = (
	target: Element | null,
): target is HTMLTextAreaElement => target?.tagName === "TEXTAREA";
