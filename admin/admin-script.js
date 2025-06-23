import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { 
  getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, getCountFromServer 
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

// Upload image to Cloudinary
async function uploadImage(imageFile) {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "upload_preset");  // تأكدي إن الاسم ده مظبوط في حسابك على Cloudinary

    const res = await fetch("https://api.cloudinary.com/v1_1/dqgkjyaqz/image/upload", {
        method: "POST",
        body: formData
    });

    if (!res.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await res.json();
    return data.secure_url;
}

// Add Product
const form = document.getElementById("addProductForm");
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const price = parseFloat(document.getElementById("price").value);
    const stock = parseInt(document.getElementById("stock").value);
    const imageFile = document.getElementById("image").files[0];

    if (!imageFile) {
        alert("❌ الرجاء اختيار صورة للمنتج");
        return;
    }

    try {
        const imageUrl = await uploadImage(imageFile);
        await addDoc(collection(db, "products"), {
            name,
            price,
            stock,
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

// Load Products
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
            <td><img src="${data.image}" alt="image" style="width:50px; height:auto;"></td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="deleteProduct('${docSnap.id}')">حذف</button>
            </td>
        `;
        table.appendChild(row);
    });
}

// Delete Product
window.deleteProduct = async function(id) {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;

    try {
        await deleteDoc(doc(db, "products", id));
        alert("✅ تم حذف المنتج");
        loadProducts();
        loadStats();
    } catch (err) {
        alert("❌ فشل في حذف المنتج");
        console.error(err);
    }
};

// Load Stats
async function loadStats() {
    try {
        // عدد المستخدمين
        const usersSnapshot = await getCountFromServer(collection(db, "users"));
        document.getElementById("userCount").textContent = usersSnapshot.data().count;

        // عدد المنتجات (تحديث من products collection موجود في loadProducts برضه)
        // هنخليه هنا بس كمان عشان التأكد
        const productsSnapshot = await getCountFromServer(collection(db, "products"));
        document.getElementById("productCount").textContent = productsSnapshot.data().count;

        // عدد الطلبات
        const ordersSnapshot = await getCountFromServer(collection(db, "orders"));
        document.getElementById("orderCount").textContent = ordersSnapshot.data().count;

        // الأكثر مبيعًا - **لو عندك طريقة تحسبي بيها أكتر منتج مبيعًا في orders**
        // لو مش عندك بيانات حقيقية، ممكن تحطي اسم ثابت أو تطوريها لاحقًا
        document.getElementById("topProduct").textContent = "Black T-Shirt"; 

    } catch (err) {
        console.error("Error loading stats:", err);
    }
}

// Initial load
loadProducts();
loadStats();
