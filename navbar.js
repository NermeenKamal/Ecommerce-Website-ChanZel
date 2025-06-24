// navbar.js

document.addEventListener('DOMContentLoaded', function () {
  const navbarHTML = `
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top animate__animated animate__fadeInDown" style="z-index:1000;">
    <div class="container-fluid">
      <a class="navbar-brand d-flex align-items-center p-0" href="index.html">
        <img src="img/Chazel.png" width="60" height="60" alt="ChanZel" style="object-fit:contain;">
      </a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item"><a class="nav-link" href="index.html" data-translate="home">Home</a></li>
          <li class="nav-item"><a class="nav-link" href="women.html" data-translate="women">Women</a></li>
          <li class="nav-item"><a class="nav-link" href="men.html" data-translate="men">Men</a></li>
          <li class="nav-item"><a class="nav-link" href="about.html" data-translate="about">About</a></li>
          <li class="nav-item"><a class="nav-link" href="#contact" data-translate="contact">Contact</a></li>
        </ul>
        <ul class="navbar-nav ms-auto align-items-center">
          <li class="nav-item">
            <a class="nav-link position-relative" href="cart.html">
              <i class="fas fa-shopping-cart"></i>
              <span id="cart-count" class="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-pill">0</span>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="profile.html"><i class="fas fa-user-circle"></i> <span data-translate="profile">Profile</span></a>
          </li>
          <li class="nav-item">
            <button id="lang-toggle" class="btn btn-outline-secondary btn-sm">AR</button>
          </li>
          <li class="nav-item">
            <button id="login-btn" class="btn btn-primary btn-sm" data-translate="login">Login</button>
            <button id="logout-btn" class="btn btn-danger btn-sm d-none" data-translate="logout">Logout</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  `;
  
  const navbarDiv = document.getElementById('navbar');
  if (navbarDiv) {
    navbarDiv.innerHTML = navbarHTML;
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

  // Cart counter logic
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
      cartCount.textContent = count;
    }
  }
  updateCartCount();
  window.addEventListener('storage', updateCartCount);

  // Authentication buttons logic
  function updateAuthButtons(user) {
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    if (!loginBtn || !logoutBtn) return;
    
    if (user) {
      loginBtn.classList.add('d-none');
      logoutBtn.classList.remove('d-none');
    } else {
      loginBtn.classList.remove('d-none');
      logoutBtn.classList.add('d-none');
    }
  }

  // Login button click handler
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    loginBtn.onclick = function() {
      window.location.href = 'login.html';
    };
  }

  // Logout button click handler
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.onclick = function() {
      if (window.firebase && firebase.auth) {
        firebase.auth().signOut().then(function() {
          window.location.href = 'index.html';
        });
      }
    };
  }

  // Initialize auth state
  if (window.firebase && firebase.auth) {
    firebase.auth().onAuthStateChanged(updateAuthButtons);
  } else {
    updateAuthButtons(null);
  }
}); 
