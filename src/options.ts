import { buildContextMenu } from './contextMenus/context-menus';
import {
    getContextMenuDisplayed,
    getSyntax,
    getTemplateText,
    getToUseMyGroup,
    setContextMenuDisplayed,
    setSyntax,
    setTemplateText,
    setToUseMyGroup,
} from './storage/storage';
import { createEditor } from './ui/editor/editor';
import { assert } from './utils/asserts';
import { isButtonElement, isDivElement, isInputElement } from './utils/type-check';

window.addEventListener('DOMContentLoaded', async () => {
    const saveButton = document.querySelector('.save-button');
    const todayInput = document.querySelector('#today');
    const tomorrowInput = document.querySelector('#tomorrow');
    const yesterdayInput = document.querySelector('#yesterday');
    const nextBusinessDayInput = document.querySelector('#next-business-day');
    const previousBusinessDayInput = document.querySelector('#previous-business-day');
    const specifiedDayInput = document.querySelector('#specified-day');
    const templateInput = document.querySelector('#template');
    const syntaxInput = document.querySelector('#syntax');
    const htmlInput = document.querySelector('#html');
    const markdownInput = document.querySelector('#markdown');
    const useMyGroupInput = document.querySelector('#use-my-group');
    const templateEl = document.querySelector('.template-setting__editor');
    assert(isButtonElement(saveButton));
    assert(isInputElement(todayInput));
    assert(isInputElement(tomorrowInput));
    assert(isInputElement(yesterdayInput));
    assert(isInputElement(nextBusinessDayInput));
    assert(isInputElement(previousBusinessDayInput));
    assert(isInputElement(specifiedDayInput));
    assert(isInputElement(templateInput));
    assert(isInputElement(syntaxInput));
    assert(isInputElement(htmlInput));
    assert(isInputElement(markdownInput));
    assert(isInputElement(useMyGroupInput));
    assert(isDivElement(templateEl));
    const templateEditor = createEditor(templateEl);

    const syncContextMenuDisplayed = async () => {
        const display = await getContextMenuDisplayed();
        todayInput.checked = display.today;
        tomorrowInput.checked = display.tomorrow;
        yesterdayInput.checked = display.yesterday;
        nextBusinessDayInput.checked = display.nextBusinessDay;
        previousBusinessDayInput.checked = display.previousBusinessDay;
        specifiedDayInput.checked = display.specifiedDay;
        templateInput.checked = display.template;
        syntaxInput.checked = display.syntax;
    };

    const syncSyntax = async () => {
        const syntax = await getSyntax();
        htmlInput.checked = syntax === 'html';
        markdownInput.checked = syntax === 'markdown';
    };

    const saveContextMenuDisplayed = async () => {
        await setContextMenuDisplayed({
            today: todayInput.checked,
            tomorrow: tomorrowInput.checked,
            yesterday: yesterdayInput.checked,
            nextBusinessDay: nextBusinessDayInput.checked,
            previousBusinessDay: previousBusinessDayInput.checked,
            specifiedDay: specifiedDayInput.checked,
            template: templateInput.checked,
            syntax: syntaxInput.checked,
        });
    };

    const handleSaveButtonClick = async () => {
        saveButton.disabled = true;
        saveButton.classList.add('saving');
        await saveContextMenuDisplayed();
        await setSyntax(htmlInput.checked ? 'html' : 'markdown');
        await setToUseMyGroup(useMyGroupInput.checked);
        await setTemplateText(templateEditor.getContents());
        await buildContextMenu();

        setTimeout(() => {
            saveButton.classList.remove('saving');
            saveButton.disabled = false;
        }, 2000);
    };

    await syncContextMenuDisplayed();
    await syncSyntax();
    useMyGroupInput.checked = await getToUseMyGroup();
    const templateText = await getTemplateText();
    templateEditor.setContents(templateText);
    saveButton.addEventListener('click', handleSaveButtonClick);
});
