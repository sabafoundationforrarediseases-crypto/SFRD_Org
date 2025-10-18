/**
 * Common Form Logic for SFRD Onboarding Forms
 * 
 * This file contains shared functions for real-time validation, user feedback,
 * and other enhancements to be applied across all onboarding forms.
 */

// --- VALIDATION HELPERS ---

/**
 * Validates an email address format.
 * @param {string} email
 * @returns {boolean}
 */
const isValidEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

/**
 * Validates a phone number (simple check for at least 10 digits).
 * @param {string} phone
 * @returns {boolean}
 */
const isValidPhone = (phone) => {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10;
};

/**
 * Shows a validation error message for a given field.
 * @param {HTMLInputElement} inputElement The input element.
 * @param {string} message The error message to display.
 */
const showValidationError = (inputElement, message) => {
    let errorElement = inputElement.parentNode.querySelector('.validation-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'validation-error';
        errorElement.setAttribute('aria-live', 'polite');
        const errorId = `error-for-${inputElement.id}`;
        errorElement.id = errorId;
        inputElement.setAttribute('aria-describedby', errorId);
        inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);
    }
    errorElement.textContent = message;
    inputElement.classList.add('is-invalid');
};

/**
 * Clears a validation error message for a given field.
 * @param {HTMLInputElement} inputElement The input element.
 */
const clearValidationError = (inputElement) => {
    let errorElement = inputElement.parentNode.querySelector('.validation-error');
    if (errorElement) {
        errorElement.textContent = '';
    }
    inputElement.classList.remove('is-invalid');
    inputElement.removeAttribute('aria-describedby');
};


// --- UI/UX ENHANCEMENTS ---

/**
 * Updates the file input label to show the number of selected files.
 * @param {HTMLInputElement} fileInput The file input element.
 * @param {HTMLElement} nameDisplayElement The element to display the file count.
 */
const updateFileInputLabel = (fileInput, nameDisplayElement) => {
    if (fileInput.files.length > 0) {
        nameDisplayElement.textContent = `${fileInput.files.length} file(s) selected`;
        nameDisplayElement.style.display = 'block';
    } else {
        nameDisplayElement.textContent = '';
        nameDisplayElement.style.display = 'none';
    }
};

/**
 * Sets the state of the submit button during form processing.
 * @param {HTMLButtonElement} button The submit button.
 * @param {boolean} isProcessing True if the form is processing.
 * @param {string} text The text to display on the button.
 */
const setSubmitButtonState = (button, isProcessing, text = 'Submit') => {
    button.disabled = isProcessing;
    button.textContent = isProcessing ? text : 'Submit Partnership Form'; // Adjust default text as needed
};
