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
    <footer class="container-fluid mt-5" id="contact">
        <div class="d-flex align-items-center flex-column foo">
            <h2 class="textt  fo">Subscribe To Get Offers In Your Inbox</h2>
            <span class="text fon" style="font-size: 20px">Lorem ipsum dolor sit amet, adipiscing elit sed do eiusmod condimentum<br> <br></span>
            <div class="navbar-nav vvv">
                <a href="index.html" class="nav-link text mr-4">Buy T-Shirts</a>
                <a href="women.html" class="nav-link text mr-4">Women</a>
                <a href="men.html" class="nav-link text mr-4">Men</a>
                <a href="about.html" class="nav-link text mr-4">About</a>
                <a href="#contact" class="nav-link text">Contact</a>
            </div>
            <div class="d-flex mt-3 btns">
                <a class="ico-btn btn btn-lightt" type="button" href="https://www.facebook.com/NermeenKamalEldin">
                    <i class="fa-brands fa-facebook"></i></a>
                <a class="ico-btn btn btn-lightt" type="button" href="https://github.com/NermeenKamal">
                    <i class="fa-brands fa-github"></i></a>
                <a class="ico-btn btn btn-lightt" type="button" href="https://www.linkedin.com/in/nirmn-kamal/">
                    <i class="fa-brands fa-linkedin"></i></a>
                <a class="ico-btn btn btn-lightt" type="button" href="https://www.behance.net/Nermeen_Kamal">
                    <i class="fa-brands fa-square-behance"></i></a>
            </div>
        </div>
        <div class="last-div copy mb-4">Copyright &copy; 2024 ChanZel By NERMEEN</div>
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
        const aboutTitle = footer.querySelector('h2');
        const aboutText = footer.querySelector('span');
        const quickLinksTitle = footer.querySelector('h2');
        const connectTitle = footer.querySelector('h2');
        const copyrightText = footer.querySelector('.copy');
        
        if (aboutTitle) aboutTitle.textContent = t.about;
        if (aboutText) aboutText.textContent = t.aboutText;
        if (quickLinksTitle) quickLinksTitle.textContent = t.quickLinks;
        
        const quickLinks = footer.querySelectorAll('.navbar-nav li a');
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
