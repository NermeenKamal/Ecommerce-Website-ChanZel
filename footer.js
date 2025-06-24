// footer.js

document.addEventListener('DOMContentLoaded', function () {
  const footerHTML = `
  <footer class="bg-dark text-light pt-5 pb-3 mt-5 animate__animated animate__fadeInUp">
    <div class="container">
      <div class="row gy-4">
        <div class="col-md-3">
          <h5 class="fw-bold mb-3">About ChanZel</h5>
          <p class="small">ChanZel is your go-to destination for the latest fashion trends for men and women. Fast delivery, great support, and a vision for style!</p>
        </div>
        <div class="col-md-2">
          <h5 class="fw-bold mb-3">Quick Links</h5>
          <ul class="list-unstyled">
            <li><a href="index.html" class="text-light text-decoration-none">Home</a></li>
            <li><a href="women.html" class="text-light text-decoration-none">Women</a></li>
            <li><a href="men.html" class="text-light text-decoration-none">Men</a></li>
            <li><a href="about.html" class="text-light text-decoration-none">About</a></li>
            <li><a href="#" class="text-light text-decoration-none">Contact</a></li>
          </ul>
        </div>
        <div class="col-md-3">
          <h5 class="fw-bold mb-3">Subscribe</h5>
          <form id="subscribe-form">
            <div class="input-group">
              <input type="email" class="form-control" placeholder="Your email" required>
              <button class="btn btn-primary" type="submit">Subscribe</button>
            </div>
          </form>
        </div>
        <div class="col-md-2">
          <h5 class="fw-bold mb-3">Contact</h5>
          <ul class="list-unstyled small">
            <li><i class="fas fa-envelope me-2"></i> support@chanzel.com</li>
            <li><i class="fas fa-phone me-2"></i> +123 456 7890</li>
            <li><i class="fas fa-map-marker-alt me-2"></i> Cairo, Egypt</li>
          </ul>
        </div>
        <div class="col-md-2">
          <h5 class="fw-bold mb-3">Follow Us</h5>
          <div class="d-flex gap-2">
            <a href="#" class="text-light"><i class="fab fa-facebook fa-lg"></i></a>
            <a href="#" class="text-light"><i class="fab fa-instagram fa-lg"></i></a>
            <a href="#" class="text-light"><i class="fab fa-twitter fa-lg"></i></a>
            <a href="#" class="text-light"><i class="fab fa-youtube fa-lg"></i></a>
          </div>
        </div>
      </div>
      <div class="text-center py-3 border-top border-secondary mt-4 small">
        &copy; 2024 ChanZel. All rights reserved.
      </div>
    </div>
  </footer>
  `;
  const footerDiv = document.getElementById('footer');
  if (footerDiv) {
    footerDiv.innerHTML = footerHTML;
  }

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
  if (document.querySelector('#footer h5'))
    document.querySelector('#footer h5').textContent = translations[lang].aboutChanzel;
  if (document.querySelector('#footer p'))
    document.querySelector('#footer p').textContent = translations[lang].aboutText;
  if (document.querySelectorAll('#footer h5')[1])
    document.querySelectorAll('#footer h5')[1].textContent = translations[lang].quickLinks;
  const quickLinks = document.querySelectorAll('#footer .list-unstyled')[0]?.children;
  if (quickLinks && quickLinks[0]) quickLinks[0].querySelector('a').textContent = translations[lang].home;
  if (quickLinks && quickLinks[1]) quickLinks[1].querySelector('a').textContent = translations[lang].women;
  if (quickLinks && quickLinks[2]) quickLinks[2].querySelector('a').textContent = translations[lang].men;
  if (quickLinks && quickLinks[3]) quickLinks[3].querySelector('a').textContent = translations[lang].about;
  if (quickLinks && quickLinks[4]) quickLinks[4].querySelector('a').textContent = translations[lang].contact;
  if (document.querySelectorAll('#footer h5')[2])
    document.querySelectorAll('#footer h5')[2].textContent = translations[lang].subscribeTitle;
  if (document.querySelector('#subscribe-form button'))
    document.querySelector('#subscribe-form button').textContent = translations[lang].subscribe;
  if (document.querySelector('#subscribe-form input'))
    document.querySelector('#subscribe-form input').placeholder = translations[lang].email;
  if (document.querySelectorAll('#footer h5')[3])
    document.querySelectorAll('#footer h5')[3].textContent = translations[lang].contactTitle;
  if (document.querySelectorAll('#footer h5')[4])
    document.querySelectorAll('#footer h5')[4].textContent = translations[lang].follow;
}

// On load, set language from localStorage or default
const savedLang = localStorage.getItem('lang') || (navigator.language.startsWith('ar') ? 'ar' : 'en');
translateFooter(savedLang);

window.addEventListener('storage', function() {
  const lang = localStorage.getItem('lang') || 'en';
  translateFooter(lang);
}); 
