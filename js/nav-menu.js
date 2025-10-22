document.addEventListener('DOMContentLoaded', function () {
    // Create backdrop for mobile menu
    let backdrop = document.getElementById('mobile-menu-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'mobile-menu-backdrop';
        backdrop.className = 'hidden fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 lg:hidden';
        document.body.appendChild(backdrop);
    }
    
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            backdrop.classList.toggle('hidden');
            // Prevent body scroll when menu is open
            document.body.classList.toggle('overflow-hidden');
        });
        
        // Close menu when clicking backdrop
        backdrop.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            backdrop.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        });
    }

    // Mobile Accordion Logic
    const accordionButtons = document.querySelectorAll('.mobile-accordion-button');
    accordionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;
            const icon = button.querySelector('i[data-lucide="chevron-down"]');
            
            if (content.style.display === 'block') {
                content.style.display = 'none';
                if(icon) icon.classList.remove('rotate-180');
            } else {
                content.style.display = 'block';
                if(icon) icon.classList.add('rotate-180');
            }
        });
    });

    // Desktop dropdown logic with 2-second auto-close on hover
    const dropdownGroups = document.querySelectorAll('.relative.group');
    
    dropdownGroups.forEach(group => {
        const button = group.querySelector('button');
        const dropdown = group.querySelector('.absolute');
        
        if (button && dropdown) {
            // Each dropdown gets its own timeout variable
            let dropdownTimeout = null;
            
            // Show dropdown immediately on mouse enter to group
            group.addEventListener('mouseenter', () => {
                // Close all other dropdowns first
                dropdownGroups.forEach(otherGroup => {
                    if (otherGroup !== group) {
                        const otherDropdown = otherGroup.querySelector('.absolute');
                        if (otherDropdown) {
                            otherDropdown.classList.add('hidden');
                        }
                    }
                });
                
                // Clear any pending hide timeout
                if (dropdownTimeout) {
                    clearTimeout(dropdownTimeout);
                    dropdownTimeout = null;
                }
                // Show dropdown immediately
                dropdown.classList.remove('hidden');
            });
            
            // Start 2-second timer when mouse leaves the group
            group.addEventListener('mouseleave', () => {
                // Clear any existing timeout first
                if (dropdownTimeout) {
                    clearTimeout(dropdownTimeout);
                }
                // Set new timeout to hide after 2 seconds
                dropdownTimeout = setTimeout(() => {
                    dropdown.classList.add('hidden');
                    dropdownTimeout = null;
                }, 2000);
            });
        }
    });

    // Ensure lucide icons are rendered
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
