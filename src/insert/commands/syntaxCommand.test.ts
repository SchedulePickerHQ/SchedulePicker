import { describe, expect, it, vi } from "vitest";
import { SyntaxCommand } from "./syntaxCommand";
import type { SyntaxDeps } from "./types";

function createMockDeps(): SyntaxDeps {
	return {
		saveSyntaxSetting: vi.fn().mockResolvedValue(undefined),
		sendBuildContextMenu: vi.fn().mockResolvedValue(undefined),
	};
}

describe("SyntaxCommand", () => {
	it("saves the specified syntax setting", async () => {
		const deps = createMockDeps();
		const command = new SyntaxCommand("markdown", deps);
		await command.execute();
		expect(deps.saveSyntaxSetting).toHaveBeenCalledWith("markdown");
	});

	it("sends build context menu after saving", async () => {
		const deps = createMockDeps();
		const command = new SyntaxCommand("html", deps);
		await command.execute();
		expect(deps.sendBuildContextMenu).toHaveBeenCalled();
	});

	it("calls save before rebuild", async () => {
		const order: string[] = [];
		const deps: SyntaxDeps = {
			saveSyntaxSetting: vi.fn().mockImplementation(async () => {
				order.push("save");
			}),
			sendBuildContextMenu: vi.fn().mockImplementation(async () => {
				order.push("rebuild");
			}),
		};
		const command = new SyntaxCommand("plainText", deps);
		await command.execute();
		expect(order).toEqual(["save", "rebuild"]);
	});
});
