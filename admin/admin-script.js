import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  limit
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

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

// رفع صورة إلى Cloudinary
async function uploadImage(imageFile) {
  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("upload_preset", "upload_preset"); // غيريها حسب الـ preset عندك

  const res = await fetch("https://api.cloudinary.com/v1_1/dqgkjyaqz/image/upload", {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    throw new Error("فشل رفع الصورة إلى Cloudinary");
  }

  const data = await res.json();
  return data.secure_url;
}

// إضافة لون جديد في الفورم
document.getElementById("addColorBtn").addEventListener("click", () => {
  const colorsContainer = document.getElementById("colorsContainer");
  const newColorDiv = document.createElement("div");
  newColorDiv.classList.add("color-input", "mb-2", "position-relative");
  newColorDiv.innerHTML = `
    <span class="remove-color">&times;</span>
    <input type="text" class="form-control mb-1 color-name" placeholder="اسم اللون" required />
    <input type="file" class="form-control color-image" accept="image/*" required />
  `;
  colorsContainer.appendChild(newColorDiv);

  // تفعيل زر الحذف للون الجديد
  newColorDiv.querySelector(".remove-color").addEventListener("click", () => {
    newColorDiv.remove();
  });
});

// تفعيل زر حذف للون الافتراضي الأول
document.querySelectorAll(".remove-color").forEach(span => {
  span.style.display = "none"; // نخفي زر الحذف للون الأول (اختياري)
});

// معالجة إضافة المنتج
const form = document.getElementById("addProductForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const price = parseFloat(document.getElementById("price").value);
  const stock = parseInt(document.getElementById("stock").value);
  const gender = document.getElementById("gender").value;
  const category = document.getElementById("category").value;

  if (!name || !price || !stock || !gender || !category) {
    alert("يرجى ملء جميع الحقول المطلوبة");
    return;
  }

  // جمع الألوان مع رفع الصور
  const colorDivs = document.querySelectorAll(".color-input");
  const colors = [];
  try {
    for (const div of colorDivs) {
      const colorName = div.querySelector(".color-name").value.trim();
      const colorFile = div.querySelector(".color-image").files[0];

      if (!colorName || !colorFile) {
        alert("يرجى ملء اسم الصورة واللون لكل لون");
        return;
      }

      const imageUrl = await uploadImage(colorFile);
      colors.push({ name: colorName, image: imageUrl });
    }
  } catch (err) {
    alert("فشل رفع الصور، حاول مجددًا");
    console.error(err);
    return;
  }

  // جمع المقاسات
  const sizesStr = document.getElementById("sizesInput").value.trim();
  const sizes = sizesStr.split(",").map(s => s.trim()).filter(s => s.length > 0);

  try {
    await addDoc(collection(db, "products"), {
      name,
      price,
      stock,
      gender,
      category,
      colors,
      sizes,
      createdAt: new Date()
    });
    alert("✅ تمت الإضافة بنجاح!");
    form.reset();

    // إعادة تعيين لون واحد فقط مع صورة فارغة في الفورم
    const colorsContainer = document.getElementById("colorsContainer");
    colorsContainer.innerHTML = `
      <h6>الألوان المتاحة</h6>
      <div class="color-input position-relative">
        <span class="remove-color" style="display:none;">&times;</span>
        <input type="text" class="form-control mb-1 color-name" placeholder="اسم اللون" required />
        <input type="file" class="form-control color-image" accept="image/*" required />
      </div>
    `;

    loadProducts();
    loadStats();
  } catch (err) {
    alert("❌ فشل في الإضافة");
    console.error(err);
  }
});

// تحميل وعرض المنتجات
async function loadProducts() {
  const table = document.getElementById("productTable");
  table.innerHTML = "";

  const snapshot = await getDocs(collection(db, "products"));
  document.getElementById("productCount").textContent = snapshot.size;

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const colorsNames = data.colors?.map(c => c.name).join(", ") || "-";
    const sizesList = data.sizes?.join(", ") || "-";
    const colorsImgs = data.colors?.map(c => `<img src="${c.image}" alt="${c.name}" style="width:30px; height:auto; margin:2px; border-radius:4px;">`).join(" ") || "-";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${data.name}</td>
      <td>$${data.price.toFixed(2)}</td>
      <td>${data.stock}</td>
      <td>${data.gender.charAt(0).toUpperCase() + data.gender.slice(1)}</td>
      <td>${data.category.charAt(0).toUpperCase() + data.category.slice(1)}</td>
      <td>${colorsNames}</td>
      <td>${sizesList}</td>
      <td>${colorsImgs}</td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="deleteProduct('${docSnap.id}')">حذف</button>
      </td>
    `;
    table.appendChild(row);
  });
}

// حذف منتج
window.deleteProduct = async function(id) {
  if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;

  try {
    await deleteDoc(doc(db, "products", id));
    alert("✅ تم الحذف بنجاح");
    loadProducts();
    loadStats();
  } catch (err) {
    alert("❌ فشل في الحذف");
    console.error(err);
  }
};

// تحميل إحصائيات مبدئية (تعديل لاحقاً حسب البيانات الفعلية)
async function loadStats() {
  // عدد المنتجات تم تحميله في loadProducts()
  // المستخدمين والطلبات والأكثر مبيعًا بيانات ثابتة كمثال
  document.getElementById("userCount").textContent = "10";
  document.getElementById("orderCount").textContent = "5";

  // الأكثر مبيعاً - مثال، يمكنك استبداله ببيانات حقيقية لاحقًا
  document.getElementById("topProduct").textContent = "Black T-Shirt";
}

// تحميل أولي
loadProducts();
loadStats();
