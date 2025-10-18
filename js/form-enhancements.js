/**
 * Form Enhancements Script
 * Adds visual feedback, load progress button, and saving indicators to all onboarding forms
 */

export function initializeFormEnhancements(form, formId, currentUserId) {
    if (!form || !formId) {
        console.error('Form or formId not provided to initializeFormEnhancements');
        return;
    }


    // Create saving indicator
    const savingIndicator = document.createElement('div');
    savingIndicator.id = 'saving-indicator';
    savingIndicator.className = 'fixed bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 opacity-0 transition-opacity duration-300 z-50';
    savingIndicator.innerHTML = `
        <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Saving...</span>
    `;
    document.body.appendChild(savingIndicator);

    // Function to show saving indicator
    let savingTimeout;
    function showSavingIndicator() {
        clearTimeout(savingTimeout);
        savingIndicator.style.opacity = '1';
        savingTimeout = setTimeout(() => {
            savingIndicator.style.opacity = '0';
        }, 1500);
    }

    // Function to load saved progress
    function loadSavedProgress() {
        if (!currentUserId) {
            alert('Please log in to load your saved progress.');
            return;
        }

        const savedData = localStorage.getItem(`${formId}_${currentUserId}`);
        if (!savedData) {
            alert('No saved progress found.');
            return;
        }

        try {
            const data = JSON.parse(savedData);
            let fieldsLoaded = 0;

            // Set a flag to prevent progress updates during loading
            window.isLoadingFormProgress = true;

            for (const key in data) {
                const element = form.elements[key];
                if (element) {
                    if (element.type === 'checkbox') {
                        element.checked = Array.isArray(data[key]) ? data[key].length > 0 : !!data[key];
                        if (element.checked) fieldsLoaded++;
                    } else if (element.length && element[0]?.type === 'checkbox') {
                        const values = Array.isArray(data[key]) ? data[key] : [];
                        Array.from(element).forEach(cb => {
                            cb.checked = values.includes(cb.value);
                        });
                        if (values.length > 0) fieldsLoaded++;
                    } else if (element.length && element[0]?.type === 'radio') {
                        Array.from(element).forEach(radio => {
                            if (radio.value === data[key]) {
                                radio.checked = true;
                                fieldsLoaded++;
                            }
                        });
                    } else if (element.value !== undefined) {
                        element.value = data[key];
                        if (data[key]) fieldsLoaded++;
                    }
                }
            }

            // Clear the loading flag and trigger progress update if available
            setTimeout(() => {
                window.isLoadingFormProgress = false;
                // Trigger progress update using the standardized ProgressBarManager
                if (typeof window.updateProgress === 'function') {
                    window.updateProgress();
                }
            }, 100);

            // Show success message
            const successMsg = document.createElement('div');
            successMsg.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
            successMsg.textContent = `✓ Loaded ${fieldsLoaded} saved fields`;
            document.body.appendChild(successMsg);
            setTimeout(() => successMsg.remove(), 3000);

            console.log(`Form progress loaded: ${fieldsLoaded} fields restored.`);
        } catch (error) {
            console.error('Error loading saved progress:', error);
            alert('Error loading saved progress. Please try again.');
        }
    }


    // Return the showSavingIndicator function so forms can use it
    return {
        showSavingIndicator,
    };
}
