// js/script.js
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { db } from "./firebase-config.js";

async function loadProducts(category = "tshirt") {
  const productsContainer = document.querySelector(".products-container");
  if (!productsContainer) return;

  productsContainer.innerHTML = `<p>Loading products...</p>`;

  try {
    const q = query(collection(db, "products"), where("category", "==", category));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      productsContainer.innerHTML = '<p class="text-muted">No products found in this category.</p>';
      return;
    }

    productsContainer.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const product = doc.data();

      const defaultImage =
        product.colors && product.colors.length > 0
          ? product.colors[0].image
          : "img/default-product.jpg";

      const colorsHtml = product.colors
        ? product.colors
            .map(
              (color) => `
          <button 
            type="button" 
            class="btn btn-sm m-1 color-btn"
            style="background-color:${color.name}; width:24px; height:24px; border-radius:50%; border: 1px solid #333;"
            data-img="${color.image}" title="${color.name}"
          ></button>
        `
            )
            .join("")
        : "";

      const sizesHtml = product.sizes
        ? product.sizes
            .map(
              (size) => `
          <button type="button" class="btn btn-outline-dark btn-sm mr-1">${size}</button>
        `
            )
            .join("")
        : "";

      const card = document.createElement("div");
      card.className = "card mr-2 mb-3";
      card.style.width = "18rem";
      card.innerHTML = `
        <img src="${defaultImage}" class="card-img-top product-img" alt="${product.name}" />
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">$${product.price.toFixed(2)}</p>
          <div class="mb-2 colors-container">${colorsHtml}</div>
          <div class="sizes-container mb-3">${sizesHtml}</div>
          <button class="btn btn-dark btn-sm">Shop Now</button>
        </div>
      `;

      productsContainer.appendChild(card);
    });

    // تغيير صورة المنتج عند اختيار لون
    document.querySelectorAll(".color-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const newImg = e.currentTarget.getAttribute("data-img");
        const card = e.currentTarget.closest(".card");
        const imgElem = card.querySelector(".product-img");
        if (imgElem && newImg) {
          imgElem.src = newImg;
        }
      });
    });
  } catch (error) {
    productsContainer.innerHTML = `<p class="text-danger">Error loading products: ${error.message}</p>`;
    console.error("Error:", error);
  }
}

// تحميل المنتجات عند فتح الصفحة
document.addEventListener("DOMContentLoaded", () => {
  loadProducts("tshirt"); // يمكن تغيير التصنيف حسب الحاجة
});
