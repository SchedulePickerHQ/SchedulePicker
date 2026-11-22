const pad2 = (value: number) => String(value).padStart(2, "0");

// _locales の day_of_week_N の番号は、Temporal の dayOfWeek（月曜 1 〜日曜 7）に合わせてある
const getDayOfWeek = (date: Temporal.PlainDate) =>
	chrome.i18n.getMessage(`day_of_week_${date.dayOfWeek}`);

// toLocaleString を使わないのは、表記がブラウザや OS の言語設定で変わりうるため
export const formatDate = (date: Temporal.PlainDate): string =>
	`${date.year}/${pad2(date.month)}/${pad2(date.day)}`;

// ユーザーに見せる日付の標準表記。テンプレートの展開とタイトル描画で共有し、表記の乖離を防ぐ
export const formatDateWithDayOfWeek = (date: Temporal.PlainDate): string =>
	`${formatDate(date)} (${getDayOfWeek(date)})`;

export const formatTime = (time: Temporal.ZonedDateTime): string =>
	`${pad2(time.hour)}:${pad2(time.minute)}`;
