// navbar.js

document.addEventListener('DOMContentLoaded', function () {
  const navbarHTML = `
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="index.html">
      <img src="img/Chazel.png" width="40" height="40" alt="ChanZel" class="d-inline-block align-top">
      ChanZel
    </a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
        <li class="nav-item"><a class="nav-link" href="women.html">Women</a></li>
        <li class="nav-item"><a class="nav-link" href="men.html">Men</a></li>
        <li class="nav-item"><a class="nav-link" href="about.html">About</a></li>
        <li class="nav-item"><a class="nav-link" href="#">Contact</a></li>
      </ul>
      <ul class="navbar-nav ml-auto align-items-center">
        <li class="nav-item mr-3">
          <a class="nav-link position-relative" href="cart.html">
            <i class="fas fa-shopping-cart"></i>
            <span id="cart-count" class="badge badge-danger position-absolute" style="top:0;right:0;">0</span>
          </a>
        </li>
        <li class="nav-item mr-3">
          <button id="lang-toggle" class="btn btn-outline-secondary btn-sm">AR</button>
        </li>
        <li class="nav-item">
          <button id="login-btn" class="btn btn-primary btn-sm">Login</button>
          <button id="logout-btn" class="btn btn-danger btn-sm d-none">Logout</button>
        </li>
      </ul>
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
      home: 'Home', women: 'Women', men: 'Men', about: 'About', contact: 'Contact', cart: 'Cart', login: 'Login', logout: 'Logout', subscribe: 'Subscribe', email: 'Your email', follow: 'Follow Us', quickLinks: 'Quick Links', aboutChanzel: 'About ChanZel', subscribeTitle: 'Subscribe', contactTitle: 'Contact', aboutText: 'ChanZel is your go-to destination for the latest fashion trends for men and women. Fast delivery, great support, and a vision for style!',
    },
    ar: {
      home: 'الرئيسية', women: 'نساء', men: 'رجال', about: 'عن المتجر', contact: 'اتصل بنا', cart: 'السلة', login: 'تسجيل الدخول', logout: 'تسجيل الخروج', subscribe: 'اشترك', email: 'بريدك الإلكتروني', follow: 'تابعنا', quickLinks: 'روابط سريعة', aboutChanzel: 'عن ChanZel', subscribeTitle: 'اشترك', contactTitle: 'تواصل', aboutText: 'ChanZel هو وجهتك لأحدث صيحات الموضة للرجال والنساء. توصيل سريع، دعم ممتاز، ورؤية للأناقة!'
    }
  };

  function translateNavbar(lang) {
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.textContent.trim() === 'Home' || link.textContent.trim() === 'الرئيسية') link.textContent = translations[lang].home;
      if (link.textContent.trim() === 'Women' || link.textContent.trim() === 'نساء') link.textContent = translations[lang].women;
      if (link.textContent.trim() === 'Men' || link.textContent.trim() === 'رجال') link.textContent = translations[lang].men;
      if (link.textContent.trim() === 'About' || link.textContent.trim() === 'عن المتجر') link.textContent = translations[lang].about;
      if (link.textContent.trim() === 'Contact' || link.textContent.trim() === 'اتصل بنا') link.textContent = translations[lang].contact;
    });
    document.getElementById('login-btn').textContent = translations[lang].login;
    document.getElementById('logout-btn').textContent = translations[lang].logout;
  }

  // On load, set language from localStorage or default
  const savedLang = localStorage.getItem('lang') || (navigator.language.startsWith('ar') ? 'ar' : 'en');
  setLanguage(savedLang);

  document.getElementById('lang-toggle').addEventListener('click', function() {
    const currentLang = localStorage.getItem('lang') || 'en';
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
    setTimeout(() => translateNavbar(newLang), 100); // re-translate after reload
  });

  // Login/Logout placeholder
  document.getElementById('login-btn').addEventListener('click', function() {
    // TODO: Implement login logic
    alert('Login coming soon!');
  });
  document.getElementById('logout-btn').addEventListener('click', function() {
    // TODO: Implement logout logic
    alert('Logout coming soon!');
  });
}); 