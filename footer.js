// footer.js

document.addEventListener('DOMContentLoaded', function () {
  const footerHTML = `
  <footer class="bg-dark text-light pt-4 mt-5">
    <div class="container">
      <div class="row">
        <div class="col-md-3 mb-3">
          <h5>About ChanZel</h5>
          <p>ChanZel is your go-to destination for the latest fashion trends for men and women. Fast delivery, great support, and a vision for style!</p>
        </div>
        <div class="col-md-2 mb-3">
          <h5>Quick Links</h5>
          <ul class="list-unstyled">
            <li><a href="index.html" class="text-light">Home</a></li>
            <li><a href="women.html" class="text-light">Women</a></li>
            <li><a href="men.html" class="text-light">Men</a></li>
            <li><a href="about.html" class="text-light">About</a></li>
            <li><a href="#" class="text-light">Contact</a></li>
          </ul>
        </div>
        <div class="col-md-3 mb-3">
          <h5>Subscribe</h5>
          <form id="subscribe-form">
            <div class="input-group">
              <input type="email" class="form-control" placeholder="Your email" required>
              <div class="input-group-append">
                <button class="btn btn-primary" type="submit">Subscribe</button>
              </div>
            </div>
          </form>
        </div>
        <div class="col-md-2 mb-3">
          <h5>Contact</h5>
          <ul class="list-unstyled">
            <li><i class="fas fa-envelope"></i> support@chanzel.com</li>
            <li><i class="fas fa-phone"></i> +123 456 7890</li>
            <li><i class="fas fa-map-marker-alt"></i> Cairo, Egypt</li>
          </ul>
        </div>
        <div class="col-md-2 mb-3">
          <h5>Follow Us</h5>
          <a href="#" class="text-light mr-2"><i class="fab fa-facebook fa-lg"></i></a>
          <a href="#" class="text-light mr-2"><i class="fab fa-instagram fa-lg"></i></a>
          <a href="#" class="text-light mr-2"><i class="fab fa-twitter fa-lg"></i></a>
          <a href="#" class="text-light"><i class="fab fa-youtube fa-lg"></i></a>
        </div>
      </div>
      <div class="text-center py-3 border-top border-secondary mt-3">
        &copy; 2024 ChanZel. All rights reserved.
      </div>
    </div>
  </footer>
  `;
  document.getElementById('footer').innerHTML = footerHTML;

  // Subscribe form placeholder
  document.getElementById('subscribe-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Subscription feature coming soon!');
  });
});

// Translation object (should match navbar.js)
const translations = {
  en: {
    aboutChanzel: 'About ChanZel', aboutText: 'ChanZel is your go-to destination for the latest fashion trends for men and women. Fast delivery, great support, and a vision for style!', quickLinks: 'Quick Links', home: 'Home', women: 'Women', men: 'Men', about: 'About', contact: 'Contact', subscribeTitle: 'Subscribe', subscribe: 'Subscribe', email: 'Your email', contactTitle: 'Contact', follow: 'Follow Us',
  },
  ar: {
    aboutChanzel: 'عن ChanZel', aboutText: 'ChanZel هو وجهتك لأحدث صيحات الموضة للرجال والنساء. توصيل سريع، دعم ممتاز، ورؤية للأناقة!', quickLinks: 'روابط سريعة', home: 'الرئيسية', women: 'نساء', men: 'رجال', about: 'عن المتجر', contact: 'اتصل بنا', subscribeTitle: 'اشترك', subscribe: 'اشترك', email: 'بريدك الإلكتروني', contactTitle: 'تواصل', follow: 'تابعنا',
  }
};

function translateFooter(lang) {
  document.querySelector('#footer h5').textContent = translations[lang].aboutChanzel;
  document.querySelector('#footer p').textContent = translations[lang].aboutText;
  document.querySelectorAll('#footer h5')[1].textContent = translations[lang].quickLinks;
  const quickLinks = document.querySelectorAll('#footer .list-unstyled')[0].children;
  quickLinks[0].querySelector('a').textContent = translations[lang].home;
  quickLinks[1].querySelector('a').textContent = translations[lang].women;
  quickLinks[2].querySelector('a').textContent = translations[lang].men;
  quickLinks[3].querySelector('a').textContent = translations[lang].about;
  quickLinks[4].querySelector('a').textContent = translations[lang].contact;
  document.querySelectorAll('#footer h5')[2].textContent = translations[lang].subscribeTitle;
  document.querySelector('#subscribe-form button').textContent = translations[lang].subscribe;
  document.querySelector('#subscribe-form input').placeholder = translations[lang].email;
  document.querySelectorAll('#footer h5')[3].textContent = translations[lang].contactTitle;
  document.querySelectorAll('#footer h5')[4].textContent = translations[lang].follow;
}

// On load, set language from localStorage or default
const savedLang = localStorage.getItem('lang') || (navigator.language.startsWith('ar') ? 'ar' : 'en');
translateFooter(savedLang);

window.addEventListener('storage', function() {
  const lang = localStorage.getItem('lang') || 'en';
  translateFooter(lang);
}); 