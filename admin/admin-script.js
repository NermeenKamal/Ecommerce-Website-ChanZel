import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

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
  if (!imageFile) return null;

  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("upload_preset", "upload_preset"); // غيره حسب إعداداتك في Cloudinary

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

// إضافة لون جديد للحقل الخاص بالألوان
const colorInputsDiv = document.getElementById("colorInputs");
const addColorBtn = document.getElementById("addColorBtn");

function createColorInput(name = "", imageFile = null) {
  const div = document.createElement("div");
  div.classList.add("d-flex", "mb-1", "align-items-center", "gap-2");

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.placeholder = "اسم اللون";
  nameInput.className = "form-control form-control-sm";
  nameInput.style.flex = "2";
  nameInput.value = name;

  const imageInput = document.createElement("input");
  imageInput.type = "file";
  imageInput.accept = "image/*";
  imageInput.className = "form-control form-control-sm";
  imageInput.style.flex = "3";

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "btn btn-sm btn-danger";
  removeBtn.textContent = "✖";
  removeBtn.onclick = () => div.remove();

  div.appendChild(nameInput);
  div.appendChild(imageInput);
  div.appendChild(removeBtn);

  colorInputsDiv.appendChild(div);
}

addColorBtn.addEventListener("click", () => createColorInput());

// نضيف أول حقل لون افتراضي
createColorInput();

// إضافة منتج
const form = document.getElementById("addProductForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const price = parseFloat(document.getElementById("price").value);
  const stock = parseInt(document.getElementById("stock").value);
  const gender = document.getElementById("gender").value;
  const category = document.getElementById("category").value;
  const mainImageFile = document.getElementById("mainImage").files[0];
  const sizesText = document.getElementById("sizesInput").value.trim();

  if (!sizesText) {
    alert("❌ الرجاء إدخال المقاسات");
    return;
  }

  // ألوان المنتج
  const colorDivs = colorInputsDiv.querySelectorAll("div");
  const colors = [];

  for (const div of colorDivs) {
    const colorNameInput = div.querySelector('input[type="text"]');
    const colorImageInput = div.querySelector('input[type="file"]');
    if (colorNameInput.value.trim() !== "") {
      colors.push({
        name: colorNameInput.value.trim(),
        imageFile: colorImageInput.files[0] || null
      });
    }
  }

  // تحويل نص المقاسات إلى مصفوفة
  const sizes = sizesText.split(",").map(s => s.trim()).filter(s => s.length > 0);

  try {
    // رفع الصورة الأساسية (لو موجودة)
    let mainImageUrl = null;
    if (mainImageFile) {
      mainImageUrl = await uploadImage(mainImageFile);
    }

    // رفع صور الألوان (لو موجودة)
    for (let i = 0; i < colors.length; i++) {
      if (colors[i].imageFile) {
        colors[i].image = await uploadImage(colors[i].imageFile);
      } else {
        colors[i].image = "";
      }
      delete colors[i].imageFile; // نحذف ملف الصورة بعد رفعها
    }

    // لو ما فيش صورة أساسية، ناخد أول صورة لون كصورة أساسية
    if (!mainImageUrl && colors.length > 0 && colors[0].image) {
      mainImageUrl = colors[0].image;
    }

    // لو ما فيش صورة أساسية ولا ألوان، نعطي صورة افتراضية
    if (!mainImageUrl) {
      mainImageUrl = "img/default-product.jpg"; // تأكد أن الصورة موجودة عندك في المشروع
    }

    // إضافة المنتج للفايرستور
    await addDoc(collection(db, "products"), {
      name,
      price,
      stock,
      gender,
      category,
      mainImage: mainImageUrl,
      colors,
      sizes,
      createdAt: new Date()
    });

    alert("تم إضافة المنتج بنجاح ✅");

    form.reset();
    colorInputsDiv.innerHTML = "";
    createColorInput(); // إضافة حقل لون فارغ جديد تلقائياً

  } catch (error) {
    console.error(error);
    alert("حدث خطأ أثناء إضافة المنتج، حاول مرة أخرى");
  }
});

// تحميل التصنيفات في قائمة التصنيفات
const categorySelect = document.getElementById("category");
const categories = ["dress", "tshirts", "pants", "suits", "shoes", "bags"];

function loadCategories() {
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categorySelect.appendChild(option);
  });
}

loadCategories();

// تحميل عرض المنتجات الحالية (اختياري)
const productTable = document.getElementById("productTable");

async function loadProducts() {
  productTable.innerHTML = "<tr><td colspan='9'>جاري تحميل المنتجات...</td></tr>";

  try {
    const snapshot = await getDocs(collection(db, "products"));
    if (snapshot.empty) {
      productTable.innerHTML = "<tr><td colspan='9'>لا توجد منتجات حالياً</td></tr>";
      return;
    }

    productTable.innerHTML = "";

    snapshot.forEach(docSnap => {
      const p = docSnap.data();
      const id = docSnap.id;

      // بناء صف الجدول مع عرض الصورة الأساسية، الألوان والمقاسات
      const colorsHtml = p.colors.map(c => `
        <div style="display:flex;align-items:center;gap:4px;margin-bottom:2px;">
          <img src="${c.image || 'img/default-product.jpg'}" alt="${c.name}" width="30" height="30" style="object-fit:cover; border-radius:4px;">
          <span>${c.name}</span>
        </div>
      `).join("");

      const sizesHtml = p.sizes.join(", ");

      productTable.innerHTML += `
        <tr>
          <td>${p.name}</td>
          <td>$${p.price.toFixed(2)}</td>
          <td>${p.stock}</td>
          <td>${p.gender}</td>
          <td>${p.category}</td>
          <td><img src="${p.mainImage}" alt="${p.name}" /></td>
          <td>${colorsHtml}</td>
          <td>${sizesHtml}</td>
          <td>
            <!-- هنا ممكن تضيف أزرار حذف أو تعديل -->
            <button class="btn btn-sm btn-danger" onclick="deleteProduct('${id}')">حذف</button>
          </td>
        </tr>
      `;
    });

  } catch (err) {
    productTable.innerHTML = "<tr><td colspan='9' class='text-danger'>حدث خطأ أثناء تحميل المنتجات</td></tr>";
    console.error(err);
  }
}

loadProducts();

// حذف منتج (مثال)
async function deleteProduct(id) {
  if (!confirm("هل أنت متأكد من حذف المنتج؟")) return;

  try {
    await deleteDoc(doc(db, "products", id));
    alert("تم حذف المنتج");
    loadProducts();
  } catch (err) {
    alert("حدث خطأ أثناء حذف المنتج");
    console.error(err);
  }
}
