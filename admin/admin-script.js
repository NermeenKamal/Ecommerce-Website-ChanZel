import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

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
    formData.append("upload_preset", "upload_preset"); // تأكدي من اسم الـ preset الخاص بك في Cloudinary

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

    const name = document.getElementById("name").value.trim();
    const price = parseFloat(document.getElementById("price").value);
    const stock = parseInt(document.getElementById("stock").value);
    const gender = document.getElementById("gender").value;
    const category = document.getElementById("category").value;
    const imageFile = document.getElementById("image").files[0];

    if (!imageFile) {
        alert("❌ الرجاء اختيار صورة للمنتج");
        return;
    }
    if (!gender || !category) {
        alert("❌ الرجاء اختيار الجنس والتصنيف");
        return;
    }

    try {
        const imageUrl = await uploadImage(imageFile);
        await addDoc(collection(db, "products"), {
            name,
            price,
            stock,
            gender,
            category,
            image: imageUrl,
            createdAt: new Date()
        });
        alert("✅ تمت الإضافة بنجاح!");
        form.reset();
        loadProducts();
        loadStats();
    } catch (err) {
        alert("❌ فشل في الإضافة");
        console.error(err);
    }
});

// تحميل المنتجات وعرضها
async function loadProducts() {
    const table = document.getElementById("productTable");
    table.innerHTML = "";

    const snapshot = await getDocs(collection(db, "products"));
    document.getElementById("productCount").textContent = snapshot.size;

    snapshot.forEach(docSnap => {
        const data = docSnap.data();
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${data.name}</td>
            <td>$${data.price.toFixed(2)}</td>
            <td>${data.stock}</td>
            <td>${data.gender}</td>
            <td>${data.category.charAt(0).toUpperCase() + data.category.slice(1)}</td>
            <td><img src="${data.image}" alt="image" style="width:50px; height:auto;"></td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="deleteProduct('${docSnap.id}')">حذف</button>
            </td>
        `;
        table.appendChild(row);
    });
}

// حذف منتج
window.deleteProduct = async function(id) {
    try {
        await deleteDoc(doc(db, "products", id));
        loadProducts();
        loadStats();
    } catch (err) {
        alert("❌ فشل في الحذف");
        console.error(err);
    }
};

// تحميل الإحصائيات - ممكن تطوريها ترجع بيانات فعلية من الفايرستور لاحقاً
function loadStats() {
    document.getElementById("userCount").textContent = "10";      // مثال ثابت
    document.getElementById("orderCount").textContent = "5";      // مثال ثابت
    document.getElementById("topProduct").textContent = "Black T-Shirt"; // مثال ثابت
}

// تحميل أولي
loadProducts();
loadStats();
