// products.js

// Initialize Firestore reference if not already initialized
let productsDb;
if (typeof db === 'undefined') {
    productsDb = firebase.firestore();
} else {
    productsDb = db;
}

// Default product image
const DEFAULT_PRODUCT_IMAGE = 'img/div-empty.jpg';

// Default product data
const DEFAULT_PRODUCT = {
    name_en: 'New Product',
    name_ar: 'منتج جديد',
    description_en: 'Product Description',
    description_ar: 'وصف المنتج',
    price: 0,
    sizes: [],
    colors: [],
    images: [DEFAULT_PRODUCT_IMAGE]
};

// Helper function to ensure product data has all required fields
function normalizeProductData(productData) {
    return {
        ...DEFAULT_PRODUCT,
        ...productData,
        name_en: productData.name_en || DEFAULT_PRODUCT.name_en,
        name_ar: productData.name_ar || DEFAULT_PRODUCT.name_ar,
        description_en: productData.description_en || DEFAULT_PRODUCT.description_en,
        description_ar: productData.description_ar || DEFAULT_PRODUCT.description_ar,
        price: productData.price || DEFAULT_PRODUCT.price,
        sizes: Array.isArray(productData.sizes) ? productData.sizes : DEFAULT_PRODUCT.sizes,
        colors: Array.isArray(productData.colors) ? productData.colors : DEFAULT_PRODUCT.colors,
        images: Array.isArray(productData.images) && productData.images.length > 0 ? 
            productData.images : DEFAULT_PRODUCT.images
    };
}

// Fetch all products from Firestore
async function fetchAllProducts() {
    try {
        const snapshot = await productsDb.collection('products').get();
        return snapshot.docs.map(doc => normalizeProductData({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching all products:', error);
        throw error;
    }
}

// Get featured products (optionally by season/gender)
async function getFeaturedProducts({ season, gender, limit = 4 } = {}) {
    try {
        let query = productsDb.collection('products').where('featured', '==', true);
        if (season) query = query.where('season', '==', season);
        if (gender) query = query.where('gender', '==', gender);
        
        const snapshot = await query.limit(limit).get();
        let products = snapshot.docs.map(doc => normalizeProductData({ id: doc.id, ...doc.data() }));
        
        // Shuffle and limit
        products = products.sort(() => 0.5 - Math.random()).slice(0, limit);
        return products;
    } catch (error) {
        console.error('Error fetching featured products:', error);
        throw error;
    }
}

// Get products by gender (and optionally season/category)
async function getProductsByGender(gender, { season, category } = {}) {
    try {
        let query = productsDb.collection('products').where('gender', '==', gender);
        if (season) query = query.where('season', '==', season);
        if (category) query = query.where('category', '==', category);
        
        const snapshot = await query.get();
        return snapshot.docs.map(doc => normalizeProductData({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching products by gender:', error);
        throw error;
    }
}

// Get product by ID
async function getProductById(id) {
    try {
        const doc = await productsDb.collection('products').doc(id).get();
        if (!doc.exists) {
            throw new Error('Product not found');
        }
        return normalizeProductData({ id: doc.id, ...doc.data() });
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        throw error;
    }
}

// Export functions to window object
window.fetchAllProducts = fetchAllProducts;
window.getFeaturedProducts = getFeaturedProducts;
window.getProductsByGender = getProductsByGender;
window.getProductById = getProductById; 
