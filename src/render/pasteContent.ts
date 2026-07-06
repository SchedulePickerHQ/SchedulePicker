import { escapeHtml } from "./escapeHtml";
import type { DecorationType } from "./renderer";
import { PlainRenderer } from "./renderers/plain";
import { StyledRenderer } from "./renderers/styled";
import type { Segment } from "./segment";

// 貼り付けに使う2表現。text/plain と text/html の棚にそれぞれ積まれる
export type PasteContent = {
	plainText: string;
	html: string;
};

// 貼り付ける2表現の組み立てをここに集約する。paste は運搬（sanitize と棚積み）に徹する。
//
// 装飾なしでも html を組むのはリッチエディタ対策。リッチエディタは text/html を優先して
// 読み、text/plain しか無いと、プレーンテキストを自前の段落構造へ変換する過程で連続改行を
// 1 つの区切りに正規化してしまい、空行が消える。エスケープ + <br> 変換した HTML なら
// 改行構造を明示でき、見た目はプレーンのまま空行が保持される。
export const buildPasteContent = (
	decoration: DecorationType,
	segments: Segment[],
	hostname: string,
): PasteContent => {
	const plainText = new PlainRenderer().render(segments);
	const html =
		decoration === "styled"
			? new StyledRenderer(hostname).render(segments)
			: escapeHtml(plainText).replaceAll("\n", "<br>");
	return { plainText, html };
};
