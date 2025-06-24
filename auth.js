// auth.js

document.addEventListener('DOMContentLoaded', function () {
  // Elements
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');

  // Show/hide login/logout based on auth state
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      loginBtn.classList.add('d-none');
      logoutBtn.classList.remove('d-none');
    } else {
      loginBtn.classList.remove('d-none');
      logoutBtn.classList.add('d-none');
    }
  });

  // زر تسجيل الدخول يوجه دائماً إلى صفحة login
  if (loginBtn) {
    loginBtn.addEventListener('click', function() {
      window.location.href = 'login.html';
    });
  }

  // زر تسجيل الخروج
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      firebase.auth().signOut().then(() => {
        window.location.href = 'index.html';
      });
    });
  }
}); 