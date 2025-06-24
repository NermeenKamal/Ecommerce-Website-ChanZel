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
            <a class="nav-link px-3" href="profile.html"><i class="fas fa-user-circle"></i> Profile</a>
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
  const navbarDiv = document.getElementById('navbar');
  if (navbarDiv) {
    navbarDiv.innerHTML = navbarHTML;
  }

  // Cart counter logic (reads from localStorage)
  function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
      cartCount.textContent = count;
    }
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
    if (document.getElementById('login-btn')) document.getElementById('login-btn').textContent = t.login;
    if (document.getElementById('logout-btn')) document.getElementById('logout-btn').textContent = t.logout;
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
    const notifBell = document.getElementById('notif-bell');
    if (!loginBtn || !logoutBtn) return;
    if (user) {
      loginBtn.classList.add('d-none');
      logoutBtn.classList.remove('d-none');
      if (notifBell) notifBell.classList.remove('d-none');
    } else {
      loginBtn.classList.remove('d-none');
      logoutBtn.classList.add('d-none');
      if (notifBell) notifBell.classList.add('d-none');
    }
  }
  // إضافة جرس الإشعارات للـ navbar إذا لم يكن موجودًا
  function addNotifBell() {
    if (document.getElementById('notif-bell')) return;
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;
    const bell = document.createElement('div');
    bell.innerHTML = `
      <div style="position:relative;display:inline-block;">
        <button id="notif-bell" class="btn btn-link p-0" style="font-size:1.5rem;color:#785c4a;outline:none;box-shadow:none;" title="Notifications">
          <i class="fa fa-bell"></i>
          <span id="notif-badge" style="position:absolute;top:-7px;right:-7px;background:#9c2c2c;color:#fff;border-radius:50%;font-size:0.8rem;padding:1px 6px;display:none;">0</span>
        </button>
        <div id="notif-dropdown" style="display:none;position:absolute;right:0;top:120%;background:#fff;min-width:270px;max-width:350px;box-shadow:0 4px 18px rgba(0,0,0,0.13);border-radius:10px;z-index:9999;border:1px solid #e0dfd2;max-height:350px;overflow-y:auto;"></div>
      </div>
    `;
    navLinks.insertBefore(bell, navLinks.firstChild);
  }
  addNotifBell();
  // إشعارات Firestore
  function loadNotifications(user) {
    if (!user) return;
    const notifBell = document.getElementById('notif-bell');
    const notifBadge = document.getElementById('notif-badge');
    const notifDropdown = document.getElementById('notif-dropdown');
    if (!notifBell || !notifBadge || !notifDropdown) return;
    // جلب الإشعارات من Firestore
    db.collection('notifications').where('userId', '==', user.uid).orderBy('createdAt', 'desc').limit(15).onSnapshot(snap => {
      let unread = 0;
      let html = '';
      snap.forEach(doc => {
        const n = doc.data();
        if (!n.read) unread++;
        html += `<div class="p-2 border-bottom small ${n.read ? '' : 'font-weight-bold'}" style="cursor:pointer;" data-id="${doc.id}">
          <span>${n.message}</span>
          <div style="font-size:0.85em;color:#888;">${n.createdAt && n.createdAt.toDate ? n.createdAt.toDate().toLocaleString() : ''}</div>
        </div>`;
      });
      notifBadge.textContent = unread;
      notifBadge.style.display = unread > 0 ? 'inline-block' : 'none';
      notifDropdown.innerHTML = html || '<div class="p-2 text-center text-muted">No notifications</div>';
      // عند الضغط على إشعار: اعتبره مقروء
      notifDropdown.querySelectorAll('div[data-id]').forEach(div => {
        div.onclick = function() {
          db.collection('notifications').doc(this.getAttribute('data-id')).update({read:true});
          this.classList.remove('font-weight-bold');
        };
      });
    });
    // إظهار/إخفاء القائمة
    notifBell.onclick = function(e) {
      e.stopPropagation();
      notifDropdown.style.display = notifDropdown.style.display === 'block' ? 'none' : 'block';
    };
    document.addEventListener('click', function() {
      notifDropdown.style.display = 'none';
    });
  }
  if (window.firebase && firebase.auth) {
    firebase.auth().onAuthStateChanged(function(user) {
      updateAuthButtons(user);
      loadNotifications(user);
    });
  } else {
    // fallback: show login by default
    updateAuthButtons(null);
  }
  // زر تسجيل الدخول
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    loginBtn.onclick = function() {
      window.location.href = 'login.html';
    };
  }
  // زر تسجيل الخروج
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.onclick = function() {
      if (window.firebase && firebase.auth) {
        firebase.auth().signOut().then(function() {
          window.location.reload();
        });
      } else {
        window.location.reload();
      }
    };
  }
}); 
