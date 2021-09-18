import { isButtonElement } from './utils/element-type-check';

window.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.querySelector('.save-button');

    if (!isButtonElement(saveButton)) {
        throw new Error('Not button element');
    }

    saveButton.addEventListener('click', () => {
        saveButton.disabled = true;
        saveButton.classList.add('saving');

        setTimeout(() => {
            saveButton.classList.remove('saving');
            saveButton.disabled = false;
        }, 3000);
    });
});
