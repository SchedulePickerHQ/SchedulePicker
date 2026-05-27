import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("../utils/datetime", async (importOriginal) => {
	const actual = await importOriginal<typeof import("../utils/datetime")>();
	return {
		...actual,
		dateTime: vi.fn((...args: Parameters<typeof actual.dateTime>) => {
			if (args.length === 0) return mockToday;
			return actual.dateTime(...args);
		}),
	};
});

vi.mock("./api/garoon", () => ({
	getCalendarEvents: vi.fn().mockResolvedValue([]),
}));

import { getCalendarEvents } from "./api/garoon";
import { getNextBusinessDay, getPreviousBusinessDay } from "./businessDay";

const HOSTNAME = "example.cybozu.com";

let mockToday: Dayjs;

afterEach(() => {
	vi.clearAllMocks();
});

describe("getNextBusinessDay", () => {
	it("水曜日 → 翌営業日は木曜日", async () => {
		mockToday = dayjs("2025-01-15"); // 水
		const result = await getNextBusinessDay(HOSTNAME);
		expect(result.format("YYYY-MM-DD")).toBe("2025-01-16"); // 木
	});

	it("金曜日 → 翌営業日は月曜日（土日スキップ）", async () => {
		mockToday = dayjs("2025-01-17"); // 金
		const result = await getNextBusinessDay(HOSTNAME);
		expect(result.format("YYYY-MM-DD")).toBe("2025-01-20"); // 月
	});

	it("土曜日 → 翌営業日は月曜日", async () => {
		mockToday = dayjs("2025-01-18"); // 土
		const result = await getNextBusinessDay(HOSTNAME);
		expect(result.format("YYYY-MM-DD")).toBe("2025-01-20"); // 月
	});

	it("日曜日 → 翌営業日は月曜日", async () => {
		mockToday = dayjs("2025-01-19"); // 日
		const result = await getNextBusinessDay(HOSTNAME);
		expect(result.format("YYYY-MM-DD")).toBe("2025-01-20"); // 月
	});

	it("金曜日 + 月曜が祝日 → 翌営業日は火曜日", async () => {
		mockToday = dayjs("2025-01-10"); // 金
		vi.mocked(getCalendarEvents).mockResolvedValueOnce([
			{ type: "public_holiday", date: "2025-01-13" },
		]);
		const result = await getNextBusinessDay(HOSTNAME);
		expect(result.format("YYYY-MM-DD")).toBe("2025-01-14"); // 火
	});
});

describe("getPreviousBusinessDay", () => {
	it("水曜日 → 前営業日は火曜日", async () => {
		mockToday = dayjs("2025-01-15"); // 水
		const result = await getPreviousBusinessDay(HOSTNAME);
		expect(result.format("YYYY-MM-DD")).toBe("2025-01-14"); // 火
	});

	it("月曜日 → 前営業日は金曜日（土日スキップ）", async () => {
		mockToday = dayjs("2025-01-20"); // 月
		const result = await getPreviousBusinessDay(HOSTNAME);
		expect(result.format("YYYY-MM-DD")).toBe("2025-01-17"); // 金
	});

	it("日曜日 → 前営業日は金曜日", async () => {
		mockToday = dayjs("2025-01-19"); // 日
		const result = await getPreviousBusinessDay(HOSTNAME);
		expect(result.format("YYYY-MM-DD")).toBe("2025-01-17"); // 金
	});

	it("土曜日 → 前営業日は金曜日", async () => {
		mockToday = dayjs("2025-01-18"); // 土
		const result = await getPreviousBusinessDay(HOSTNAME);
		expect(result.format("YYYY-MM-DD")).toBe("2025-01-17"); // 金
	});

	it("月曜日 + 金曜が祝日 → 前営業日は木曜日", async () => {
		mockToday = dayjs("2025-01-20"); // 月
		vi.mocked(getCalendarEvents).mockResolvedValueOnce([
			{ type: "public_holiday", date: "2025-01-17" },
		]);
		const result = await getPreviousBusinessDay(HOSTNAME);
		expect(result.format("YYYY-MM-DD")).toBe("2025-01-16"); // 木
	});
});
