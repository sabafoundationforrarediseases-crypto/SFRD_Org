/**
 * Form Event Coordinator
 * Unified event handling system that coordinates save and progress bar updates
 * Prevents race conditions and duplicate event listeners
 */

export class FormEventCoordinator {
    constructor(form, saveCallback, progressBarManager, formEnhancements = null) {
        this.form = form;
        this.saveCallback = saveCallback;
        this.progressBarManager = progressBarManager;
        this.formEnhancements = formEnhancements;
        
        // Debounce timers
        this.saveTimeout = null;
        this.progressTimeout = null;
        this.animationFrameId = null;
        
        // State tracking
        this.isProcessing = false;
        this.pendingUpdate = false;
        
        // Bind methods
        this.handleFormEvent = this.handleFormEvent.bind(this);
        this.coordinatedUpdate = this.coordinatedUpdate.bind(this);
        
        this.initializeEventListeners();
        console.log('FormEventCoordinator initialized');
    }
    
    /**
     * Initialize a single set of event listeners for the form
     */
    initializeEventListeners() {
        if (!this.form) return;
        
        // Single event listener for input events
        this.form.addEventListener('input', this.handleFormEvent);
        
        // Single event listener for change events
        this.form.addEventListener('change', this.handleFormEvent);
        
        // Special handling for checkboxes and radio buttons
        this.form.addEventListener('click', (e) => {
            if (e.target.type === 'checkbox' || e.target.type === 'radio') {
                // Small delay to ensure the state is updated
                setTimeout(() => {
                    this.handleFormEvent(e);
                }, 10);
            }
        });
        
        console.log('Unified event listeners attached to form');
    }
    
    /**
     * Handle form events with coordinated debouncing
     */
    handleFormEvent(e) {
        // Skip if we're currently processing
        if (this.isProcessing) {
            this.pendingUpdate = true;
            return;
        }
        
        // Skip during form loading
        if (window.isLoadingFormProgress) {
            return;
        }
        
        // Clear existing timeouts
        clearTimeout(this.progressTimeout);
        clearTimeout(this.saveTimeout);
        
        // Schedule coordinated update
        // Progress bar updates faster (150ms) for better UX
        this.progressTimeout = setTimeout(() => {
            this.coordinatedUpdate();
        }, 150);
        
        // Save happens less frequently (800ms) to reduce localStorage writes
        this.saveTimeout = setTimeout(() => {
            if (this.saveCallback && typeof this.saveCallback === 'function') {
                this.saveCallback();
                
                // Show saving indicator if available
                if (this.formEnhancements && typeof this.formEnhancements.showSavingIndicator === 'function') {
                    this.formEnhancements.showSavingIndicator();
                }
            }
        }, 800);
    }
    
    /**
     * Coordinated update that runs progress bar update in animation frame
     */
    coordinatedUpdate() {
        if (this.isProcessing) {
            this.pendingUpdate = true;
            return;
        }
        
        this.isProcessing = true;
        
        // Cancel any pending animation frame
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        // Use requestAnimationFrame for smooth progress bar updates
        this.animationFrameId = requestAnimationFrame(() => {
            try {
                // Update progress bar first (lightweight DOM update)
                if (this.progressBarManager && typeof this.progressBarManager.updateProgressDirect === 'function') {
                    this.progressBarManager.updateProgressDirect();
                }
            } catch (error) {
                console.error('Error in coordinated update:', error);
            } finally {
                this.isProcessing = false;
                
                // Process any pending updates
                if (this.pendingUpdate) {
                    this.pendingUpdate = false;
                    setTimeout(() => this.coordinatedUpdate(), 50);
                }
            }
        });
    }
    
    /**
     * Force immediate update (use sparingly)
     */
    forceUpdate() {
        clearTimeout(this.progressTimeout);
        clearTimeout(this.saveTimeout);
        
        this.isProcessing = false;
        this.coordinatedUpdate();
        
        if (this.saveCallback && typeof this.saveCallback === 'function') {
            this.saveCallback();
        }
    }
    
    /**
     * Clean up event listeners and timers
     */
    destroy() {
        clearTimeout(this.progressTimeout);
        clearTimeout(this.saveTimeout);
        
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        if (this.form) {
            this.form.removeEventListener('input', this.handleFormEvent);
            this.form.removeEventListener('change', this.handleFormEvent);
        }
        
        console.log('FormEventCoordinator destroyed');
    }
}

/**
 * Initialize coordinated form event handling
 */
export function initializeFormCoordinator(form, saveCallback, progressBarManager) {
    return new FormEventCoordinator(form, saveCallback, progressBarManager);
}
