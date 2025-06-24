// products.js

// Initialize Firestore reference
const db = firebase.firestore();

// Fetch all products from Firestore
async function fetchAllProducts() {
  try {
    const snapshot = await db.collection('products').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching all products:', error);
    return [];
  }
}

// Get featured products (optionally by season/gender)
async function getFeaturedProducts({ season, gender, limit = 4 } = {}) {
  try {
    let query = db.collection('products').where('featured', '==', true);
    if (season) query = query.where('season', '==', season);
    if (gender) query = query.where('gender', '==', gender);
    
    const snapshot = await query.limit(limit).get();
    let products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Shuffle and limit
    products = products.sort(() => 0.5 - Math.random()).slice(0, limit);
    return products;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

// Get products by gender (and optionally season/category)
async function getProductsByGender(gender, { season, category } = {}) {
  try {
    let query = db.collection('products').where('gender', '==', gender);
    if (season) query = query.where('season', '==', season);
    if (category) query = query.where('category', '==', category);
    
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching products by gender:', error);
    return [];
  }
}

// Get product by ID
async function getProductById(id) {
  try {
    const doc = await db.collection('products').doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
}

// Export functions globally for use in HTML inline scripts
window.fetchAllProducts = fetchAllProducts;
window.getFeaturedProducts = getFeaturedProducts;
window.getProductsByGender = getProductsByGender;
window.getProductById = getProductById; 
