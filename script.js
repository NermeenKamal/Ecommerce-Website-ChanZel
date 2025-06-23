// Global Firebase + Auth + Cart + Product Script

// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDCkxDZH0tSd_c02dFkaEVQMpV4ZL06etU",
  authDomain: "chanzel-ecommerce.firebaseapp.com",
  projectId: "chanzel-ecommerce",
  storageBucket: "chanzel-ecommerce.appspot.com",
  messagingSenderId: "379673191328",
  appId: "1:379673191328:web:3ae431b8d0c23a4e177ac5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Admin emails
const adminEmails = ["nermeenkamal92@gmail.com"];

// Translation object
const translations = {
  en: {
    nav_home: "HOME",
    nav_women: "WOMEN",
    nav_men: "MEN",
    nav_about: "ABOUT",
    nav_contact: "CONTACT",
    nav_login: "LOG IN",
    nav_logout: "LOG OUT",
    hero_women: "Women",
    hero_slogan: "Slick. Modern. <br> Awesome.",
    hero_shop_now: "Shop NOW!",
    loading_products: "Loading products...",
    summer_collection: "Summer Collection",
    winter_collection: "Winter Collection",
    popular_products: "Popular Products",
    featured_products: "Featured Products",
    men_style: "MEN STYLE",
    base_collection: "The base collection - Ideal <br>",
    every_day: "every day.",
    shop_now: "Shop NOW!",
    new_collection: "New Collection",
    be_different: "Be different in your own way!<br>",
    find_style: "Find your unique style.",
    shop_collection: "Shop Collection!",
    women_category: "WOMEN",
    men_category: "MEN",
    products: "Products",
    subscribe_title: "Subscribe To Get Offers In Your Inbox",
    subscribe_desc: "Lorem ipsum dolor sit amet, adipiscing elit sed do eiusmod condimentum<br><br>",
    footer_tshirts: "Buy T-Shirts",
    copyright: "Copyright © 2024 ChanZel By NERMEEN",
    search_products: "Search Products",
    search_placeholder: "Search for products...",
    view_details: "View Details",
    add_to_cart: "Add to Cart",
    product_added: "Product added to cart successfully!",
    admin_dashboard: "Admin Dashboard"
  },
  ar: {
    nav_home: "الرئيسية",
    nav_women: "النساء",
    nav_men: "الرجال",
    nav_about: "حول",
    nav_contact: "اتصل",
    nav_login: "تسجيل الدخول",
    nav_logout: "تسجيل الخروج",
    hero_women: "النساء",
    hero_slogan: "أنيق. عصري. <br> رائع.",
    hero_shop_now: "تسوق الآن!",
    loading_products: "جاري تحميل المنتجات...",
    summer_collection: "مجموعة الصيف",
    winter_collection: "مجموعة الشتاء",
    popular_products: "المنتجات الشائعة",
    featured_products: "المنتجات المميزة",
    men_style: "أسلوب الرجال",
    base_collection: "المجموعة الأساسية - مثالية <br>",
    every_day: "كل يوم.",
    shop_now: "تسوق الآن!",
    new_collection: "مجموعة جديدة",
    be_different: "كن مختلفاً بطريقتك الخاصة!<br>",
    find_style: "اعثر على أسلوبك الفريد.",
    shop_collection: "تسوق المجموعة!",
    women_category: "النساء",
    men_category: "الرجال",
    products: "منتجات",
    subscribe_title: "اشترك للحصول على العروض في بريدك الإلكتروني",
    subscribe_desc: "لوريم إيبسوم دولور سيت أميت، أديبيسينغ إيليت سيد دو إيوسمود كونديمنتوم<br><br>",
    footer_tshirts: "شراء القمصان",
    copyright: "حقوق الطبع والنشر © 2024 شانزيل بواسطة نرمين",
    search_products: "البحث عن المنتجات",
    search_placeholder: "البحث عن المنتجات...",
    view_details: "عرض التفاصيل",
    add_to_cart: "أضف إلى السلة",
    product_added: "تم إضافة المنتج إلى السلة بنجاح!",
    admin_dashboard: "لوحة الإدارة"
  }
};

// Current language
let currentLanguage = localStorage.getItem('language') || 'en';

// Language toggle functionality
function toggleLanguage() {
  currentLanguage = currentLanguage === 'en' ? 'ar' : 'en';
  localStorage.setItem('language', currentLanguage);
  updateLanguage();
}

