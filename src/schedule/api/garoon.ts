type ScheduleEventsParameters = {
	rangeStart?: string;
	rangeEnd?: string;
	targetType?: "user" | "organization" | "facility";
	target?: string;
};

// スケジュールオブジェクト https://developer.cybozu.io/hc/ja/articles/115005314266
// 予定の終了時刻が登録されていないとき end キーが存在しない
export type ScheduleEvent =
	| {
			id: string;
			subject: string;
			start: {
				dateTime: string;
				timeZone: string;
			};
			end: {
				dateTime: string;
				timeZone: string;
			};
			eventType: "REGULAR" | "REPEATING" | "ALL_DAY" | "TEMPORARY";
			eventMenu: string;
			visibilityType?: "PUBLIC" | "PRIVATE";
			isAllDay: boolean;
			isStartOnly: boolean;
	  }
	| {
			id: string;
			subject: string;
			start: {
				dateTime: string;
				timeZone: string;
			};
			eventType: "REGULAR" | "REPEATING" | "ALL_DAY";
			eventMenu: string;
			attendees: Array<{
				id: string;
				name: string;
			}>;
			visibilityType?: "PUBLIC" | "PRIVATE";
			isAllDay: boolean;
			isStartOnly: boolean;
	  };

// 予定の取得 https://developer.cybozu.io/hc/ja/articles/360000440583
export const getScheduleEvents = async (
	hostname: string,
	parameters: ScheduleEventsParameters,
): Promise<ScheduleEvent[]> => {
	const { rangeStart, rangeEnd } = parameters;
	const url = new URL(`https://${hostname}/g/api/v1/schedule/events`);
	url.searchParams.append("orderBy", "start asc");

	if (rangeStart !== undefined) {
		url.searchParams.append("rangeStart", rangeStart);
	}

	if (rangeEnd !== undefined) {
		url.searchParams.append("rangeEnd", rangeEnd);
	}

	const response = (await fetch(url, {
		method: "GET",
		headers: { "X-Requested-With": "XMLHttpRequest" },
	})
		.then(async (response) => response.json())
		.catch((error) => {
			throw error;
		})) as { events: ScheduleEvent[]; hasNext: boolean };
	return response.events;
};

// カレンダーのイベントを取得する https://developer.cybozu.io/hc/ja/articles/202288574
export type CalendarEvent = {
	date: string;
	type: string;
};

// garoon-soap が使用していた固定値を踏襲
const SOAP_EXPIRES = new Date(Date.UTC(2037, 7, 12, 14, 45, 0)).toISOString();

export const getCalendarEvents = async (
	hostname: string,
): Promise<CalendarEvent[]> => {
	const now = new Date().toISOString();
	const body = `<?xml version="1.0" encoding="UTF-8"?>\
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">\
<soap:Header>\
<Action>BaseGetCalendarEvents</Action>\
<Timestamp><Created>${now}</Created><Expires>${SOAP_EXPIRES}</Expires></Timestamp>\
</soap:Header>\
<soap:Body><BaseGetCalendarEvents><parameters></parameters></BaseGetCalendarEvents></soap:Body>\
</soap:Envelope>`;

	const res = await fetch(`https://${hostname}/g/cbpapi/base/api`, {
		method: "POST",
		headers: { "Content-Type": "text/xml; charset=UTF-8" },
		body,
	});

	if (!res.ok) {
		throw new Error(`HTTP ${res.status}: ${res.statusText}`);
	}

	const xml = await res.text();
	const doc = new DOMParser().parseFromString(xml, "text/xml");

	if (doc.getElementsByTagName("parsererror").length > 0) {
		throw new Error("Invalid XML response");
	}

	return Array.from(doc.getElementsByTagName("calendar_event")).map((node) => ({
		date: node.getAttribute("date") ?? "",
		type: node.getAttribute("type") ?? "",
	}));
};
