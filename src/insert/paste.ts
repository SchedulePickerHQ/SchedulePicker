import DOMPurify from "dompurify";
import type { PasteContent } from "../render/pasteContent";

export class PasteError extends Error {
	name = "PasteError";
}

// 組み立て済みの2表現を貼り付け先へ運ぶ。表現の組み立ては buildPasteContent の責務で、
// ここでは変換しない。
//
// 本物のクリップボードは text/plain と text/html など複数の表現を同時に保持し、
// どれを読むかは貼り付け先が選ぶ（同じコピーでもメモ帳に貼るとプレーン、Word に貼ると
// 装飾付きになるのはこの仕組み）。ここでも DataTransfer に両方を積んで同じ挙動を再現する。
export const paste = (content: PasteContent) => {
	const targetEl = document.activeElement;

	if (!(targetEl instanceof HTMLElement)) {
		throw new PasteError();
	}

	// text/html に積むものは経路を問わず必ず sanitize を通す
	const html = DOMPurify.sanitize(content.html);
	const dataTransfer = new DataTransfer();
	// text/plain も常に積む。textarea や、text/plain しか読まない貼り付けハンドラの
	// ページでは text/html が読まれないため。
	dataTransfer.setData("text/plain", content.plainText);
	dataTransfer.setData("text/html", html);
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

	// ClipboardEvent が処理されなかった場合のフォールバック。
	// 貼り付け先の種類に応じてどちらの表現を挿入するか選ぶ。
	if (isTextareaElement(targetEl) || isInputElement(targetEl)) {
		const { plainText } = content;
		const selectionStart = targetEl.selectionStart ?? targetEl.value.length;
		const selectionEnd = targetEl.selectionEnd ?? selectionStart;
		const startText = targetEl.value.slice(0, selectionStart);
		const endText = targetEl.value.slice(selectionEnd);
		targetEl.value = startText + plainText + endText;

		targetEl.focus();
		const cursorPos = selectionStart + plainText.length;
		targetEl.selectionStart = cursorPos;
		targetEl.selectionEnd = cursorPos;

		// textarea に入力される文字列をリアルタイムで状態管理しているようなページだと、
		// 拡張機能側で textarea の value を変更しても change イベントが発火せず、再レンダリングしたときに
		// ページ側で管理している状態で TextArea が上書きされてしまうので、能動的に change イベントを発火させる。
		targetEl.dispatchEvent(new window.Event("change", { bubbles: true }));
	} else if (targetEl.isContentEditable) {
		const selection = document.getSelection();
		if (selection === null) {
			return;
		}
		const range = selection.getRangeAt(0);
		range.deleteContents();

		const node = document.createElement("span");
		node.innerHTML = html;
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
