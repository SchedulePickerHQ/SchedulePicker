import { setContextMenuDisplayed } from './storage/storage';
import { assert } from './utils/asserts';
import { isButtonElement, isInputElement } from './utils/element-type-check';

window.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.querySelector('.save-button');
    assert(isButtonElement(saveButton));

    saveButton.addEventListener('click', async () => {
        saveButton.disabled = true;
        saveButton.classList.add('saving');
        await saveContextMenuDisplayed();

        setTimeout(() => {
            saveButton.classList.remove('saving');
            saveButton.disabled = false;
        }, 3000);
    });
});

const saveContextMenuDisplayed = async () => {
    const todayInput = document.querySelector('#today');
    const tomorrowInput = document.querySelector('#tomorrow');
    const yesterdayInput = document.querySelector('#yesterday');
    const nextBusinessDayInput = document.querySelector('#next-business-day');
    const previousBusinessDayInput = document.querySelector('#previous-business-day');
    const specifiedDayInput = document.querySelector('#specified-day');
    const templateInput = document.querySelector('#template');
    const syntaxInput = document.querySelector('#syntax');

    assert(isInputElement(todayInput));
    assert(isInputElement(tomorrowInput));
    assert(isInputElement(yesterdayInput));
    assert(isInputElement(nextBusinessDayInput));
    assert(isInputElement(previousBusinessDayInput));
    assert(isInputElement(specifiedDayInput));
    assert(isInputElement(templateInput));
    assert(isInputElement(syntaxInput));

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
