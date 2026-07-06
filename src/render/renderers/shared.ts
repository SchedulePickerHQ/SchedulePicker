import type { UserEvent } from "../../schedule/events";
import type { DateTime } from "../../utils/datetime";
import { formatDateWithDayOfWeek } from "../../utils/datetime";

// 時間帯やタイトルの「文字列としての内容」はどの表現でも同じ。ここに一本化し、
// 各 Renderer は自分の表現でどう包むか（そのまま・span ラップなど）だけを実装する。

// 終日イベントは時間帯を持たないので null。「終日」をどう描くかは Renderer が決める
export const timeRangeText = (event: UserEvent): string | null => {
	if (event.isAllDay) {
		return null;
	}

	const start = event.isContinuingFromYesterday
		? "--------"
		: event.startTime.format("HH:mm");
	const end = event.isContinuingToTomorrow
		? "--------"
		: event.endTime.format("HH:mm");
	return `${start}-${end}`;
};

export const titleText = (date: DateTime): string =>
	`[ ${chrome.i18n.getMessage("event_title", formatDateWithDayOfWeek(date))} ]`;
