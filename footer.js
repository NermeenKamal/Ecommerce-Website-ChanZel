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
    <footer class="footer-main" style="background:#f8e9df;padding:32px 0 0 0;font-family:inherit;">
      <div class="container text-center">
        <h4 class="mb-2" style="font-weight:600;font-size:1.35rem;letter-spacing:0.5px;">Subscribe To Get Offers In Your Inbox</h4>
        <span style="font-size: 1.05rem; color:#888;">Lorem ipsum dolor sit amet, adipiscing elit sed do eiusmod condimentum<br><br></span>
        <div class="d-flex justify-content-center gap-3 mt-3 mb-2 flex-wrap" style="font-size:1rem;">
          <a href="index.html" class="nav-link" style="display:inline-block;min-width:90px;font-weight:500;">Buy T-Shirts</a>
          <a href="women.html" class="nav-link" style="display:inline-block;min-width:70px;font-weight:500;">Women</a>
          <a href="men.html" class="nav-link" style="display:inline-block;min-width:70px;font-weight:500;">Men</a>
          <a href="about.html" class="nav-link" style="display:inline-block;min-width:70px;font-weight:500;">About</a>
          <a href="#contact" class="nav-link" style="display:inline-block;min-width:70px;font-weight:500;">Contact</a>
        </div>
        <div class="d-flex justify-content-center gap-2 mb-4 flex-wrap">
          <a class="ico-btn btn btn-lightt mx-1" type="button" href="https://www.facebook.com/NermeenKamalEldin" style="min-width:48px;min-height:38px;display:flex;align-items:center;justify-content:center;font-size:1.25rem;"><i class="fa-brands fa-facebook"></i></a>
          <a class="ico-btn btn btn-lightt mx-1" type="button" href="https://github.com/NermeenKamal" style="min-width:48px;min-height:38px;display:flex;align-items:center;justify-content:center;font-size:1.25rem;"><i class="fa-brands fa-github"></i></a>
          <a class="ico-btn btn btn-lightt mx-1" type="button" href="https://www.linkedin.com/in/nirmn-kamal/" style="min-width:48px;min-height:38px;display:flex;align-items:center;justify-content:center;font-size:1.25rem;"><i class="fa-brands fa-linkedin"></i></a>
          <a class="ico-btn btn btn-lightt mx-1" type="button" href="https://www.behance.net/Nermeen_Kamal" style="min-width:48px;min-height:38px;display:flex;align-items:center;justify-content:center;font-size:1.25rem;"><i class="fa-brands fa-square-behance"></i></a>
        </div>
      </div>
      <div style="background:#000;color:#fff;padding:18px 0 10px 0;margin-top:0;">
        <div class="container text-center">
          <span style="font-size:1rem;">Copyright &copy; 2024 ChanZel By NERMEEN</span>
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
        const aboutTitle = footer.querySelector('h4');
        const aboutText = footer.querySelector('span');
        const quickLinksTitle = footer.querySelector('h4');
        const connectTitle = footer.querySelector('h4');
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
