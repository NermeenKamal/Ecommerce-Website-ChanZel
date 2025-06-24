// admin-script.js
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

// ✅ 2. Upload image to Cloudinary
async function uploadImage(imageFile) {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "unsigned_preset");

    const res = await fetch("https://api.cloudinary.com/v1_1/dqgkjyaqz/image/upload", {
        method: "POST",
        body: formData
    });

    const data = await res.json();
    return data.secure_url;
}

// ✅ 3. Add Product
const form = document.getElementById("addProductForm");
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const price = parseFloat(document.getElementById("price").value);
    const stock = parseInt(document.getElementById("stock").value);
    const image = document.getElementById("image").files[0];

    try {
        const imageUrl = await uploadImage(image);
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
    } catch (err) {
        alert("❌ فشل في الإضافة");
        console.error(err);
    }
});

// ✅ 4. Load Products
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
      <td>$${data.price}</td>
      <td>${data.stock}</td>
      <td><img src="${data.image}" alt="image"></td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="deleteProduct(\"${docSnap.id}\")">حذف</button>
      </td>
    `;
        table.appendChild(row);
    });
}

// ✅ 5. Delete Product
window.deleteProduct = async function (id) {
    await deleteDoc(doc(db, "products", id));
    loadProducts();
};

// ✅ 6. Load stats (mockup)
document.getElementById("userCount").textContent = "10";
document.getElementById("orderCount").textContent = "5";
document.getElementById("topProduct").textContent = "Black T-Shirt";

// ✅ Initial Load
loadProducts();
