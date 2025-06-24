// products.js

// Fetch all products from Firestore
async function fetchAllProducts() {
  const snapshot = await db.collection('products').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Get featured products (optionally by season/gender)
async function getFeaturedProducts({ season, gender, limit = 4 } = {}) {
  let query = db.collection('products').where('featured', '==', true);
  if (season) query = query.where('season', '==', season);
  if (gender) query = query.where('gender', '==', gender);
  const snapshot = await query.get();
  let products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  // Shuffle and limit
  products = products.sort(() => 0.5 - Math.random()).slice(0, limit);
  return products;
}

// Get products by gender (and optionally season/category)
async function getProductsByGender(gender, { season, category } = {}) {
  let query = db.collection('products').where('gender', '==', gender);
  if (season) query = query.where('season', '==', season);
  if (category) query = query.where('category', '==', category);
  const snapshot = await query.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Get product by ID
async function getProductById(id) {
  const doc = await db.collection('products').doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

// Export functions globally for use in HTML inline scripts
window.fetchAllProducts = fetchAllProducts;
window.getFeaturedProducts = getFeaturedProducts;
window.getProductsByGender = getProductsByGender;
window.getProductById = getProductById; 