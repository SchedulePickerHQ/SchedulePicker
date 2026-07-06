// プレーンテキストを HTML のテキストノードとして忠実に表現するためのエスケープ。
// セキュリティ目的ではない（それは paste の sanitize が担う）。要素の中身にしか使わないので
// 属性値用の " ' のエスケープは不要。& を最初に変換しないと二重エスケープになる。
export const escapeHtml = (text: string) =>
	text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

// プレーンテキストを HTML へ忠実に持ち上げる規則はここに一本化する。
// 生テキストをそのまま HTML に載せると < や & が構文として解釈され、
// \n はただの空白に潰れる。文字として・改行として明示的に表現する
export const textToHtml = (text: string) =>
	escapeHtml(text).replaceAll("\n", "<br>");
