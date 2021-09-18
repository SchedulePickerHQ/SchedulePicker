import { buildContextMenu } from './contextMenus/context-menus';
import { getContextMenuDisplayed, getSyntax, setContextMenuDisplayed, setSyntax } from './storage/storage';
import { assert } from './utils/asserts';
import { isButtonElement, isInputElement } from './utils/element-type-check';

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

    const syncSyntax = async () => {
        const syntax = await getSyntax();
        htmlInput.checked = syntax === 'html';
        markdownInput.checked = syntax === 'markdown';
    };

    const saveSyntax = async () => {
        const syntax = htmlInput.checked ? 'html' : 'markdown';
        await setSyntax(syntax);
    };

    const handleSaveButtonClick = async () => {
        saveButton.disabled = true;
        saveButton.classList.add('saving');
        await saveContextMenuDisplayed();
        await saveSyntax();
        await buildContextMenu();

        setTimeout(() => {
            saveButton.classList.remove('saving');
            saveButton.disabled = false;
        }, 3000);
    };

    await syncContextMenuDisplayed();
    await syncSyntax();
    saveButton.addEventListener('click', handleSaveButtonClick);
});
