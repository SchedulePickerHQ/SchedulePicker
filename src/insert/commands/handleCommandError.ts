import { GetEventsError } from "../../schedule/events";
import type { BrowserApi } from "../../utils/browser";
import { PasteError } from "../paste";

export const handleCommandError = (e: unknown, env: BrowserApi) => {
	console.error(e);
	if (e instanceof PasteError) {
		env.showError("error_paste_failed");
	} else if (e instanceof GetEventsError) {
		env.showError("error_get_events");
	} else {
		env.showError("error_unknown");
	}
};
