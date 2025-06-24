// firebase-init.js

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDCkxDZH0tSd_c02dFkaEVQMpV4ZL06etU",
    authDomain: "chanzel-ecommerce.firebaseapp.com",
    projectId: "chanzel-ecommerce",
    storageBucket: "chanzel-ecommerce.appspot.com",
    messagingSenderId: "379673191328",
    appId: "1:379673191328:web:3ae431b8d0c23a4e177ac5"
};

// Initialize Firebase with error handling
try {
    // Check if Firebase is already initialized
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        console.log('Firebase initialized successfully');
    } else {
        console.log('Firebase already initialized');
    }
} catch (error) {
    console.error('Error initializing Firebase:', error);
}

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Configure Firestore settings for better performance and offline support
try {
    // Check if db.settings is a function
    if (typeof db.settings === 'function') {
        const settingsResult = db.settings({
            cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
            experimentalForceLongPolling: false,
            useFetchStreams: false
        }, { merge: true });
        
        // Only add catch if settings returns a Promise
        if (settingsResult && typeof settingsResult.catch === 'function') {
            settingsResult.catch((err) => {
                if (err.code == 'failed-precondition') {
                    console.warn('Firebase persistence failed: Multiple tabs open');
                } else if (err.code == 'unimplemented') {
                    console.warn('Firebase persistence not supported in this browser');
                } else {
                    console.warn('Firebase settings error:', err);
                }
            });
        }
    } else {
        console.warn('Firestore settings method not available');
    }
} catch (error) {
    console.warn('Error configuring Firestore settings:', error);
} 
