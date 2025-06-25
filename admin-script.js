// admin-script.js

// Use Firebase v9 compat mode instead of v10 ES6 modules
// This ensures compatibility with other files that use Firebase v9

// Use the existing Firebase instance from firebase-init.js
let db;
if (typeof window.db !== 'undefined') {
    db = window.db;
} else if (typeof firebase !== 'undefined' && firebase.firestore) {
    db = firebase.firestore();
} else {
    console.error('Firebase Firestore not available');
    // Create a mock db for fallback
    db = {
        collection: () => ({
            add: () => Promise.resolve({ id: 'mock-id' }),
            get: () => Promise.resolve({ docs: [] }),
            where: () => ({ where: () => ({ limit: () => ({ get: () => Promise.resolve({ docs: [] }) }) }) }),
            doc: () => ({ 
                get: () => Promise.resolve({ exists: false, data: () => ({}) }),
                update: () => Promise.resolve(),
                delete: () => Promise.resolve()
            })
        })
    };
}

// 1. إعداد كائن التصنيفات متعدد اللغات
const categoriesByLang = {
  en: {
    women: ["Dress", "Pants", "T-shirt", "Bags", "Suits", "Shoes"],
    men: ["Hats", "Pants", "T-shirt", "Watches", "Suits", "Shoes"]
  },
  ar: {
    women: ["فساتين", "بنطلونات", "تيشيرت", "شنط", "بدل", "أحذية"],
    men: ["قبعات", "بنطلونات", "تيشيرت", "ساعات", "بدل", "أحذية"]
  }
};

// Helper: upload image to Cloudinary
async function uploadImage(imageFile) {
    if (!imageFile || !imageFile.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return '';
    }
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "upload_preset");
    const res = await fetch("https://api.cloudinary.com/v1_1/dqgkjyaqz/image/upload", {
        method: "POST",
        body: formData
    });
    const data = await res.json();
    if (!data.secure_url) {
        alert('Image upload failed. Please check your Cloudinary preset and try again.');
        return '';
    }
    return data.secure_url;
}

// Helper to get current language
function getCurrentLang() {
  return localStorage.getItem('lang') || (navigator.language.startsWith('ar') ? 'ar' : 'en');
}

// Helper to get dashboard translations
function getDashboardT(lang) {
  if (window.dashboardTranslations) return window.dashboardTranslations[lang];
  // fallback (should not happen)
  return {
    name: 'Name',
    price: 'Price',
    stock: 'Stock',
    mainImage: 'Main Image',
    images: 'Images',
    gender: 'Gender',
    category: 'Category',
    colors: 'Colors',
    sizes: 'Sizes',
    select: 'Select',
    addColor: 'Add Color',
    colorName: 'Color name',
    actions: 'Actions',
    edit: 'Edit',
    delete: 'Delete',
    // أضف أي مفاتيح أخرى تستخدمها في الفورم هنا
  };
}

