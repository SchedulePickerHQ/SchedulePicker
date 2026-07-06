import type { UserEvent } from "../schedule/events";
import type { DateTime } from "../utils/datetime";

// 貼り付ける文書を構成する部品。コマンドは文字列ではなくこのデータ列を組み立て、
// 表現（プレーン / 装飾）ごとの描画は Renderer に任せる。
// text はテンプレート本文などの生テキストで、改行は \n に正規化されている前提。
export type Segment =
	| { type: "text"; value: string }
	| { type: "title"; date: DateTime }
	| { type: "events"; events: UserEvent[] };
