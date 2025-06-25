// navbar.js

// Get current page name
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const isAuthPage = ['login.html', 'sign-up.html', 'forget-password.html'].includes(currentPage);

// Define navbar HTML based on page type
const navbarHTML = isAuthPage ? `
    <nav class="navbar navbar-expand-lg auth-navbar">
        <a class="navbar-brand" href="index.html">
            <img src="img/Chazel.png" id="logo" alt="Chanzel" width="111px" height="82px">
        </a>
        <button class="ar-btn btn btn-outline-secondary btn-sm ml-2" id="lang-toggle">AR</button>
    </nav>
` : `
    <nav class="navbar navbar-expand-lg">
        <a class="navbar-brand" href="index.html">
            <img src="img/Chazel.png" id="logo" alt="Chanzel" width="111px" height="82px">
        </a>

        <div class="collapse navbar-collapse" id="x">
            <ul class="navbar-nav">
                <li class="nav-item"><a class="nav-link h ${currentPage === 'index.html' ? 'active alert-link' : ''}" aria-current="page" href="index.html">HOME</a></li>
                <li class="nav-item"><a class="nav-link h ${currentPage === 'women.html' ? 'active alert-link' : ''}" href="women.html">WOMEN</a></li>
                <li class="nav-item"><a class="nav-link h ${currentPage === 'men.html' ? 'active alert-link' : ''}" href="men.html">MEN</a></li>
                <li class="nav-item"><a class="nav-link h ${currentPage === 'about.html' ? 'active alert-link' : ''}" href="about.html">ABOUT</a></li>
                <li class="nav-item"><a class="nav-link h ${currentPage === 'contact.html' ? 'active alert-link' : ''}" href="#contact">CONTACT</a></li>
            </ul>
        </div>

        <ul class="navbar-nav vv">
            <h6 class="nav-item dolar">$0.00</h6>
            <i class="fa-solid fa-cart-shopping ico-btn cart-icon"></i>
            <a id="login-btn" class="nav-link login" href="login.html">LOG IN</a>
            <a id="logout-btn" class="nav-link logout d-none" href="#">LOG OUT</a>
            <a id="profile-btn" class="nav-link profile d-none" href="profile.html">PROFILE</a>
        </ul>

        <a href="#x" data-toggle="collapse" class="navbar-toggler navbar-dark alink">
            <span class="navbar-toggler-icon"></span>
        </a>
        <button class="ar-btn btn btn-outline-secondary btn-sm ml-2" id="lang-toggle">AR</button>
    </nav>
`;

// Insert navbar
document.getElementById('navbar').innerHTML = navbarHTML;

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        if (cart.length > 0) {
            cartIcon.setAttribute('data-count', cart.length);
            cartIcon.classList.add('has-items');
        } else {
            cartIcon.removeAttribute('data-count');
            cartIcon.classList.remove('has-items');
        }
    }
}

// Update price display
function updateTotalPrice() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const dolarElement = document.querySelector('.dolar');
    if (dolarElement) {
        dolarElement.textContent = `$${total.toFixed(2)}`;
    }
}

// Cart icon click handler
document.addEventListener('DOMContentLoaded', function() {
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function() {
            window.location.href = 'cart.html';
        });
    }

    // Initial updates
    updateCartCount();
    updateTotalPrice();

    // Listen for cart changes
    window.addEventListener('storage', function(e) {
        if (e.key === 'cart') {
            updateCartCount();
            updateTotalPrice();
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
  if (localStorage.getItem('justLoggedIn')) {
    localStorage.removeItem('justLoggedIn');
    location.reload();
  }
  // Translation object
  const translations = {
    en: {
      home: 'Home',
      women: 'Women',
      men: 'Men',
      about: 'About',
      contact: 'Contact',
      profile: 'Profile',
      login: 'Login',
      logout: 'Logout',
      cart: 'Cart',
      // Add more translations as needed
      popularTshirts: 'Popular T-Shirts',
      summerCollection: 'Summer Collection',
      shopNow: 'Shop Now',
      newCollection: 'New Collection',
      beDifferent: 'Be different in your own way!',
      findStyle: 'Find your unique style.',
      products: 'Products'
    },
    ar: {
      home: 'الرئيسية',
      women: 'نساء',
      men: 'رجال',
      about: 'عن المتجر',
      contact: 'اتصل بنا',
      profile: 'الملف الشخصي',
      login: 'تسجيل الدخول',
      logout: 'تسجيل الخروج',
      cart: 'السلة',
      // Add more translations as needed
      popularTshirts: 'تي شيرتات مميزة',
      summerCollection: 'تشكيلة الصيف',
      shopNow: 'تسوق الآن',
      newCollection: 'التشكيلة الجديدة',
      beDifferent: 'كن مختلفاً بطريقتك الخاصة!',
      findStyle: 'اكتشف أسلوبك الفريد.',
      products: 'منتجات'
    }
  };

  // Function to translate the page
  function translatePage(lang) {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
      const key = element.getAttribute('data-translate');
      if (translations[lang] && translations[lang][key]) {
        if (element.tagName === 'INPUT' && element.type === 'placeholder') {
          element.placeholder = translations[lang][key];
        } else {
          element.textContent = translations[lang][key];
        }
      }
    });

    // Update document direction
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    // Update button text
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
      langToggle.textContent = lang === 'ar' ? 'EN' : 'AR';
    }

    // Store the language preference
    localStorage.setItem('lang', lang);
  }

  // Initialize language
  const savedLang = localStorage.getItem('lang') || 'en';
  translatePage(savedLang);

  // Language toggle button click handler
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', function() {
      const currentLang = localStorage.getItem('lang') || 'en';
      const newLang = currentLang === 'en' ? 'ar' : 'en';
      translatePage(newLang);
    });
  }

  // Authentication buttons logic
  if (window.firebase && firebase.auth) {
    firebase.auth().onAuthStateChanged(function(user) {
      const loginBtn = document.getElementById('login-btn');
      const logoutBtn = document.getElementById('logout-btn');
      const profileBtn = document.getElementById('profile-btn');
      if (user) {
        if (loginBtn) loginBtn.classList.add('d-none');
        if (logoutBtn) logoutBtn.classList.remove('d-none');
        if (profileBtn) profileBtn.classList.remove('d-none');
      } else {
        if (loginBtn) loginBtn.classList.remove('d-none');
        if (logoutBtn) logoutBtn.classList.add('d-none');
        if (profileBtn) profileBtn.classList.add('d-none');
      }
    });
  }
}); 
