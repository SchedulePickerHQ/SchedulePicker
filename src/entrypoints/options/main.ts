import { buildContextMenu } from "../../menu/builder";
import {
	loadContextMenuDisplaySettings,
	loadPeriodEventIncludedSetting,
	loadSyntaxSetting,
	loadTemplateText,
	saveContextMenuDisplaySettings,
	savePeriodEventIncludedSetting,
	saveSyntaxSetting,
	saveTemplateText,
} from "../../utils/storage";

function $<T extends HTMLElement>(selector: string): T {
	const el = document.querySelector<T>(selector);
	if (!el) throw new Error(`Element not found: ${selector}`);
	return el;
}

const checkbox = (name: string): HTMLInputElement =>
	$(`input[type="checkbox"][name="${name}"]`);

const radio = (value: string): HTMLInputElement =>
	$(`input[type="radio"][value="${value}"]`);

function applyI18n() {
	for (const el of document.querySelectorAll("[data-i18n]")) {
		const key = el.getAttribute("data-i18n");
		if (key) el.textContent = chrome.i18n.getMessage(key);
	}
	for (const el of document.querySelectorAll("[data-i18n-placeholder]")) {
		const key = el.getAttribute("data-i18n-placeholder");
		if (key)
			(el as HTMLElement).setAttribute(
				"placeholder",
				chrome.i18n.getMessage(key),
			);
	}
	for (const el of document.querySelectorAll("[data-i18n-href]")) {
		const key = el.getAttribute("data-i18n-href");
		if (key)
			(el as HTMLElement).setAttribute("href", chrome.i18n.getMessage(key));
	}
	const main = document.querySelector("main");
	if (main) main.lang = chrome.i18n.getMessage("option_lang");
}

async function loadSettings() {
	$<HTMLTextAreaElement>("#template-text").value = await loadTemplateText();

	const display = await loadContextMenuDisplaySettings();
	checkbox("today").checked = display.today;
	checkbox("tomorrow").checked = display.tomorrow;
	checkbox("yesterday").checked = display.yesterday;
	checkbox("nextBusinessDay").checked = display.nextBusinessDay;
	checkbox("previousBusinessDay").checked = display.previousBusinessDay;
	checkbox("specifiedDay").checked = display.specifiedDay;
	checkbox("template").checked = display.template;
	checkbox("syntax").checked = display.syntax;

	radio(await loadSyntaxSetting()).checked = true;

	checkbox("periodEventIncluded").checked =
		await loadPeriodEventIncludedSetting();
}

async function saveSettings() {
	await saveTemplateText($<HTMLTextAreaElement>("#template-text").value);
	await saveContextMenuDisplaySettings({
		today: checkbox("today").checked,
		tomorrow: checkbox("tomorrow").checked,
		yesterday: checkbox("yesterday").checked,
		nextBusinessDay: checkbox("nextBusinessDay").checked,
		previousBusinessDay: checkbox("previousBusinessDay").checked,
		specifiedDay: checkbox("specifiedDay").checked,
		template: checkbox("template").checked,
		syntax: checkbox("syntax").checked,
	});

	const selectedSyntax = $<HTMLInputElement>(
		'input[name="syntax-setting"]:checked',
	);
	await saveSyntaxSetting(
		selectedSyntax.value as "html" | "markdown" | "plainText",
	);

	await savePeriodEventIncludedSetting(checkbox("periodEventIncluded").checked);

	await buildContextMenu();
}

async function init() {
	applyI18n();
	await loadSettings();

	let saved = false;
	const button = $("#save-button");
	button.addEventListener("click", async () => {
		if (saved) return;
		saved = true;

		try {
			await saveSettings();
			button.textContent = "( ¯꒳¯)b✧︎";
			setTimeout(() => {
				button.textContent = chrome.i18n.getMessage("option_save_button_text");
				saved = false;
			}, 500);
		} catch (e) {
			console.error(e);
			saved = false;
		}
	});
}

init().catch(console.error);