// Update language on page
function updateLanguage() {
  const langButton = document.getElementById('currentLang');
  if (langButton) {
    langButton.textContent = currentLanguage.toUpperCase();
  }

  // Update HTML direction
  document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = currentLanguage;

  // Update all translatable elements
  const translatableElements = document.querySelectorAll('[data-translate]');
  translatableElements.forEach(element => {
    const key = element.getAttribute('data-translate');
    if (translations[currentLanguage] && translations[currentLanguage][key]) {
      element.innerHTML = translations[currentLanguage][key];
    }
  });

  // Update placeholder texts
  const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
  placeholderElements.forEach(element => {
    const key = element.getAttribute('data-translate-placeholder');
    if (translations[currentLanguage] && translations[currentLanguage][key]) {
      element.placeholder = translations[currentLanguage][key];
    }
  });
}

// Auth state check (Login / Logout / Admin Dashboard)
onAuthStateChanged(auth, (user) => {
  const authLink = document.getElementById("authLink");
  if (!authLink) return;

  if (user) {
    if (adminEmails.includes(user.email)) {
      authLink.textContent = translations[currentLanguage].admin_dashboard;
      authLink.href = "admin/admin-dashboard.html";
    } else {
      authLink.textContent = translations[currentLanguage].nav_logout;
      authLink.href = "#";
      authLink.addEventListener(
        "click",
        (e) => {
          e.preventDefault();
          signOut(auth).then(() => window.location.reload());
        },
        { once: true }
      );
    }
  } else {
    authLink.textContent = translations[currentLanguage].nav_login;
    authLink.href = "login.html";
  }
});

// Cart count logic
function updateCartCount(count) {
  const countElements = [
    document.getElementById("cartCount"),
    document.getElementById("navCartCount")
  ];
  countElements.forEach((el) => {
    if (el) el.textContent = count;
  });
}

function updateTotalPrice() {
  let total = 0;
  try {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.forEach(item => {
      total += (item.price || 0) * (item.qty || 1);
    });
  } catch (e) {
    total = 0;
  }
  const totalPriceElement = document.getElementById("totalPrice");
  if (totalPriceElement) {
    totalPriceElement.textContent = total.toFixed(2);
  }
}

function loadCartCount() {
  let count = 0;
  try {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    count = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  } catch (e) {
    count = 0;
  }
  updateCartCount(count);
  updateTotalPrice();
}

// Show success toast
function showSuccessToast(message) {
  const toast = document.getElementById('successToast');
  const toastMessage = document.getElementById('toastMessage');
  if (toast && toastMessage) {
    toastMessage.textContent = message;
    $(toast).toast('show');
  }
}

// Create product card HTML
function createProductCard(product, productId) {
  const defaultImage = product.colors && product.colors.length > 0 
    ? product.colors[0].image 
    : product.mainImage || "img/default-product.jpg";

  const colorsHtml = product.colors
    ? product.colors.slice(0, 3).map(color => `
        <img src="${color.image}" 
             class="color-thumbnail" 
             style="width: 20px; height: 20px; border-radius: 50%; margin-right: 3px; cursor: pointer; border: 1px solid #ddd;"
             data-img="${color.image}" 
             title="${color.name}"
             onclick="changeProductImage(this, '${defaultImage}')" />
      `).join("")
    : "";

  const sizesHtml = product.sizes
    ? product.sizes.slice(0, 5).map(size => `
        <span class="badge badge-outline-dark mr-1" style="font-size: 0.7rem;">${size}</span>
      `).join("")
    : "";

  return `
    <div class="card mr-3 mb-3 product-card" style="width: 18rem;">
      <img src="${defaultImage}" class="card-img-top product-img" alt="${product.name}" style="height: 250px; object-fit: cover;" />
      <div class="card-body">
        <h5 class="card-title">${product.name}</h5>
        <p class="card-text">$${(product.price || 0).toFixed(2)}</p>
        <div class="mb-2">
          <small class="text-muted">Colors:</small><br>
          ${colorsHtml}
        </div>
        <div class="mb-3">
          <small class="text-muted">Sizes:</small><br>
          ${sizesHtml}
        </div>
        <a href="product.html?id=${productId}" class="btn btn-dark btn-sm" data-translate="view_details">View Details</a>
      </div>
    </div>
  `;
}

// Change product image on color click
window.changeProductImage = function(colorElement, originalImage) {
  const card = colorElement.closest('.product-card');
  const imgElement = card.querySelector('.product-img');
  const newImage = colorElement.getAttribute('data-img');
  
  if (imgElement && newImage) {
    imgElement.src = newImage;
  }
  
  // Reset other color thumbnails
  const colorThumbnails = card.querySelectorAll('.color-thumbnail');
  colorThumbnails.forEach(thumb => {
    thumb.style.border = '1px solid #ddd';
  });
  
  // Highlight selected color
  colorElement.style.border = '2px solid #007bff';
};

