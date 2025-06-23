import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDCkxDZH0tSd_c02dFkaEVQMpV4ZL06etU",
  authDomain: "chanzel-ecommerce.firebaseapp.com",
  projectId: "chanzel-ecommerce",
  storageBucket: "chanzel-ecommerce.appspot.com",
  messagingSenderId: "379673191328",
  appId: "1:379673191328:web:3ae431b8d0c23a4e177ac5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const categoriesContainer = document.querySelector(".categories-container");
const productsContainer = document.querySelector(".products-container");

// الفئات الخاصة بقسم النساء
const womenCategories = ["pants", "suits", "tshirts", "dress", "shoes", "bags"];

// تحميل الأزرار
function loadCategories() {
  categoriesContainer.innerHTML = "";

  womenCategories.forEach((category) => {
    const btn = document.createElement("button");
    btn.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    btn.className = "btn btn-outline-dark m-1";
    btn.dataset.category = category;

    btn.addEventListener("click", () => {
      loadProducts(category);
      document
        .querySelectorAll(".categories-container button")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });

    categoriesContainer.appendChild(btn);
  });
}

// تحميل المنتجات حسب التصنيف
async function loadProducts(category = "tshirts") {
  if (!productsContainer) return;

  productsContainer.innerHTML = `<p>Loading products...</p>`;

  try {
    const q = query(
      collection(db, "products"),
      where("gender", "==", "women"),
      where("category", "==", category)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      productsContainer.innerHTML =
        '<p class="text-muted">No products found in this category.</p>';
      return;
    }

    productsContainer.innerHTML = "";

    querySnapshot.forEach((docSnap) => {
      const product = docSnap.data();
      const id = docSnap.id;

      const productImage =
        product.mainImage ||
        (product.colors?.[0]?.image || "img/default-product.jpg");

      const colorDots =
        product.colors
          ?.map(
            (c) => `
        <span title="${c.name}" style="display:inline-block;width:15px;height:15px;border-radius:50%;background-image:url('${c.image}');background-size:cover;margin:2px;border:1px solid #ccc;"></span>
      `
          )
          .join("") || "";

      const sizes = (product.sizes || []).join(", ");

      const card = document.createElement("div");
      card.className = "card m-2";
      card.style.width = "18rem";

      card.innerHTML = `
        <img src="${productImage}" class="card-img-top" alt="${product.name}" />
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">$${product.price.toFixed(2)}</p>
          <div><strong>الألوان:</strong> ${colorDots}</div>
          <div><strong>المقاسات:</strong> ${sizes}</div>
          <a href="product.html?id=${id}" class="btn btn-outline-dark btn-sm mt-2">عرض التفاصيل</a>
        </div>
      `;

      productsContainer.appendChild(card);
    });

  } catch (error) {
    productsContainer.innerHTML = `<p class="text-danger">Error loading products: ${error.message}</p>`;
    console.error(error);
  }
}

// ✅ تحديث عداد السلة في الناف بار
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((total, item) => total + item.qty, 0);
  const cartCountSpan = document.getElementById("cartCount");
  if (cartCountSpan) cartCountSpan.textContent = count;
}

// عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
  loadCategories();
  loadProducts(womenCategories[0]);
  updateCartCount(); // 🛒
});