// All DOM-dependent code inside DOMContentLoaded
let genderSelect, categorySelect, colorsList, form;
document.addEventListener('DOMContentLoaded', function() {
  genderSelect = document.getElementById('gender');
  categorySelect = document.getElementById('category');
  colorsList = document.getElementById('colors-list');
  form = document.getElementById("addProductForm");

function buildGenderAndCategorySelects() {
  const lang = getCurrentLang();
  const t = getDashboardT(lang);
  genderSelect.innerHTML = '';
  const optSelect = document.createElement('option');
  optSelect.value = '';
  optSelect.textContent = t.select;
  genderSelect.appendChild(optSelect);
  const optWomen = document.createElement('option');
  optWomen.value = 'women';
  optWomen.textContent = t.women;
  genderSelect.appendChild(optWomen);
  const optMen = document.createElement('option');
  optMen.value = 'men';
  optMen.textContent = t.men;
  genderSelect.appendChild(optMen);
  if (!genderSelect.value || genderSelect.value === '') {
    genderSelect.value = 'women';
  }
  buildCategoryOptions();
}
function buildCategoryOptions() {
  const lang = getCurrentLang();
  const t = getDashboardT(lang);
  const gender = genderSelect.value;
  categorySelect.innerHTML = '';
  const optSelect = document.createElement('option');
  optSelect.value = '';
  optSelect.textContent = t.select;
  categorySelect.appendChild(optSelect);
  if (gender && categoriesByLang[lang][gender]) {
    categoriesByLang[lang][gender].forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      categorySelect.appendChild(opt);
    });
  }
}
function bindAddColorBtn() {
  const btn = document.getElementById('add-color-btn');
  if (btn) {
    btn.onclick = function() {
      colorsList.appendChild(createColorRow());
    };
  }
}
function createColorRow(name = '', imageUrl = '', file = null) {
  const lang = getCurrentLang();
  const t = getDashboardT(lang);
  const row = document.createElement('div');
  row.className = 'd-flex align-items-center mb-2 color-row';
  row.innerHTML = `
    <input type="text" class="form-control form-control-sm mr-2 color-name" placeholder="${t.colorName}" value="${name}" style="max-width:120px;">
    <input type="file" accept="image/*" class="form-control-file form-control-sm mr-2 color-image">
    <img src="${imageUrl}" class="product-img-thumb mr-2 d-none" style="width:36px;height:36px;" alt="color-img">
    <button type="button" class="btn btn-danger btn-sm remove-color-btn">&times;</button>
  `;
  if (imageUrl) {
    row.querySelector('img').src = imageUrl;
    row.querySelector('img').classList.remove('d-none');
  }
  row.querySelector('.remove-color-btn').onclick = () => row.remove();
  row.querySelector('.color-image').onchange = function(e) {
    if (this.files && this.files[0]) {
      const url = URL.createObjectURL(this.files[0]);
      row.querySelector('img').src = url;
      row.querySelector('img').classList.remove('d-none');
    }
  };
  setTimeout(() => { if (typeof translateDashboard === 'function') translateDashboard(lang); }, 0);
  return row;
}

  genderSelect.addEventListener('change', buildCategoryOptions);
  form.addEventListener('reset', () => {
    setTimeout(() => {
      if (!genderSelect.value || genderSelect.value === '') {
        genderSelect.value = 'women';
      }
      buildCategoryOptions();
    }, 0);
  });
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const price = parseFloat(document.getElementById("price").value);
    const stock = parseInt(document.getElementById("stock").value);
    const gender = document.getElementById("gender").value;
    const category = document.getElementById("category").value;
    const sizes = document.getElementById("sizes").value.split(',').map(s => s.trim()).filter(Boolean);
    const mainImageFile = document.getElementById("mainImage").files[0] || null;
    const imagesFiles = Array.from(document.getElementById("images").files);
    // --- Colors ---
    const colorRows = Array.from(document.querySelectorAll('#colors-list .color-row'));
    const colors = [];
    for (let row of colorRows) {
      const colorName = row.querySelector('.color-name').value.trim();
      const colorFile = row.querySelector('.color-image').files[0] || null;
      let colorImgUrl = row.querySelector('img').src && !row.querySelector('img').classList.contains('d-none') ? row.querySelector('img').src : '';
      if (!colorName) continue;
      if (colorFile) {
        colorImgUrl = await uploadImage(colorFile);
      } else if (colorImgUrl.startsWith('blob:')) {
        // If preview but not uploaded, skip
        continue;
      }
      colors.push({ name: colorName, image: colorImgUrl });
    }
    // Ensure at least one product image is selected
    if (!imagesFiles.length) {
      alert("Please select at least one product image.");
      return;
    }
    // Prevent Cloudinary upload if no file
    let imageUrls = [];
        for (let img of imagesFiles) {
      if (!img) continue;
          imageUrls.push(await uploadImage(img));
        }
        // Upload main image if provided, else use first image
        let mainImageUrl = null;
        if (mainImageFile) {
          mainImageUrl = await uploadImage(mainImageFile);
    } else if (imageUrls.length > 0) {
      mainImageUrl = imageUrls[0];
        } else {
      mainImageUrl = '';
    }
    // Ensure no undefined fields for Firebase
    const safeColors = Array.isArray(colors) ? colors : [];
    const safeSizes = Array.isArray(sizes) ? sizes : [];
    const safeImages = Array.isArray(imageUrls) ? imageUrls : [];
    const safeMainImage = mainImageUrl || '';
    try {
        await db.collection('products').add({
            name,
            price,
            stock,
            gender,
            category,
        colors: safeColors,
        sizes: safeSizes,
        mainImage: safeMainImage,
        images: safeImages,
            createdAt: new Date()
        });
        alert("Product added successfully!");
        form.reset();
        buildGenderAndCategorySelects();
        colorsList.innerHTML = '';
        colorsList.appendChild(createColorRow());
        loadProducts().then(loadStats);
    } catch (err) {
        alert("Failed to add product.");
        console.error(err);
    }
  });

  // Initial build
  buildGenderAndCategorySelects();
  if (!genderSelect.value || genderSelect.value === '') {
    genderSelect.value = 'women';
  }
  buildCategoryOptions();
  if (colorsList.childElementCount === 0) colorsList.appendChild(createColorRow());
  bindAddColorBtn();

  // Load products and stats immediately on page load
  loadProducts().then(loadStats);

  // Null checks for dashboard/stat elements
  function setStatText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }
  // Example usage:
  // setStatText("stat-products", "10");
  // setStatText("stat-orders", "5");
  // setStatText("stat-customers", "3");
});

