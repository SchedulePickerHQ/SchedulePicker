// 日付は Temporal.PlainDate、予定の時刻は Temporal.ZonedDateTime で扱う。
// 日付に時刻を持たせないことで、日付同士の比較に時刻が紛れ込まないようにする。
// どちらも実行環境の既定タイムゾーン（Chrome では OS の設定）を基準にする。

export const today = (): Temporal.PlainDate => Temporal.Now.plainDateISO();

export const isWeekend = (date: Temporal.PlainDate): boolean =>
	date.dayOfWeek === 6 || date.dayOfWeek === 7;

// Temporal の dayOfWeek は月曜 1 〜日曜 7。_locales の day_of_week_N は
// Date#getDay と同じ日曜 0 〜土曜 6 なので、日曜の 7 だけ 0 に寄せる
export const getDayOfWeek = (date: Temporal.PlainDate) =>
	chrome.i18n.getMessage(`day_of_week_${date.dayOfWeek % 7}`);

const pad2 = (value: number) => String(value).padStart(2, "0");

export const formatDate = (date: Temporal.PlainDate): string =>
	`${date.year}/${pad2(date.month)}/${pad2(date.day)}`;

// ユーザーに見せる日付の標準表記。テンプレートの展開とタイトル描画で共有し、表記の乖離を防ぐ
export const formatDateWithDayOfWeek = (date: Temporal.PlainDate): string =>
	`${formatDate(date)} (${getDayOfWeek(date)})`;

export const formatTime = (time: Temporal.ZonedDateTime): string =>
	`${pad2(time.hour)}:${pad2(time.minute)}`;

/**
 * 日付指定で入力された文字列を日付にする。区切りは / と - を受け付け、月と日は 1 桁でもよい
 * （例: 2025/1/5、2025-01-05）。形式が違うときや、2025/02/30 のように存在しない日付のときは
 * null を返す。
 */
export const parseDateInput = (input: string): Temporal.PlainDate | null => {
	const match = /^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/.exec(input);
	if (match === null) {
		return null;
	}
	try {
		return Temporal.PlainDate.from(
			{
				year: Number(match[1]),
				month: Number(match[2]),
				day: Number(match[3]),
			},
			{ overflow: "reject" },
		);
	} catch {
		return null;
	}
};
