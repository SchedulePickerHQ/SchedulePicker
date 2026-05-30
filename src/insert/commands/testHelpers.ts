import dayjs from "dayjs";
import { vi } from "vitest";
import type { Formatter } from "../../syntax/formatter";
import type { BrowserApi } from "../../utils/browser";
import type { ScheduleDeps, TemplateDeps } from "./types";

export function createMockBrowserApi(
	overrides?: Partial<BrowserApi>,
): BrowserApi {
	return {
		hostname: "example.cybozu.com",
		setCursor: vi.fn(),
		showError: vi.fn(),
		getMessage: vi.fn().mockReturnValue(""),
		prompt: vi.fn().mockReturnValue(null),
		...overrides,
	};
}

function createMockFormatter(): Formatter {
	return {
		createTitle: vi.fn().mockReturnValue("[Title]"),
		createEvents: vi.fn().mockReturnValue("event1\nevent2"),
		getNewLine: vi.fn().mockReturnValue("\n"),
	};
}

export function createMockScheduleDeps(
	overrides?: Partial<ScheduleDeps>,
): ScheduleDeps {
	return {
		env: createMockBrowserApi(),
		resolveDate: () => dayjs("2025-01-15"),
		loadPeriodEventSetting: vi.fn().mockResolvedValue(false),
		loadDecorationSetting: vi.fn().mockResolvedValue("styled"),
		createFormatter: vi.fn().mockReturnValue(createMockFormatter()),
		getUserEvents: vi.fn().mockResolvedValue([]),
		paste: vi.fn(),
		...overrides,
	};
}

export function createMockTemplateDeps(
	overrides?: Partial<TemplateDeps>,
): TemplateDeps {
	return {
		env: createMockBrowserApi(),
		loadTemplateText: vi.fn().mockResolvedValue(""),
		loadPeriodEventSetting: vi.fn().mockResolvedValue(false),
		loadDecorationSetting: vi.fn().mockResolvedValue("styled"),
		createFormatter: vi.fn().mockReturnValue(createMockFormatter()),
		getUserEvents: vi.fn().mockResolvedValue([]),
		paste: vi.fn(),
		getNextBusinessDay: vi.fn().mockResolvedValue(dayjs("2025-01-16")),
		getPreviousBusinessDay: vi.fn().mockResolvedValue(dayjs("2025-01-14")),
		getDayOfWeek: vi.fn().mockReturnValue("Mon"),
		...overrides,
	};
}
