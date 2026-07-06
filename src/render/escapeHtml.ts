// プレーンテキストを HTML のテキストノードとして忠実に表現するためのエスケープ。
// セキュリティ目的ではない（それは paste の sanitize が担う）。要素の中身にしか使わないので
// 属性値用の " ' のエスケープは不要。& を最初に変換しないと二重エスケープになる。
export const escapeHtml = (text: string) =>
	text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
