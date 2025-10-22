// ========================================
// NAVIGATION MENU HANDLER - PRODUCTION
// ========================================

(function() {
    'use strict';

    // Mobile Menu Setup
    function initMobileMenu() {
        let backdrop = document.getElementById('mobile-menu-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.id = 'mobile-menu-backdrop';
            backdrop.className = 'hidden fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 lg:hidden';
            document.body.appendChild(backdrop);
        }
        
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
                backdrop.classList.toggle('hidden');
                document.body.classList.toggle('overflow-hidden');
            });
            
            backdrop.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                backdrop.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
            });
        }
    }

    // Firebase Authentication
    async function initAuth() {
        // Wait for Firebase config
        let attempts = 0;
        while ((typeof window.firebaseConfig === 'undefined' || typeof window.appId === 'undefined') && attempts < 30) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }

        if (typeof window.firebaseConfig === 'undefined' || typeof window.appId === 'undefined') {
            return;
        }

        try {
            const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
            const { getAuth, onAuthStateChanged, signOut } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
            const { getFirestore, doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');

            const app = initializeApp(window.firebaseConfig);
            const auth = getAuth(app);
            const db = getFirestore(app);

            // DOM Elements for auth buttons
            const authButtonsDesktop = document.getElementById('auth-buttons-desktop');
            const mobileAuthButtons = document.getElementById('mobile-auth-buttons');

            // Dashboard URLs mapping
            const dashboardUrls = {
                patient: '../01 PATIENT/01G Patient Dashboard.html',
                doctor: '../03 HCP/03E Healthcare Professional Dashboard.html',
                volunteer: '../04 VOLUNTEER/04E Volunteer Dashboard.html',
                epo: '../02 EPO/02E EPO Dashboard Code.html',
                ngo: '../05 NGO/05E NGO Dashboard.html',
                lab: '../06 LAB/06E Lab Dashboard.html',
                hospital: '../07 HOSPITAL/07E Hospital Dashboard.html',
                admin: '../SUPER ADMIN DASHBOARD.HTML',
                default: './00-8 Login.html'
            };

            // Onboarding forms mapping
            const onboardingForms = {
                patient: '../01 PATIENT/01D New Patient Onboarding Form.html',
                doctor: '../03 HCP/03D New Healthcare Professional Onboarding.html',
                volunteer: '../04 VOLUNTEER/04D New Volunteer Onboarding Form.html',
                epo: '../02 EPO/02D New EPO Onboarding Form.html',
                ngo: '../05 NGO/05D New NGO Onboarding Form.html',
                hospital: '../07 HOSPITAL/07D New Hospital Onbaording Form.html',
                lab: '../06 LAB/06D New Lab Onboarding Form.html'
            };

            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    const userRef = doc(db, `artifacts/${window.appId}/users`, user.uid);
                    const docSnap = await getDoc(userRef);

                    let userStatus = 'profile_incomplete';
                    let userRole = 'patient';
                    let displayName = user.displayName || user.email?.split('@')[0] || 'User';
                    let photoURL = user.photoURL;

                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        userStatus = userData.status || 'profile_incomplete';
                        userRole = userData.role || 'patient';
                        displayName = userData.displayName || userData.name || displayName;
                        photoURL = userData.photoURL || photoURL;
                    }

                    // Determine action button with color coding
                    let actionButtonText = 'Dashboard';
                    let actionButtonLink = dashboardUrls[userRole] || dashboardUrls.default;
                    let actionButtonClass = 'text-sm font-semibold text-white bg-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-700 transition';

                    if (userStatus === 'profile_incomplete') {
                        actionButtonText = 'Complete Your Profile';
                        actionButtonLink = onboardingForms[userRole] || onboardingForms.patient;
                        actionButtonClass = 'text-sm font-semibold text-white bg-orange-600 px-4 py-2 rounded-full hover:bg-orange-700 transition';
                    } else if (userStatus === 'pending_approval') {
                        actionButtonText = 'Pending Approval';
                        actionButtonLink = './00-9 Pending Approval.html';
                        actionButtonClass = 'text-sm font-semibold text-white bg-yellow-600 px-4 py-2 rounded-full cursor-not-allowed';
                    }

                    // Create avatar (Google profile photo or placeholder)
                    const avatarSrc = photoURL || `https://placehold.co/100x100/7c3aed/FFFFFF?text=${(displayName || 'U').charAt(0).toUpperCase()}`;

                    // Update Desktop Auth Buttons
                    if (authButtonsDesktop) {
                        authButtonsDesktop.innerHTML = `
                            <div class="flex items-center space-x-4">
                                <span class="text-sm font-medium text-gray-700">Welcome, ${displayName}</span>
                                <img src="${avatarSrc}" alt="Profile" class="h-8 w-8 rounded-full object-cover" onerror="this.src='https://placehold.co/100x100/7c3aed/FFFFFF?text=${(displayName || 'U').charAt(0).toUpperCase()}'">
                                <a href="${actionButtonLink}" class="${actionButtonClass}">${actionButtonText}</a>
                                <button id="logout-btn-desktop" class="text-sm font-semibold text-red-600 border border-red-600 px-4 py-2 rounded-full hover:bg-red-600 hover:text-white transition">Logout</button>
                            </div>
                        `;

                        // Add logout handler
                        document.getElementById('logout-btn-desktop')?.addEventListener('click', async () => {
                            await signOut(auth);
                            window.location.href = './00-8 Login.html';
                        });
                    }

                    // Update Mobile Auth Buttons
                    if (mobileAuthButtons) {
                        const mobileButtonColor = userStatus === 'profile_incomplete' ? 'text-orange-600' : userStatus === 'pending_approval' ? 'text-yellow-600' : 'text-indigo-600';
                        
                        mobileAuthButtons.innerHTML = `
                            <div class="flex items-center gap-3 px-5 py-3 border-b border-gray-200">
                                <img src="${avatarSrc}" alt="Profile" class="h-10 w-10 rounded-full object-cover" onerror="this.src='https://placehold.co/100x100/7c3aed/FFFFFF?text=${(displayName || 'U').charAt(0).toUpperCase()}'">
                                <span class="text-sm font-medium text-gray-700">Welcome, ${displayName}</span>
                            </div>
                            <div class="px-5 py-3 space-y-2">
                                <a href="${actionButtonLink}" class="block px-3 py-2 rounded-md text-base font-medium ${mobileButtonColor} hover:bg-gray-100">${actionButtonText}</a>
                                <button id="logout-btn-mobile" class="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-100">Logout</button>
                            </div>
                        `;

                        // Add logout handler
                        document.getElementById('logout-btn-mobile')?.addEventListener('click', async () => {
                            await signOut(auth);
                            window.location.href = './00-8 Login.html';
                        });
                    }
                } else {
                    // User is signed out - show default login/register buttons
                    if (authButtonsDesktop) {
                        authButtonsDesktop.innerHTML = `
                            <a href="./00-8 Login.html" class="text-sm font-medium text-gray-600 hover:text-indigo-600">Login</a>
                            <a href="./00-7 Register.html" class="text-sm font-semibold text-indigo-600 border border-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-600 hover:text-white transition">Register</a>
                            <a href="./00-6 Donate.html" class="text-sm font-semibold text-white bg-violet-600 px-4 py-2 rounded-full hover:bg-violet-700 transition">Donate</a>
                        `;
                    }

                    if (mobileAuthButtons) {
                        mobileAuthButtons.innerHTML = `
                            <div class="flex flex-col gap-3">
                                <div class="grid grid-cols-2 gap-2">
                                    <a href="./00-8 Login.html" class="text-center px-4 py-2.5 rounded-full shadow-sm text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition">Login</a>
                                    <a href="./00-7 Register.html" class="text-center px-4 py-2.5 rounded-full shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition">Register</a>
                                </div>
                                <a href="./00-6 Donate.html" class="text-center px-4 py-2.5 rounded-full shadow-sm text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 transition">Donate</a>
                            </div>
                        `;
                    }
                }
            });
        } catch (error) {
            // Silent error handling for production
        }
    }

    // Mobile Accordion
    function initAccordion() {
        const buttons = document.querySelectorAll('.mobile-accordion-button');
        buttons.forEach(button => {
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
    }

    // Desktop Dropdowns
    function initDropdowns() {
        const dropdownGroups = document.querySelectorAll('.relative.group');
        
        dropdownGroups.forEach(group => {
            const button = group.querySelector('button');
            const dropdown = group.querySelector('.absolute');
            
            if (button && dropdown) {
                let dropdownTimeout = null;
                
                group.addEventListener('mouseenter', () => {
                    dropdownGroups.forEach(otherGroup => {
                        if (otherGroup !== group) {
                            const otherDropdown = otherGroup.querySelector('.absolute');
                            if (otherDropdown) otherDropdown.classList.add('hidden');
                        }
                    });
                    
                    if (dropdownTimeout) {
                        clearTimeout(dropdownTimeout);
                        dropdownTimeout = null;
                    }
                    dropdown.classList.remove('hidden');
                });
                
                group.addEventListener('mouseleave', () => {
                    if (dropdownTimeout) clearTimeout(dropdownTimeout);
                    dropdownTimeout = setTimeout(() => {
                        dropdown.classList.add('hidden');
                        dropdownTimeout = null;
                    }, 1000);
                });
            }
        });
    }

    // Initialize all
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initMobileMenu();
            initAccordion();
            initDropdowns();
            initAuth();
        });
    } else {
        initMobileMenu();
        initAccordion();
        initDropdowns();
        initAuth();
    }

})();
