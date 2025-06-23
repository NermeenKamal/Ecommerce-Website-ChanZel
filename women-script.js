// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// تهيئة Firebase مباشرة هنا
const firebaseConfig = {
  apiKey: "AIzaSyDCkxDZH0tSd_c02dFkaEVQMpV4ZL06etU",
  authDomain: "chanzel-ecommerce.firebaseapp.com",
  projectId: "chanzel-ecommerce",
  storageBucket: "chanzel-ecommerce.appspot.com",
  messagingSenderId: "379673191328",
  appId: "1:379673191328:web:3ae431b8d0c23a4e177ac5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// باقي الكود لتحميل التصنيفات والمنتجات

const categoriesContainer = document.querySelector(".categories-container");
const productsContainer = document.querySelector(".products-container");

const womenCategories = ["pants", "suits", "tshirts", "dress", "shoes", "bags"];

function loadCategories() {
  categoriesContainer.innerHTML = "";

  womenCategories.forEach(category => {
    const btn = document.createElement("button");
    btn.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    btn.className = "btn btn-outline-dark m-1";
    btn.dataset.category = category;

    btn.addEventListener("click", () => {
      loadProducts(category);
      document.querySelectorAll(".categories-container button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });

    categoriesContainer.appendChild(btn);
  });
}

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
      productsContainer.innerHTML = '<p class="text-muted">No products found in this category.</p>';
      return;
    }

    productsContainer.innerHTML = "";

    querySnapshot.forEach(docSnap => {
      const product = docSnap.data();

      const card = document.createElement("div");
      card.className = "card m-2";
      card.style.width = "18rem";

      card.innerHTML = `
        <img src="${product.image}" class="card-img-top" alt="${product.name}" />
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">$${product.price.toFixed(2)}</p>
          <button class="btn btn-dark btn-sm">Shop Now</button>
        </div>
      `;

      productsContainer.appendChild(card);
    });

  } catch (error) {
    productsContainer.innerHTML = `<p class="text-danger">Error loading products: ${error.message}</p>`;
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadCategories();
  loadProducts(womenCategories[0]);
});
