import dayjs from "dayjs";
import { describe, expect, it, vi } from "vitest";
import type { UserEvent } from "../schedule/events";
import { buildPasteContent } from "./pasteContent";

vi.stubGlobal("chrome", {
	i18n: {
		getMessage: vi.fn(
			(_key: string, substitution: string) => `${substitution} の予定`,
		),
	},
});

const createEvent = (overrides?: Partial<UserEvent>): UserEvent => ({
	id: "1",
	subject: "朝会",
	startTime: dayjs("2025-01-15 10:00"),
	endTime: dayjs("2025-01-15 11:00"),
	eventType: "REGULAR",
	eventMenu: "",
	isStartOnly: false,
	isAllDay: false,
	isContinuingFromYesterday: false,
	isContinuingToTomorrow: false,
	...overrides,
});

const HOSTNAME = "example.cybozu.com";

describe("buildPasteContent (styled)", () => {
	it("renders text with <br> and events with links", () => {
		const { plainText, html } = buildPasteContent(
			"styled",
			[
				{ type: "text", value: "予定:\n" },
				{ type: "events", events: [createEvent()] },
			],
			HOSTNAME,
		);
		expect(plainText).toBe("予定:\n10:00-11:00 朝会");
		expect(html).toBe(
			`予定:<br><span><span>10:00-11:00</span> <a href="https://${HOSTNAME}/g/schedule/view.csp?event=1">朝会</a></span>`,
		);
	});

	it("escapes user text and event subjects in html", () => {
		const { plainText, html } = buildPasteContent(
			"styled",
			[
				{ type: "text", value: "1 < 2 & 3\n" },
				{ type: "events", events: [createEvent({ subject: "<重要>定例" })] },
			],
			HOSTNAME,
		);
		expect(plainText).toContain("<重要>定例");
		expect(html).toContain("1 &lt; 2 &amp; 3<br>");
		expect(html).toContain("&lt;重要&gt;定例");
	});

	it("joins events with <br> in html and \\n in plainText", () => {
		const { plainText, html } = buildPasteContent(
			"styled",
			[
				{
					type: "events",
					events: [
						createEvent({ id: "1", subject: "A" }),
						createEvent({ id: "2", subject: "B" }),
					],
				},
			],
			HOSTNAME,
		);
		expect(plainText).toBe("10:00-11:00 A\n10:00-11:00 B");
		expect(html.match(/<br>/g)).toHaveLength(1);
	});

	it("renders the title segment", () => {
		const { plainText, html } = buildPasteContent(
			"styled",
			[{ type: "title", date: dayjs("2025-01-15") }],
			HOSTNAME,
		);
		expect(plainText).toMatch(/^\[ 2025\/01\/15 \(.+\) の予定 \]$/);
		expect(html).toMatch(/^<span>\[ 2025\/01\/15 \(.+\) の予定 \]<\/span>$/);
	});
});

describe("buildPasteContent (plain)", () => {
	it("derives html from the plain text with escape and <br>", () => {
		const { plainText, html } = buildPasteContent(
			"plain",
			[
				{ type: "text", value: "1 < 2\n\n" },
				{ type: "events", events: [createEvent({ subject: "A&B定例" })] },
			],
			HOSTNAME,
		);
		expect(plainText).toBe("1 < 2\n\n10:00-11:00 A&B定例");
		expect(html).toBe("1 &lt; 2<br><br>10:00-11:00 A&amp;B定例");
	});

	it("keeps blank lines as consecutive <br> so rich editors preserve them", () => {
		const { html } = buildPasteContent(
			"plain",
			[{ type: "text", value: "a\n\nb" }],
			HOSTNAME,
		);
		expect(html).toBe("a<br><br>b");
	});
});
