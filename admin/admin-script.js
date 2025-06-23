import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

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
  formData.append("upload_preset", "upload_preset"); // غيّرها للاسم الصحيح الخاص بك في Cloudinary

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

// إضافة منتج
const form = document.getElementById("addProductForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const name = document.getElementById("name").value.trim();
    const price = parseFloat(document.getElementById("price").value);
    const stock = parseInt(document.getElementById("stock").value);
    const gender = document.getElementById("gender").value;
    const category = document.getElementById("category").value;

    // صورة أساسية (اختيارية)
    const mainImageFile = document.getElementById("mainImage").files[0];
    let mainImageUrl = "";

    if (mainImageFile) {
      mainImageUrl = await uploadImage(mainImageFile);
    }

    // مثال: ألوان ثابتة (لو عندك رفع ألوان مع صور، عدل هنا)
    // لازم تضيف رفع صور الألوان لو عايزها، هنا مجرد مثال
    const colorsArray = [
      // {
      //   name: "black",
      //   image: "https://example.com/black.jpg"
      // }
    ];

    // مثال أحجام ثابتة أو من فورم (غيرها حسب تصميمك)
    const sizesArray = ["XS", "S", "M", "L", "XL"];

    await addDoc(collection(db, "products"), {
      name,
      price,
      stock,
      gender,
      category,
      mainImage: mainImageUrl, // الصورة الأساسية
      colors: colorsArray,
      sizes: sizesArray,
      createdAt: new Date()
    });

    alert("✅ تمت إضافة المنتج بنجاح!");
    form.reset();
    // يمكنك تحديث عرض المنتجات هنا لو تريد
  } catch (err) {
    alert("❌ حدث خطأ أثناء الإضافة");
    console.error(err);
  }
});
