// footer.js

// Get current page name
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const isAuthPage = ['login.html', 'sign-up.html', 'forget-password.html'].includes(currentPage);

// Define footer HTML based on page type
const footerHTML = isAuthPage ? `
    <footer class="auth-footer">
        <div class="text-center py-3">
            Copyright &copy; 2024 ChanZel By NERMEEN
        </div>
    </footer>
` : `
    <footer class="container-fluid mt-5" id="contact">
        <div class="d-flex align-items-center flex-column foo">
            <h2 class="textt fo">Subscribe To Get Offers In Your Inbox</h2>
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
        subscribe: 'Subscribe To Get Offers In Your Inbox',
        lorem: 'Lorem ipsum dolor sit amet, adipiscing elit sed do eiusmod condimentum',
        buyTshirts: 'Buy T-Shirts',
        women: 'Women',
        men: 'Men',
        about: 'About',
        contact: 'Contact',
        copyright: 'Copyright © 2024 ChanZel By NERMEEN'
    },
    ar: {
        subscribe: 'اشترك للحصول على العروض في صندوق الوارد الخاص بك',
        lorem: 'هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة',
        buyTshirts: 'شراء تي شيرت',
        women: 'نساء',
        men: 'رجال',
        about: 'عن المتجر',
        contact: 'اتصل بنا',
        copyright: 'حقوق النشر © 2024 شانزيل بواسطة نرمين'
    }
};

function translateFooter(lang) {
    if (isAuthPage) return;
    
    const t = translations[lang];
    document.querySelector('.textt.fo').textContent = t.subscribe;
    document.querySelector('.text.fon').textContent = t.lorem;
    
    const navLinks = document.querySelectorAll('.navbar-nav.vvv .nav-link');
    navLinks[0].textContent = t.buyTshirts;
    navLinks[1].textContent = t.women;
    navLinks[2].textContent = t.men;
    navLinks[3].textContent = t.about;
    navLinks[4].textContent = t.contact;
    
    document.querySelector('.last-div.copy').textContent = t.copyright;
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
