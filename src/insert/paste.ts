import DOMPurify from "dompurify";

export class PasteError extends Error {
	name = "PasteError";
}

// プレーンテキストを HTML のテキストノードとして忠実に表現するためのエスケープ。
// セキュリティ目的ではない（それは sanitize が担う）。要素の中身にしか使わないので
// 属性値用の " ' のエスケープは不要。& を最初に変換しないと二重エスケープになる。
const escapeHtml = (text: string) =>
	text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

// 本物のクリップボードと同様に text/plain と text/html の両方を積み、
// どちらを読むかは貼り付け先に選ばせる。styledHtml を省略すると装飾なし扱いで、
// text/html にもプレーン版（エスケープ + <br> 変換）を積む。
export const paste = (plainText: string, styledHtml?: string) => {
	const targetEl = document.activeElement;

	if (!(targetEl instanceof HTMLElement)) {
		throw new PasteError();
	}

	// text/html に積むものは経路を問わず必ず sanitize を通す
	const html = DOMPurify.sanitize(
		styledHtml ?? escapeHtml(plainText).replaceAll("\n", "<br>"),
	);
	const dataTransfer = new DataTransfer();
	dataTransfer.setData("text/plain", plainText);
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
