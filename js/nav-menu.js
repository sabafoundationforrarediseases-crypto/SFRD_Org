document.addEventListener('DOMContentLoaded', function () {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
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

    // Ensure lucide icons are rendered
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
