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

  // Login logic (simple prompt for demo)
  loginBtn.addEventListener('click', function() {
    const email = prompt('Enter your email:');
    const password = prompt('Enter your password:');
    if (!email || !password) return;
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user.email === 'nermeenkamal92@gmail.com') {
          window.location.href = 'Admin Dashboard.html';
        } else {
          window.location.href = 'index.html';
        }
      })
      .catch((error) => {
        alert('Login failed: ' + error.message);
      });
  });

  // Logout logic
  logoutBtn.addEventListener('click', function() {
    firebase.auth().signOut().then(() => {
      window.location.href = 'index.html';
    });
  });
}); 