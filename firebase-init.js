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
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Error initializing Firebase:', error);
}

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Enable offline persistence
db.enablePersistence()
    .catch((err) => {
        if (err.code == 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled in one tab at a time
            console.warn('Firebase persistence failed: Multiple tabs open');
        } else if (err.code == 'unimplemented') {
            // The current browser doesn't support persistence
            console.warn('Firebase persistence not supported in this browser');
        }
    }); 
