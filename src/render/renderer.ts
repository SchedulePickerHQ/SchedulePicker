import type { Segment } from "./segment";

export type DecorationType = "styled" | "plain";

// 文書（Segment 列）を1つの表現に描画する。ある部品をこの表現でどう埋め込むか
// （エスケープ・改行・装飾）という知識はすべて Renderer の実装に集約する
export interface Renderer {
	render(segments: Segment[]): string;
}
