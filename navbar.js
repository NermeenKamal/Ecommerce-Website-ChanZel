// navbar.js

document.addEventListener('DOMContentLoaded', function () {
  const navbarHTML = `
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top animate__animated animate__fadeInDown" style="z-index:1000;">
    <div class="container-fluid">
      <a class="navbar-brand d-flex align-items-center p-0" href="index.html">
        <img src="img/Chazel.png" width="60" height="60" alt="ChanZel" style="object-fit:contain;">
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0 gap-3">
          <li class="nav-item"><a class="nav-link px-3" href="index.html">Home</a></li>
          <li class="nav-item"><a class="nav-link px-3" href="women.html">Women</a></li>
          <li class="nav-item"><a class="nav-link px-3" href="men.html">Men</a></li>
          <li class="nav-item"><a class="nav-link px-3" href="about.html">About</a></li>
          <li class="nav-item"><a class="nav-link px-3" href="#">Contact</a></li>
        </ul>
        <ul class="navbar-nav ms-auto align-items-center gap-3">
          <li class="nav-item">
            <a class="nav-link position-relative px-3" href="cart.html">
              <i class="fas fa-shopping-cart fa-lg"></i>
              <span id="cart-count" class="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-pill">0</span>
            </a>
          </li>
          <li class="nav-item">
            <button id="lang-toggle" class="btn btn-outline-secondary btn-sm px-3">AR</button>
          </li>
          <li class="nav-item">
            <button id="login-btn" class="btn btn-primary btn-sm px-3">Login</button>
            <button id="logout-btn" class="btn btn-danger btn-sm d-none px-3">Logout</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  `;
  document.getElementById('navbar').innerHTML = navbarHTML;

  // Cart counter logic (reads from localStorage)
  function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    document.getElementById('cart-count').textContent = count;
  }
  updateCartCount();
  window.addEventListener('storage', updateCartCount);

  // Translation object
  const translations = {
    en: {
      home: 'Home', women: 'Women', men: 'Men', about: 'About', contact: 'Contact', login: 'Login', logout: 'Logout', cart: 'Cart',
    },
    ar: {
      home: 'الرئيسية', women: 'نساء', men: 'رجال', about: 'عن المتجر', contact: 'اتصل بنا', login: 'تسجيل الدخول', logout: 'تسجيل الخروج', cart: 'السلة',
    }
  };
  function translateNavbar(lang) {
    const t = translations[lang];
    const navLinks = document.querySelectorAll('.navbar-nav.me-auto .nav-link');
    if (navLinks.length >= 5) {
      navLinks[0].textContent = t.home;
      navLinks[1].textContent = t.women;
      navLinks[2].textContent = t.men;
      navLinks[3].textContent = t.about;
      navLinks[4].textContent = t.contact;
    }
    document.getElementById('login-btn').textContent = t.login;
    document.getElementById('logout-btn').textContent = t.logout;
  }

  // Language toggle logic
  function setLanguage(lang) {
    localStorage.setItem('lang', lang);
    if (lang === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.getElementById('lang-toggle').textContent = 'EN';
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.getElementById('lang-toggle').textContent = 'AR';
    }
  }
  const savedLang = localStorage.getItem('lang') || (navigator.language.startsWith('ar') ? 'ar' : 'en');
  setLanguage(savedLang);
  translateNavbar(savedLang);
  document.getElementById('lang-toggle').addEventListener('click', function() {
    const currentLang = localStorage.getItem('lang') || 'en';
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
    translateNavbar(newLang);
    location.reload();
  });

  // زر الدخول والخروج حسب حالة المستخدم
  function updateAuthButtons(user) {
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    if (user) {
      loginBtn.classList.add('d-none');
      logoutBtn.classList.remove('d-none');
    } else {
      loginBtn.classList.remove('d-none');
      logoutBtn.classList.add('d-none');
    }
  }
  // Firebase Auth listener
  if (window.firebase && firebase.auth) {
    firebase.auth().onAuthStateChanged(function(user) {
      updateAuthButtons(user);
    });
  } else {
    // fallback: show login by default
    updateAuthButtons(null);
  }
  // زر تسجيل الدخول
  document.getElementById('login-btn').onclick = function() {
    window.location.href = 'login.html';
  };
  // زر تسجيل الخروج
  document.getElementById('logout-btn').onclick = function() {
    if (window.firebase && firebase.auth) {
      firebase.auth().signOut().then(function() {
        window.location.reload();
      });
    } else {
      window.location.reload();
    }
  };
}); 