// Load products from Firestore
async function loadProducts(season, containerId, limit = 4) {
  const container = document.getElementById(containerId);
  const loadingSpinner = document.getElementById('loadingSpinner');
  
  if (!container) return;

  // Show loading spinner
  if (loadingSpinner) loadingSpinner.style.display = 'block';
  
  container.innerHTML = `<p class="text-center w-100" data-translate="loading_products">Loading products...</p>`;

  try {
    const q = query(collection(db, "products"), where("season", "==", season));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      container.innerHTML = '<p class="text-muted text-center w-100">No products found.</p>';
      return;
    }

    container.innerHTML = "";
    let count = 0;
    const products = [];

    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, data: doc.data() });
    });

    // Shuffle products for random display
    const shuffledProducts = products.sort(() => 0.5 - Math.random());

    // Display limited number of products
    shuffledProducts.slice(0, limit).forEach(({ id, data }) => {
      const cardHtml = createProductCard(data, id);
      container.innerHTML += cardHtml;
    });

    // Update language after loading products
    updateLanguage();

  } catch (error) {
    container.innerHTML = `<p class="text-danger text-center w-100">Error loading products: ${error.message}</p>`;
    console.error("Error:", error);
  } finally {
    // Hide loading spinner
    if (loadingSpinner) loadingSpinner.style.display = 'none';
  }
}

// Load product counts for categories
async function loadProductCounts() {
  try {
    const womenQuery = query(collection(db, "products"), where("gender", "==", "women"));
    const menQuery = query(collection(db, "products"), where("gender", "==", "men"));
    
    const [womenSnapshot, menSnapshot] = await Promise.all([
      getDocs(womenQuery),
      getDocs(menQuery)
    ]);

    const womenCount = womenSnapshot.size;
    const menCount = menSnapshot.size;

    const womenCountElement = document.getElementById('womenProductCount');
    const menCountElement = document.getElementById('menProductCount');

    if (womenCountElement) womenCountElement.textContent = womenCount;
    if (menCountElement) menCountElement.textContent = menCount;

  } catch (error) {
    console.error("Error loading product counts:", error);
  }
}

// Search functionality
async function searchProducts(searchTerm) {
  const searchResults = document.getElementById('searchResults');
  if (!searchResults) return;

  if (!searchTerm.trim()) {
    searchResults.innerHTML = '';
    return;
  }

  searchResults.innerHTML = '<p>Searching...</p>';

  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const results = [];

    querySnapshot.forEach((doc) => {
      const product = doc.data();
      if (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        results.push({ id: doc.id, data: product });
      }
    });

    if (results.length === 0) {
      searchResults.innerHTML = '<p class="text-muted">No products found.</p>';
      return;
    }

    searchResults.innerHTML = results.map(({ id, data }) => `
      <div class="search-result-item mb-2 p-2 border rounded">
        <div class="d-flex align-items-center">
          <img src="${data.mainImage || 'img/default-product.jpg'}" 
               alt="${data.name}" 
               style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">
          <div>
            <h6 class="mb-1">${data.name}</h6>
            <p class="mb-1 text-muted">$${(data.price || 0).toFixed(2)}</p>
            <a href="product.html?id=${id}" class="btn btn-sm btn-primary">View Details</a>
          </div>
        </div>
      </div>
    `).join('');

  } catch (error) {
    searchResults.innerHTML = '<p class="text-danger">Error searching products.</p>';
    console.error("Error searching products:", error);
  }
}

// Dark mode toggle (placeholder function)
window.darkmode = function() {
  // Placeholder for dark mode functionality
  console.log("Dark mode toggle clicked");
};

// Initialize page
window.addEventListener("load", () => {
  // Set initial language
  updateLanguage();
  
  // Load cart count
  loadCartCount();
  
  // Load products for homepage
  if (document.getElementById('summerProducts')) {
    loadProducts('summer', 'summerProducts', 4);
  }
  if (document.getElementById('winterProducts')) {
    loadProducts('winter', 'winterProducts', 4);
  }
  
  // Load product counts
  loadProductCounts();
  
  // Setup language toggle
  const languageToggle = document.getElementById('languageToggle');
  if (languageToggle) {
    languageToggle.addEventListener('click', toggleLanguage);
  }
  
  // Setup search functionality
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        searchProducts(e.target.value);
      }, 300);
    });
  }
});

// Export functions for use in other scripts
window.updateCartCount = updateCartCount;
window.loadCartCount = loadCartCount;
window.showSuccessToast = showSuccessToast;
window.updateLanguage = updateLanguage;
window.translations = translations;
window.currentLanguage = currentLanguage;







// // Global Firebase + Auth + Cart + Product Script

