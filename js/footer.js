document.addEventListener('DOMContentLoaded', function () {
    // Create and insert footer if footer element exists
    const footerElement = document.querySelector('footer#unified-footer');
    
    if (footerElement) {
        footerElement.className = 'bg-gray-800 text-white';
        footerElement.innerHTML = `
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <!-- Main Footer Links -->
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                <div class="col-span-2 lg:col-span-2">
                    <h3 class="text-lg font-semibold">Saba Foundation for Rare Diseases</h3>
                    <p class="mt-2 text-gray-400 text-sm">Connecting, Collaborating, and Championing the Rare Disease Community in India.</p>
                     <div class="mt-4">
                        <h4 class="font-semibold">Signup for SFRD News</h4>
                        <form id="newsletter-form" class="mt-2 space-y-2">
                            <input type="text" name="name" placeholder="Your name" required class="w-full rounded-md border-gray-600 bg-gray-700 text-white px-4 py-2 focus:ring-indigo-500" />
                            <div class="flex">
                                <input type="email" name="email" placeholder="Your email" required class="w-full rounded-l-md border-gray-600 bg-gray-700 text-white px-4 py-2 focus:ring-indigo-500" />
                                <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 rounded-r-md">Go</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div>
                    <h4 class="font-semibold tracking-wider uppercase">About</h4>
                    <ul class="mt-4 space-y-2 text-sm">
                        <li><a href="../00 GLOBAL/00-1 About Us Page.html" class="text-gray-400 hover:text-white">About Us</a></li>
                        <li><a href="../00 GLOBAL/00-3 Careers.html" class="text-gray-400 hover:text-white">Careers</a></li>
                        <li><a href="../00 GLOBAL/00-4 Media Enquiries.html" class="text-gray-400 hover:text-white">Media Inquiries</a></li>
                        <li><a href="../00 GLOBAL/00-2 Contact Us.html" class="text-gray-400 hover:text-white">Contact Us</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold tracking-wider uppercase">Resources</h4>
                    <ul class="mt-4 space-y-2 text-sm">
                        <li><a href="../00 GLOBAL/00-5 All FAQs.html" class="text-gray-400 hover:text-white">FAQs</a></li>
                        <li><a href="../00 GLOBAL/Patient-stories.html" class="text-gray-400 hover:text-white">Patient Stories</a></li>
                        <li><a href="../00 GLOBAL/Governance.html" class="text-gray-400 hover:text-white">Governance</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white">Site Map</a></li>
                    </ul>
                </div>
                 <div class="col-span-2 lg:col-span-2">
                     <h4 class="font-semibold tracking-wider uppercase">Contact</h4>
                    <div class="mt-4 text-sm text-gray-400 space-y-2">
                        <p>#1-8-143, 2nd Floor, Penderghast Road, Secunderabad, Hyderabad - 500 003, Telangana, India</p>
                        <p>Email: <a href="mailto:help@sfrd.in" class="hover:text-white">help@sfrd.in</a></p>
                        <p>Phone: <a href="tel:+917995755855" class="hover:text-white">+91 7995 755 855</a></p>
                    </div>
                </div>
            </div>

            <!-- Disclaimer -->
            <div class="mt-12 pt-8 border-t border-gray-700">
                <h4 class="font-semibold text-gray-300">Disclaimer</h4>
                <p class="text-xs text-gray-500 mt-2">
                    SFRD provides this information for the benefit of the rare disease community & its ecosystem. SFRD is not a medical provider or health care facility and thus can neither diagnose any disease or disorder nor endorse or recommend any specific medical treatments. Patients must adhere to the personal and individualized medical advice of their qualified doctors. Information on this platform is for navigational and support purposes only.
                </p>
                 <p class="text-xs text-gray-400 mt-4">
                    Not-for-Profit Foundation Incorporated under Section 8 of Companies Act, 2013. All Donations are 50% Tax Exempt under Section 80G of IT Act, 1961.
                </p>
            </div>
            
            <!-- Policy Links -->
            <div class="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
                <div class="flex flex-wrap justify-center gap-x-6 gap-y-2">
                    <a href="https://docs.google.com/document/d/1DaIihxF15313_7sXTXPut-MybQrofzkEK493i203o50/edit?usp=sharing" target="_blank" rel="noopener noreferrer" class="hover:text-white">Terms of Service</a>
                    <a href="https://docs.google.com/document/d/103uoZ_4xPFurnJ-mR5ogSdesUJjc0sWu4P1THxdqq3o/edit?usp=sharing" target="_blank" rel="noopener noreferrer" class="hover:text-white">Privacy Policy</a>
                    <a href="https://docs.google.com/document/d/1v9S0Uyv_2AORHF-VM_WslopVTkFlIL5jBYlSVZcdM0E/edit?usp=sharing" target="_blank" rel="noopener noreferrer" class="hover:text-white">Disclaimer</a>
                    <a href="https://docs.google.com/document/d/1UrgKEaaPsg1IehLsQOZQeLLaAPYsqwcOVBwQ_ZcTQzE/edit?usp=sharing" target="_blank" rel="noopener noreferrer" class="hover:text-white">Cookie Policy</a>
                    <a href="https://docs.google.com/document/d/1Sg0INFrudDVixwPEJ0qSJBNxZsIpJVtPI2d44rY7Bsk/edit?usp=sharing" target="_blank" rel="noopener noreferrer" class="hover:text-white">Copyright Policy</a>
                    <a href="https://docs.google.com/document/d/1UD7tg0VF1eD7NjbDAX66g8WETYxtSpCUebNIBuX3aYI/edit?usp=sharing" target="_blank" rel="noopener noreferrer" class="hover:text-white">Community Guidelines</a>
                    <a href="https://docs.google.com/document/d/1N9vdtJYjTYEtS_iGSMa-wZtfXcZ13-09ZDqKG_Y2YVY/edit?usp=sharing" target="_blank" rel="noopener noreferrer" class="hover:text-white">Accessibility Statement</a>
                </div>
            </div>

            <!-- Bottom Bar -->
            <div class="mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-sm">
                <p class="text-gray-500">&copy; 2025 SFRD - Saba Foundation for Rare Diseases. All rights reserved.</p>
                <div class="flex space-x-4 mt-4 md:mt-0">
                    <a href="#" class="text-gray-400 hover:text-white"><i data-lucide="linkedin" class="w-5 h-5"></i></a>
                    <a href="#" class="text-gray-400 hover:text-white"><i data-lucide="twitter" class="w-5 h-5"></i></a>
                    <a href="#" class="text-gray-400 hover:text-white"><i data-lucide="facebook" class="w-5 h-5"></i></a>
                    <a href="#" class="text-gray-400 hover:text-white"><i data-lucide="instagram" class="w-5 h-5"></i></a>
                </div>
            </div>
        </div>
        `;
        
        // Re-initialize Lucide icons for the footer
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
});
