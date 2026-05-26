import dayjs from "dayjs";
import { describe, expect, it, vi } from "vitest";
import type { BrowserApi } from "../../utils/browser";
import { ScheduleCommand } from "./scheduleCommand";
import type { ScheduleDeps } from "./types";

function createMockBrowserApi(): BrowserApi {
	return {
		hostname: "example.cybozu.com",
		setCursor: vi.fn(),
		showError: vi.fn(),
		getMessage: vi.fn().mockReturnValue(""),
		prompt: vi.fn().mockReturnValue(null),
	};
}

function createMockDeps(overrides?: Partial<ScheduleDeps>): ScheduleDeps {
	const mockFormatter = {
		createTitle: vi.fn().mockReturnValue("[Title]"),
		createEvents: vi.fn().mockReturnValue("event1\nevent2"),
		getNewLine: vi.fn().mockReturnValue("\n"),
	};
	return {
		env: createMockBrowserApi(),
		resolveDate: () => dayjs("2025-01-15"),
		loadPeriodEventSetting: vi.fn().mockResolvedValue(false),
		loadSyntaxSetting: vi.fn().mockResolvedValue("html"),
		createFormatter: vi.fn().mockReturnValue(mockFormatter),
		getUserEvents: vi.fn().mockResolvedValue([]),
		insertText: vi.fn(),
		...overrides,
	};
}

describe("ScheduleCommand", () => {
	it("fetches events for the resolved date", async () => {
		const deps = createMockDeps();
		await new ScheduleCommand(deps).execute();
		expect(deps.getUserEvents).toHaveBeenCalledWith(
			"example.cybozu.com",
			expect.objectContaining({ periodEventIncluded: false }),
		);
	});

	it("uses the resolved date for start/end of day", async () => {
		const deps = createMockDeps({ resolveDate: () => dayjs("2025-06-01") });
		await new ScheduleCommand(deps).execute();
		const query = vi.mocked(deps.getUserEvents).mock.calls[0][1];
		expect(query.startTime.format("YYYY-MM-DD")).toBe("2025-06-01");
		expect(query.endTime.format("YYYY-MM-DD")).toBe("2025-06-01");
	});

	it("formats output with title + newline + events", async () => {
		const deps = createMockDeps();
		await new ScheduleCommand(deps).execute();
		expect(deps.insertText).toHaveBeenCalledWith("[Title]\nevent1\nevent2");
	});

	it("sets cursor to progress then auto", async () => {
		const deps = createMockDeps();
		await new ScheduleCommand(deps).execute();
		expect(deps.env.setCursor).toHaveBeenCalledWith("progress");
		expect(deps.env.setCursor).toHaveBeenCalledWith("auto");
	});

	it("shows error on failure", async () => {
		const deps = createMockDeps({
			getUserEvents: vi.fn().mockRejectedValue(new Error("fail")),
		});
		await new ScheduleCommand(deps).execute();
		expect(deps.env.showError).toHaveBeenCalledWith("error_get_events");
	});

	it("resets cursor even on error", async () => {
		const deps = createMockDeps({
			getUserEvents: vi.fn().mockRejectedValue(new Error("fail")),
		});
		await new ScheduleCommand(deps).execute();
		const calls = vi.mocked(deps.env.setCursor).mock.calls;
		expect(calls[calls.length - 1]).toEqual(["auto"]);
	});

	it("passes periodEventIncluded setting", async () => {
		const deps = createMockDeps({
			loadPeriodEventSetting: vi.fn().mockResolvedValue(true),
		});
		await new ScheduleCommand(deps).execute();
		expect(deps.getUserEvents).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({ periodEventIncluded: true }),
		);
	});

	it("uses syntax setting for formatter", async () => {
		const deps = createMockDeps({
			loadSyntaxSetting: vi.fn().mockResolvedValue("markdown"),
		});
		await new ScheduleCommand(deps).execute();
		expect(deps.createFormatter).toHaveBeenCalledWith("markdown");
	});

	it("works with async date resolvers", async () => {
		const deps = createMockDeps({
			resolveDate: async () => dayjs("2025-12-25"),
		});
		await new ScheduleCommand(deps).execute();
		const query = vi.mocked(deps.getUserEvents).mock.calls[0][1];
		expect(query.startTime.format("YYYY-MM-DD")).toBe("2025-12-25");
	});
});