// // Firebase imports
// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
// import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
// import {
//   getFirestore,
//   collection,
//   getDocs,
//   query,
//   where
// } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// // Firebase Config
// const firebaseConfig = {
//   apiKey: "AIzaSyDCkxDZH0tSd_c02dFkaEVQMpV4ZL06etU",
//   authDomain: "chanzel-ecommerce.firebaseapp.com",
//   projectId: "chanzel-ecommerce",
//   storageBucket: "chanzel-ecommerce.appspot.com",
//   messagingSenderId: "379673191328",
//   appId: "1:379673191328:web:3ae431b8d0c23a4e177ac5"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

// // Admin emails
// const adminEmails = ["admin@example.com"];

// // Auth state check (Login / Logout / Admin Dashboard)
// onAuthStateChanged(auth, (user) => {
//   const authLink = document.getElementById("authLink");
//   if (!authLink) return;

//   if (user) {
//     if (adminEmails.includes(user.email)) {
//       authLink.textContent = "Admin Dashboard";
//       authLink.href = "admin-dashboard.html";
//     } else {
//       authLink.textContent = "Logout";
//       authLink.href = "#";
//       authLink.addEventListener(
//         "click",
//         (e) => {
//           e.preventDefault();
//           signOut(auth).then(() => window.location.reload());
//         },
//         { once: true }
//       );
//     }
//   } else {
//     authLink.textContent = "LOG IN";
//     authLink.href = "login.html";
//   }
// });

// // Cart count logic
// function updateCartCount(count) {
//   const countElements = [
//     document.getElementById("cartCount"),
//     document.getElementById("navCartCount")
//   ];
//   countElements.forEach((el) => {
//     if (el) el.textContent = count;
//   });
// }

// function loadCartCount() {
//   let count = 0;
//   try {
//     const cart = JSON.parse(localStorage.getItem("cart"));
//     if (cart && Array.isArray(cart)) count = cart.length;
//   } catch (e) {
//     count = 0;
//   }
//   updateCartCount(count);
// }

// window.addEventListener("load", () => {
//   loadCartCount();
// });

// // Load products from Firestore
// taskLoadProducts(); // Manual call for use in dynamic pages

// export async function taskLoadProducts(category = "tshirt") {
//   const productsContainer = document.querySelector(".products-container");
//   if (!productsContainer) return;

//   productsContainer.innerHTML = `<p>Loading products...</p>`;

//   try {
//     const q = query(collection(db, "products"), where("category", "==", category));
//     const querySnapshot = await getDocs(q);

//     if (querySnapshot.empty) {
//       productsContainer.innerHTML = '<p class="text-muted">No products found in this category.</p>';
//       return;
//     }

//     productsContainer.innerHTML = "";

//     querySnapshot.forEach((doc) => {
//       const product = doc.data();
//       const defaultImage =
//         product.colors && product.colors.length > 0
//           ? product.colors[0].image
//           : "img/default-product.jpg";

//       const colorsHtml = product.colors
//         ? product.colors
//             .map(
//               (color) => `
//           <button 
//             type="button" 
//             class="btn btn-sm m-1 color-btn"
//             style="background-color:${color.name}; width:24px; height:24px; border-radius:50%; border: 1px solid #333;"
//             data-img="${color.image}" title="${color.name}"
//           ></button>
//         `
//             )
//             .join("")
//         : "";

//       const sizesHtml = product.sizes
//         ? product.sizes
//             .map(
//               (size) => `
//           <button type="button" class="btn btn-outline-dark btn-sm mr-1">${size}</button>
//         `
//             )
//             .join("")
//         : "";

//       const card = document.createElement("div");
//       card.className = "card mr-2 mb-3";
//       card.style.width = "18rem";
//       card.innerHTML = `
//         <img src="${defaultImage}" class="card-img-top product-img" alt="${product.name}" />
//         <div class="card-body">
//           <h5 class="card-title">${product.name}</h5>
//           <p class="card-text">$${product.price.toFixed(2)}</p>
//           <div class="mb-2 colors-container">${colorsHtml}</div>
//           <div class="sizes-container mb-3">${sizesHtml}</div>
//           <button class="btn btn-dark btn-sm">Shop Now</button>
//         </div>
//       `;

//       productsContainer.appendChild(card);
//     });

//     // Change image when color is selected
//     document.querySelectorAll(".color-btn").forEach((btn) => {
//       btn.addEventListener("click", (e) => {
//         const newImg = e.currentTarget.getAttribute("data-img");
//         const card = e.currentTarget.closest(".card");
//         const imgElem = card.querySelector(".product-img");
//         if (imgElem && newImg) {
//           imgElem.src = newImg;
//         }
//       });
//     });
//   } catch (error) {
//     productsContainer.innerHTML = `<p class="text-danger">Error loading products: ${error.message}</p>`;
//     console.error("Error:", error);
//   }
// }