// Load Products
async function loadProducts() {
    const lang = getCurrentLang();
    const t = getDashboardT(lang);
    const table = document.getElementById("productTable");
    table.innerHTML = "";
    const snapshot = await db.collection('products').get();
    snapshot.forEach(docSnap => {
        const data = docSnap.data();
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${data.name}</td>
      <td>${data.price}</td>
      <td>${data.stock}</td>
      <td>${t[data.gender] || data.gender}</td>
      <td>${data.category}</td>
      <td><img src="${data.mainImage}" class="product-img-thumb" alt="main"></td>
      <td>${(data.images||[]).map(img=>`<img src='${img}' class='product-img-thumb' alt='img'>`).join('')}</td>
      <td>${(data.colors||[]).map(color=>`<div class='d-flex align-items-center mb-1'><span class='size-badge mr-1'>${color.name}</span><img src='${color.image}' class='product-img-thumb' style='width:32px;height:32px;'></div>`).join('')}</td>
      <td>${(data.sizes||[]).map(size=>`<span class='size-badge'>${size}</span>`).join('')}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary edit-btn" onclick="window.editProduct('${docSnap.id}')">${t.edit}</button>
        <button class="btn btn-sm btn-outline-danger delete-btn" onclick="window.deleteProduct('${docSnap.id}')">${t.delete}</button>
      </td>
    `;
        table.appendChild(row);
    });
    if (typeof translateDashboard === 'function') translateDashboard(lang);
    return snapshot.size;
}

// Delete Product
window.deleteProduct = async function (id) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await db.collection('products').doc(id).delete();
    loadProducts().then(loadStats);
};

// Edit Product (open modal)
window.editProduct = async function (id) {
    const lang = getCurrentLang();
    const t = getDashboardT(lang);
    const modal = $('#editProductModal');
    const form = document.getElementById('editProductForm');
    form.innerHTML = '<div class="text-center">Loading...</div>';
    modal.modal('show');
    const docRef = db.collection('products').doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      form.innerHTML = '<div class="alert alert-danger">Product not found.</div>';
      return;
    }
    const data = docSnap.data();
    form.innerHTML = `
      <input type="hidden" id="edit-id" value="${id}">
      <div class="row">
        <div class="col-md-6 mb-3">
          <label for="edit-name">${t.name}</label>
          <input type="text" id="edit-name" class="form-control" value="${data.name}" required>
        </div>
        <div class="col-md-3 mb-3">
          <label for="edit-price">${t.price}</label>
          <input type="number" id="edit-price" class="form-control" min="0" step="0.01" value="${data.price}" required>
        </div>
        <div class="col-md-3 mb-3">
          <label for="edit-stock">${t.stock}</label>
          <input type="number" id="edit-stock" class="form-control" min="0" value="${data.stock}" required>
        </div>
        <div class="col-md-6 mb-3">
          <label for="edit-mainImage">${t.mainImage} (optional)</label>
          <input type="file" id="edit-mainImage" class="form-control" accept="image/*">
          <div class="main-image-wrapper position-relative d-inline-block">
            <img src="${data.mainImage}" class="product-img-thumb mt-2" alt="main">
            <button type="button" class="btn btn-sm btn-danger remove-main-img-btn position-absolute" style="top:0;right:0;">&times;</button>
          </div>
        </div>
        <div class="col-md-6 mb-3">
          <label for="edit-images">${t.images} (add more)</label>
          <input type="file" id="edit-images" class="form-control" accept="image/*" multiple>
          <div id="edit-images-list">
            ${(data.images||[]).map(img=>`
              <div class="image-wrapper position-relative d-inline-block">
                <img src='${img}' class='product-img-thumb mt-2' alt='img'>
                <button type="button" class="btn btn-sm btn-danger remove-img-btn position-absolute" style="top:0;right:0;">&times;</button>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <label for="edit-gender">${t.gender}</label>
          <select id="edit-gender" class="form-control" required>
            <option value="">${t.select}</option>
            <option value="women" ${data.gender==='women'?'selected':''}>${t.women}</option>
            <option value="men" ${data.gender==='men'?'selected':''}>${t.men}</option>
          </select>
        </div>
        <div class="col-md-4 mb-3">
          <label for="edit-category">${t.category}</label>
          <select id="edit-category" class="form-control" required>
            <option value="">${t.select}</option>
            ${(categoriesByLang[lang][data.gender]||[]).map(cat=>`<option value="${cat}" ${data.category===cat?'selected':''}>${cat}</option>`).join('')}
          </select>
        </div>
        <div class="col-md-12 mb-3">
          <label>${t.colors}</label>
          <div id="edit-colors-list"></div>
          <button type="button" class="btn btn-outline-secondary btn-sm mt-2" id="edit-add-color-btn">${t.addColor}</button>
        </div>
        <div class="col-md-12 mb-3">
          <label for="edit-sizes">${t.sizes} (comma separated)</label>
          <input type="text" id="edit-sizes" class="form-control" value="${(data.sizes||[]).join(', ')}" required>
        </div>
      </div>
    `;
    // Colors dynamic rows for edit
    const editColorsList = form.querySelector('#edit-colors-list');
    function createEditColorRow(name = '', imageUrl = '', file = null) {
      const row = document.createElement('div');
      row.className = 'd-flex align-items-center mb-2 color-row';
      row.innerHTML = `
        <input type="text" class="form-control form-control-sm mr-2 color-name" placeholder="${t.colorName}" value="${name}" style="max-width:120px;">
        <input type="file" accept="image/*" class="form-control-file form-control-sm mr-2 color-image">
        <img src="${imageUrl}" class="product-img-thumb mr-2 d-none" style="width:36px;height:36px;" alt="color-img">
        <button type="button" class="btn btn-danger btn-sm remove-color-btn">&times;</button>
      `;
      if (imageUrl) {
        row.querySelector('img').src = imageUrl;
        row.querySelector('img').classList.remove('d-none');
      }
      row.querySelector('.remove-color-btn').onclick = () => row.remove();
      row.querySelector('.color-image').onchange = function(e) {
        if (this.files && this.files[0]) {
          const url = URL.createObjectURL(this.files[0]);
          row.querySelector('img').src = url;
          row.querySelector('img').classList.remove('d-none');
        }
      };
      setTimeout(() => { if (typeof translateDashboard === 'function') translateDashboard(lang); }, 0);
      return row;
    }
    (data.colors||[]).forEach(c => editColorsList.appendChild(createEditColorRow(c.name, c.image)));
    if (editColorsList.childElementCount === 0) editColorsList.appendChild(createEditColorRow());
    form.querySelector('#edit-add-color-btn').onclick = function() {
      editColorsList.appendChild(createEditColorRow());
    };
    form.querySelector('#edit-gender').addEventListener('change', function() {
      const g = this.value;
      const catSel = form.querySelector('#edit-category');
      catSel.innerHTML = `<option value="">${t.select}</option>`;
      (categoriesByLang[lang][g]||[]).forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        catSel.appendChild(opt);
      });
      if (typeof translateDashboard === 'function') translateDashboard(lang);
    });
    setTimeout(() => { if (typeof translateDashboard === 'function') translateDashboard(lang); }, 0);

    // بعد بناء الفورم، اربط أزرار الحذف
    // حذف صورة رئيسية
    form.querySelectorAll('.remove-main-img-btn').forEach(btn => {
      btn.onclick = function() {
        btn.parentElement.remove();
      };
    });
    // حذف صورة إضافية
    form.querySelectorAll('.remove-img-btn').forEach(btn => {
      btn.onclick = function() {
        btn.parentElement.remove();
      };
    });
};

// Save Edit
const saveEditBtn = document.getElementById('saveEditBtn');
saveEditBtn.onclick = async function(e) {
    e.preventDefault();
    const form = document.getElementById('editProductForm');
    const id = form.querySelector('#edit-id').value;
    const name = form.querySelector('#edit-name').value.trim();
    const price = parseFloat(form.querySelector('#edit-price').value);
    const stock = parseInt(form.querySelector('#edit-stock').value);
    const gender = form.querySelector('#edit-gender').value;
    const category = form.querySelector('#edit-category').value;
    const sizes = form.querySelector('#edit-sizes').value.split(',').map(s => s.trim()).filter(Boolean);
    const mainImageFile = form.querySelector('#edit-mainImage').files[0] || null;
    const imagesFiles = Array.from(form.querySelector('#edit-images').files);
    // --- Colors ---
    const colorRows = Array.from(form.querySelectorAll('#edit-colors-list .color-row'));
    const colors = [];
    for (let row of colorRows) {
      const colorName = row.querySelector('.color-name').value.trim();
      const colorFile = row.querySelector('.color-image').files[0] || null;
      let colorImgUrl = row.querySelector('img').src && !row.querySelector('img').classList.contains('d-none') ? row.querySelector('img').src : '';
      if (!colorName) continue;
      if (colorFile) {
        colorImgUrl = await uploadImage(colorFile);
      } else if (colorImgUrl.startsWith('blob:')) {
        continue;
      }
      colors.push({ name: colorName, image: colorImgUrl });
    }
    // Upload new images if any
    let mainImageUrl = null;
    const mainImgElem = form.querySelector('.main-image-wrapper img');
    if (mainImgElem) {
      mainImageUrl = mainImgElem.src;
    }
    let imageUrls = Array.from(form.querySelectorAll('#edit-images-list .image-wrapper img')).map(img=>img.src);
    if (imagesFiles.length) {
      for (let img of imagesFiles) {
        imageUrls.push(await uploadImage(img));
      }
    }
    // Ensure no undefined fields for Firebase
    const safeColors = Array.isArray(colors) ? colors : [];
    const safeSizes = Array.isArray(sizes) ? sizes : [];
    const safeImages = Array.isArray(imageUrls) ? imageUrls : [];
    const safeMainImage = mainImageUrl || '';
    await db.collection('products').doc(id).update({
      name, price, stock, gender, category,
      colors: safeColors,
      sizes: safeSizes,
      mainImage: safeMainImage,
      images: safeImages
    });
    $('#editProductModal').modal('hide');
    loadProducts().then(loadStats);
};

// Load statistics (products, orders, customers)
async function loadStats() {
  // Products count
  const productsSnap = await db.collection('products').get();
  const statProducts = document.getElementById("stat-products");
  if (statProducts) statProducts.textContent = productsSnap.size;
  // Orders count
  let ordersCount = 0;
  try {
    const ordersSnap = await db.collection('orders').get();
    ordersCount = ordersSnap.size;
  } catch (e) {
    // If orders collection doesn't exist yet
    ordersCount = 0;
  }
  const statOrders = document.getElementById("stat-orders");
  if (statOrders) statOrders.textContent = ordersCount;
  // Customers count
  let customersCount = 0;
  try {
    const usersSnap = await db.collection('users').get();
    customersCount = usersSnap.size;
  } catch (e) {
    customersCount = 0;
  }
  const statCustomers = document.getElementById("stat-customers");
  if (statCustomers) statCustomers.textContent = customersCount;
}

// ✅ 6. Load stats (mockup)
const userCount = document.getElementById("userCount");
if (userCount) userCount.textContent = "10";
const orderCount = document.getElementById("orderCount");
if (orderCount) orderCount.textContent = "5";
const topProduct = document.getElementById("topProduct");
if (topProduct) topProduct.textContent = "Black T-Shirt";

// ترجمة أولية عند تحميل الصفحة
if (typeof translateDashboard === 'function') translateDashboard(getCurrentLang());

// Helper to ensure no undefined values
const safeValue = (val, fallback) => (typeof val === 'undefined' ? fallback : val);

$(document).ready(function() {
  $('#editProductModal').on('hidden.bs.modal', function () {
    // أعد التركيز إلى أول زر Edit في الجدول
    const firstEditBtn = document.querySelector('.edit-btn');
    if (firstEditBtn) firstEditBtn.focus();
  });
});
