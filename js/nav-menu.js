document.addEventListener('DOMContentLoaded', async function () {
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

    // ========================================
    // FIREBASE AUTHENTICATION LOGIC
    // ========================================
    
    // Check if Firebase is available and config is loaded
    if (typeof firebaseConfig !== 'undefined') {
        try {
            // Dynamically import Firebase modules
            const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
            const { getAuth, onAuthStateChanged, signOut } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
            const { getFirestore, doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');

            // Initialize Firebase
            const app = initializeApp(firebaseConfig);
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

            // Auth State Change Handler
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    // User is signed in
                    const userRef = doc(db, `artifacts/${appId}/users`, user.uid);
                    const docSnap = await getDoc(userRef);

                    let userStatus = 'profile_incomplete';
                    let userRole = 'patient';
                    let displayName = user.displayName || user.email?.split('@')[0] || 'User';

                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        userStatus = userData.status || 'profile_incomplete';
                        userRole = userData.role || 'patient';
                        displayName = userData.name || displayName;
                    }

                    // Determine action button
                    let actionButtonText = 'Dashboard';
                    let actionButtonLink = dashboardUrls[userRole] || dashboardUrls.default;

                    if (userStatus === 'profile_incomplete') {
                        actionButtonText = 'Complete Profile';
                        actionButtonLink = onboardingForms[userRole] || dashboardUrls.default;
                    } else if (userStatus === 'pending_approval') {
                        actionButtonText = 'Pending Approval';
                        actionButtonLink = './00-9 Pending Approval.html';
                    }

                    // Update Desktop Auth Buttons
                    if (authButtonsDesktop) {
                        authButtonsDesktop.innerHTML = `
                            <span class="text-sm font-medium text-gray-700">Welcome, ${displayName}</span>
                            <a href="${actionButtonLink}" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">${actionButtonText}</a>
                            <button id="logout-btn-desktop" class="text-sm font-semibold text-white bg-red-600 px-4 py-2 rounded-full hover:bg-red-700 transition">Logout</button>
                        `;

                        // Add logout handler
                        document.getElementById('logout-btn-desktop')?.addEventListener('click', async () => {
                            await signOut(auth);
                            window.location.href = './00-8 Login.html';
                        });
                    }

                    // Update Mobile Auth Buttons
                    if (mobileAuthButtons) {
                        mobileAuthButtons.innerHTML = `
                            <div class="px-3 py-2 text-sm font-medium text-gray-700">Welcome, ${displayName}</div>
                            <div class="flex flex-col gap-2">
                                <a href="${actionButtonLink}" class="text-center px-4 py-2.5 rounded-full shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition">${actionButtonText}</a>
                                <button id="logout-btn-mobile" class="text-center px-4 py-2.5 rounded-full shadow-sm text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition">Logout</button>
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
            console.error('Firebase auth initialization error:', error);
        }
    }
    // ========================================
    // END FIREBASE AUTHENTICATION LOGIC
    // ========================================

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
