export interface BrowserApi {
	hostname: string;
	setCursor(cursor: string): void;
	showError(messageKey: string, ...substitutions: string[]): void;
	getMessage(key: string, ...args: string[]): string;
	prompt(message: string, defaultValue: string): string | null;
}

export function createBrowserApi(): BrowserApi {
	return {
		hostname: location.hostname,
		setCursor(cursor: string) {
			document.body.style.cursor = cursor;
		},
		showError(messageKey: string, ...substitutions: string[]) {
			alert(chrome.i18n.getMessage(messageKey, substitutions));
		},
		getMessage(key: string, ...args: string[]) {
			return chrome.i18n.getMessage(key, args);
		},
		prompt(message: string, defaultValue: string) {
			return window.prompt(message, defaultValue);
		},
	};
}
