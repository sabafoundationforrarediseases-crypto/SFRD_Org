import { auth, db, appId } from './firebase-config.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';

// This guard is used for all onboarding forms and protected pages.
// It ensures that a user is authenticated and redirects them based on their profile status.
// It does NOT run on login/register pages to avoid conflicts.

// Prevent multiple simultaneous auth checks
let authCheckInProgress = false;

// Check if we're on a page that should be excluded from auth guard
const currentPath = window.location.pathname;
const excludedPaths = [
    '/00-8 Login.html',
    '/00-7 Register.html',
    '/00-9 Forgot Password.html',
    'Login.html',
    'Register.html',
    'Forgot Password.html'
];

const isExcludedPage = excludedPaths.some(path => currentPath.includes(path));

if (!isExcludedPage) {
    console.log('Auth guard active for path:', currentPath);

    onAuthStateChanged(auth, async (user) => {
        // Prevent multiple simultaneous checks
        if (authCheckInProgress) {
            console.log('Auth guard: Check already in progress, skipping...');
            return;
        }
        authCheckInProgress = true;
        if (user) {
            const userDocRef = doc(db, `artifacts/${appId}/users`, user.uid);
            try {
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const userStatus = userData.status;
                    const userRole = userData.role;

                    console.log('Auth guard - User status:', userStatus, 'Role:', userRole);

                    // Define the mapping from role to the correct onboarding form URL
                    const roleToFormMap = {
                        'patient': '/01 PATIENT/01D New Patient Onboarding Form.html',
                        'epo': '/02 EPO/02D New EPO Onboarding Form.html',
                        'doctor': '/03 HCP/03D New Healthcare Professional Onboarding.html',
                        'volunteer': '/04 VOLUNTEER/04D New Volunteer Onboarding Form.html',
                        'ngo': '/05 NGO/05D New NGO Onboarding Form.html',
                        'lab': '/06 LAB/06D New Lab Onboarding Form.html',
                        'hospital': '/07 HOSPITAL/07D New Hospital Onbaording Form.html'
                    };

                    const expectedFormUrl = roleToFormMap[userRole];

                    if (userStatus === 'profile_incomplete') {
                        // If the user's profile is incomplete, they MUST be on their specific onboarding form.
                        if (expectedFormUrl) {
                            // Normalize both paths for a reliable comparison
                            const normalizedCurrentPath = decodeURI(currentPath).replace(/\\/g, '/').toLowerCase();
                            const normalizedExpectedPath = decodeURI(expectedFormUrl).replace(/\\/g, '/').toLowerCase();

                            // Check if the current path ENDS with the expected path
                            if (!normalizedCurrentPath.endsWith(normalizedExpectedPath)) {
                                console.log(`Auth guard redirecting to ${expectedFormUrl} because profile is incomplete.`);
                                window.location.href = expectedFormUrl;
                            } else {
                                console.log('Auth guard: User is already on the correct onboarding form. No redirect needed.');
                            }
                        }
                    } else if (userStatus === 'pending_approval') {
                        // If pending approval, they should be on the pending page.
                        if (!currentPath.includes('Pending Approval.html') && !currentPath.includes('pending-approval.html')) {
                            console.log('Auth guard redirecting to pending approval page.');
                            window.location.href = '/00 GLOBAL/00-9 Pending Approval.html';
                        }
                    } else if (userStatus === 'approved') {
                        // If approved, they can access their dashboard and other approved pages
                        // Only redirect if they're on a restricted page
                        const dashboardUrls = {
                            patient: '/01 PATIENT/01G Patient Dashboard.html',
                            doctor: '/03 HCP/03E Healthcare Professional Dashboard.html',
                            volunteer: '/04 VOLUNTEER/04E Volunteer Dashboard.html',
                            epo: '/02 EPO/02E EPO Dashboard Code.html',
                            ngo: '/05 NGO/05E NGO Dashboard Code.html',
                            lab: '/06 LAB/06E Lab Dashboard.html',
                            hospital: '/07 HOSPITAL/07E Hospital Dashboard.html'
                        };

                        // Allow access to homepage and their dashboard
                        const allowedForApproved = [
                            '/00 GLOBAL/00 Homepage.html',
                            dashboardUrls[userRole]
                        ];

                        // Don't redirect if they're already on an allowed page
                        const isOnAllowedPage = allowedForApproved.some(url => currentPath.includes(url));
                        if (!isOnAllowedPage && currentPath.includes('Onboarding')) {
                            console.log('Auth guard redirecting approved user to homepage.');
                            window.location.href = '/00 GLOBAL/00 Homepage.html';
                        }
                    }

                } else {
                    // User authenticated but no Firestore document
                    console.error('Auth guard: User document not found in Firestore');
                    window.location.href = '/00 GLOBAL/00-8 Login.html';
                }
            } catch (error) {
                console.error('Auth guard: Error fetching user document:', error);
                // Don't redirect on error, just log it
            } finally {
                // Reset the flag after check completes
                setTimeout(() => {
                    authCheckInProgress = false;
                }, 1000);
            }
        } else {
            // No user is signed in - redirect to login
            console.log('Auth guard: User not authenticated. Redirecting to login.');
            window.location.href = '/00 GLOBAL/00-8 Login.html';
        }
    });
} else {
    console.log('Auth guard skipped for excluded path:', currentPath);
}
