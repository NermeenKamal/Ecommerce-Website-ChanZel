// footer.js

// Get current page name if not already defined
let footerCurrentPage;
if (typeof currentPage === 'undefined') {
    footerCurrentPage = window.location.pathname.split('/').pop() || 'index.html';
} else {
    footerCurrentPage = currentPage;
}

const footerIsAuthPage = ['login.html', 'sign-up.html', 'forget-password.html'].includes(footerCurrentPage);

// Define footer HTML based on page type
const footerHTML = footerIsAuthPage ? `
    <footer class="auth-footer">
        <div class="text-center py-3">
            Copyright &copy; 2024 ChanZel By NERMEEN
        </div>
    </footer>
` : `
    <footer class="fixed-footer" id="contact">
        <div class="container">
            <div class="row">
                <div class="col-md-4">
                    <h5>About ChanZel</h5>
                    <p>Your premier destination for fashion. We bring you the latest trends in men's and women's clothing.</p>
                </div>
                <div class="col-md-4">
                    <h5>Quick Links</h5>
                    <ul class="list-unstyled">
                        <li><a href="index.html">Home</a></li>
                        <li><a href="women.html">Women</a></li>
                        <li><a href="men.html">Men</a></li>
                        <li><a href="about.html">About</a></li>
                    </ul>
                </div>
                <div class="col-md-4">
                    <h5>Connect With Us</h5>
                    <div class="social-links">
                        <a href="https://www.facebook.com/NermeenKamalEldin" class="social-link">
                            <i class="fa-brands fa-facebook"></i>
                        </a>
                        <a href="https://github.com/NermeenKamal" class="social-link">
                            <i class="fa-brands fa-github"></i>
                        </a>
                        <a href="https://www.linkedin.com/in/nirmn-kamal/" class="social-link">
                            <i class="fa-brands fa-linkedin"></i>
                        </a>
                        <a href="https://www.behance.net/Nermeen_Kamal" class="social-link">
                            <i class="fa-brands fa-square-behance"></i>
                        </a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p class="text-center mb-0">Copyright &copy; 2024 ChanZel By NERMEEN</p>
            </div>
        </div>
    </footer>
`;

// Insert footer
document.getElementById('footer').innerHTML = footerHTML;

// Language translation for footer
const translations = {
    en: {
        about: 'About ChanZel',
        aboutText: 'Your premier destination for fashion. We bring you the latest trends in men\'s and women\'s clothing.',
        quickLinks: 'Quick Links',
        home: 'Home',
        women: 'Women',
        men: 'Men',
        about: 'About',
        connect: 'Connect With Us',
        copyright: 'Copyright © 2024 ChanZel By NERMEEN'
    },
    ar: {
        about: 'عن شانزيل',
        aboutText: 'وجهتك الأولى للأزياء. نقدم لك أحدث صيحات الموضة في ملابس الرجال والنساء.',
        quickLinks: 'روابط سريعة',
        home: 'الرئيسية',
        women: 'نساء',
        men: 'رجال',
        about: 'عن المتجر',
        connect: 'تواصل معنا',
        copyright: 'حقوق النشر © 2024 شانزيل بواسطة نرمين'
    }
};

// Function to translate footer
function translateFooter(lang) {
    if (footerIsAuthPage) return;
    
    const t = translations[lang];
    const footer = document.querySelector('footer');
    
    if (footer) {
        // Check if elements exist before accessing them
        const aboutTitle = footer.querySelector('h5:nth-of-type(1)');
        const aboutText = footer.querySelector('p:nth-of-type(1)');
        const quickLinksTitle = footer.querySelector('h5:nth-of-type(2)');
        const connectTitle = footer.querySelector('h5:nth-of-type(3)');
        const copyrightText = footer.querySelector('.footer-bottom p');
        
        if (aboutTitle) aboutTitle.textContent = t.about;
        if (aboutText) aboutText.textContent = t.aboutText;
        if (quickLinksTitle) quickLinksTitle.textContent = t.quickLinks;
        
        const quickLinks = footer.querySelectorAll('.list-unstyled li a');
        if (quickLinks.length >= 4) {
            if (quickLinks[0]) quickLinks[0].textContent = t.home;
            if (quickLinks[1]) quickLinks[1].textContent = t.women;
            if (quickLinks[2]) quickLinks[2].textContent = t.men;
            if (quickLinks[3]) quickLinks[3].textContent = t.about;
        }
        
        if (connectTitle) connectTitle.textContent = t.connect;
        if (copyrightText) copyrightText.textContent = t.copyright;
    }
}

// Initialize translation
document.addEventListener('DOMContentLoaded', function() {
    const savedLang = localStorage.getItem('lang') || 'en';
    translateFooter(savedLang);
    
    // Listen for language changes
    window.addEventListener('storage', function(e) {
        if (e.key === 'lang') {
            translateFooter(e.newValue || 'en');
        }
    });
}); 
