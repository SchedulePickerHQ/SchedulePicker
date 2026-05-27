import type { SyntaxType } from "../../insert/commands/types";
import { buildContextMenu } from "../../menu/builder";
import {
	loadContextMenuDisplaySettings,
	loadPeriodEventSetting,
	loadSyntaxSetting,
	loadTemplateText,
	saveContextMenuDisplaySettings,
	savePeriodEventSetting,
	saveSyntaxSetting,
	saveTemplateText,
} from "../../utils/storage";

function querySelector<T extends HTMLElement>(selector: string): T {
	const el = document.querySelector<T>(selector);
	if (!el) throw new Error(`Element not found: ${selector}`);
	return el;
}

const checkbox = (name: string): HTMLInputElement =>
	querySelector(`input[type="checkbox"][name="${name}"]`);

const radio = (value: string): HTMLInputElement =>
	querySelector(`input[type="radio"][value="${value}"]`);

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
	querySelector<HTMLTextAreaElement>("#template-text").value =
		await loadTemplateText();

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

	checkbox("periodEventIncluded").checked = await loadPeriodEventSetting();
}

async function saveSettings() {
	await saveTemplateText(
		querySelector<HTMLTextAreaElement>("#template-text").value,
	);
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

	const selectedSyntax = querySelector<HTMLInputElement>(
		'input[name="syntax-setting"]:checked',
	);
	await saveSyntaxSetting(selectedSyntax.value as SyntaxType);

	await savePeriodEventSetting(checkbox("periodEventIncluded").checked);

	await buildContextMenu();
}

async function initSettingsPage() {
	applyI18n();
	await loadSettings();

	let saved = false;
	const saveButton = querySelector("#save-button");
	saveButton.addEventListener("click", async () => {
		if (saved) return;
		saved = true;

		try {
			await saveSettings();
			saveButton.textContent = "✓";
			setTimeout(() => {
				saveButton.textContent = chrome.i18n.getMessage(
					"option_save_button_text",
				);
				saved = false;
			}, 500);
		} catch (e) {
			console.error(e);
			saved = false;
		}
	});
}

initSettingsPage().catch(console.error);
