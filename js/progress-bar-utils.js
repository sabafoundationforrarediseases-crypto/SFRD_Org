/**
 * Progress Bar Utilities
 * Standardized progress bar functionality for all onboarding forms
 * Prevents re-rendering issues and provides consistent behavior
 */

export class ProgressBarManager {
    constructor(form, progressBarId = 'progressBar', progressTextId = 'progressText', useCoordinator = true) {
        this.form = form;
        this.progressBar = document.getElementById(progressBarId);
        this.progressText = document.getElementById(progressTextId);
        this.isUpdating = false;
        this.updateTimeout = null;
        this.lastPercentage = 0;
        this.useCoordinator = useCoordinator;

        // Bind methods to preserve context
        this.updateProgress = this.updateProgress.bind(this);
        this.updateProgressDirect = this.updateProgressDirect.bind(this);
        this.debouncedUpdate = this.debouncedUpdate.bind(this);

        // Make updateProgress available globally for form-enhancements.js
        window.updateProgress = this.updateProgress;

        if (!this.progressBar || !this.progressText) {
            console.warn('Progress bar elements not found');
            return;
        }

        // Initialize progress bar to 0% to prevent flickering
        this.progressBar.style.width = '0%';
        this.progressText.textContent = '0% Complete';

        // Only initialize event listeners if NOT using coordinator
        if (!this.useCoordinator) {
            this.initializeEventListeners();
        }
        
        console.log('ProgressBarManager initialized (coordinator mode:', this.useCoordinator, ')');
    }
    
    /**
     * Calculate progress based on filled form fields
     */
    calculateProgress() {
        if (!this.form) return 0;
        
        const allInputs = this.form.querySelectorAll('input, select, textarea');
        const relevantInputs = Array.from(allInputs).filter(el => 
            el.name && 
            !el.readOnly && 
            el.type !== 'hidden' && 
            el.type !== 'submit' && 
            el.type !== 'button' &&
            !el.name.startsWith('bearer') &&
            !el.name.startsWith('docCheck') &&
            !el.name.startsWith('onboardingDate') &&
            !el.name.startsWith('staffResponsible')
        );
        
        const totalFields = relevantInputs.length;
        if (totalFields === 0) return 0;
        
        let filledFields = 0;
        const countedGroups = {};
        
        relevantInputs.forEach(input => {
            if (input.type === 'radio' || input.type === 'checkbox') {
                // For radio/checkbox groups, count the group only once
                if (countedGroups[input.name]) return;
                
                const group = this.form.querySelectorAll(`input[name="${input.name}"]`);
                if (Array.from(group).some(i => i.checked)) {
                    filledFields++;
                    countedGroups[input.name] = true;
                }
            } else if (input.value && input.value.trim() !== '') {
                filledFields++;
            }
        });
        
        return Math.round((filledFields / totalFields) * 100);
    }
    
    /**
     * Update the progress bar display
     */
    updateProgress() {
        // Prevent multiple simultaneous updates
        if (this.isUpdating) {
            console.log('Progress update already in progress, skipping');
            return;
        }
        
        // Skip updates during form loading
        if (window.isLoadingFormProgress) {
            console.log('Form loading in progress, skipping progress update');
            return;
        }
        
        this.isUpdating = true;
        
        try {
            const percentage = this.calculateProgress();
            
            // Only update if percentage has changed to prevent unnecessary re-renders
            if (percentage !== this.lastPercentage) {
                if (this.progressBar && this.progressText) {
                    this.progressBar.style.width = `${percentage}%`;
                    this.progressText.textContent = `${percentage}% Complete`;
                    this.lastPercentage = percentage;
                    console.log(`Progress updated: ${percentage}%`);
                } else {
                    console.error('Progress bar elements not found');
                }
            }
        } catch (error) {
            console.error('Error updating progress:', error);
        } finally {
            this.isUpdating = false;
        }
    }
    
    /**
     * Direct progress update for use by FormEventCoordinator
     * Bypasses the isUpdating lock for coordinated updates
     */
    updateProgressDirect() {
        // Skip updates during form loading
        if (window.isLoadingFormProgress) {
            return;
        }
        
        try {
            const percentage = this.calculateProgress();
            
            // Only update if percentage has changed to prevent unnecessary re-renders
            if (percentage !== this.lastPercentage) {
                if (this.progressBar && this.progressText) {
                    this.progressBar.style.width = `${percentage}%`;
                    this.progressText.textContent = `${percentage}% Complete`;
                    this.lastPercentage = percentage;
                }
            }
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    }
    
    /**
     * Debounced progress update to prevent excessive calls
     */
    debouncedUpdate() {
        clearTimeout(this.updateTimeout);
        this.updateTimeout = setTimeout(() => {
            this.updateProgress();
        }, 150); // Slightly longer delay to reduce flickering
    }
    
    /**
     * Initialize event listeners for form interactions
     */
    initializeEventListeners() {
        if (!this.form) return;
        
        // Use debounced updates for all events to prevent excessive re-rendering
        this.form.addEventListener('input', (e) => {
            console.log('Input event on:', e.target.name || e.target.id);
            this.debouncedUpdate();
        });
        
        this.form.addEventListener('change', (e) => {
            console.log('Change event on:', e.target.name || e.target.id);
            this.debouncedUpdate();
        });
        
        // Special handling for checkboxes and radio buttons
        this.form.addEventListener('click', (e) => {
            if (e.target.type === 'checkbox' || e.target.type === 'radio') {
                console.log('Click event on:', e.target.name || e.target.id);
                // Small delay to ensure the state is updated
                setTimeout(() => {
                    this.debouncedUpdate();
                }, 10);
            }
        });
        
        console.log('Progress bar event listeners initialized');
    }
    
    /**
     * Force an immediate progress update (use sparingly)
     */
    forceUpdate() {
        // Clear any pending timeouts
        clearTimeout(this.updateTimeout);

        // Reset flags to ensure update can proceed
        this.isUpdating = false;

        // Force immediate update regardless of loading state
        const wasLoading = window.isLoadingFormProgress;
        window.isLoadingFormProgress = false;

        this.updateProgress();

        // Restore loading state if it was set
        window.isLoadingFormProgress = wasLoading;
    }
    
    /**
     * Reset progress bar to 0%
     */
    reset() {
        if (this.progressBar && this.progressText) {
            this.progressBar.style.width = '0%';
            this.progressText.textContent = '0% Complete';
            this.lastPercentage = 0;
        }
    }
    
    /**
     * Get current progress percentage
     */
    getCurrentProgress() {
        return this.lastPercentage;
    }
    
    /**
     * Destroy the progress bar manager and clean up event listeners
     */
    destroy() {
        clearTimeout(this.updateTimeout);
        // Note: We don't remove event listeners as they're needed for form functionality
        // The form will be destroyed when the page unloads
        console.log('ProgressBarManager destroyed');
    }
}

/**
 * Initialize progress bar for a form (convenience function)
 */
export function initializeProgressBar(form, progressBarId = 'progressBar', progressTextId = 'progressText') {
    return new ProgressBarManager(form, progressBarId, progressTextId);
}

/**
 * Global utility to update progress (for backward compatibility)
 */
window.updateProgressBar = function() {
    if (typeof window.updateProgress === 'function') {
        window.updateProgress();
    }
};
