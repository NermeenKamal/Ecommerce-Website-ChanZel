// firebase-init.js
const firebaseConfig = {
  apiKey: "AIzaSyDCkxDZH0tSd_c02dFkaEVQMpV4ZL06etU",
  authDomain: "chanzel-ecommerce.firebaseapp.com",
  projectId: "chanzel-ecommerce",
  storageBucket: "chanzel-ecommerce.appspot.com",
  messagingSenderId: "379673191328",
  appId: "1:379673191328:web:3ae431b8d0c23a4e177ac5",
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore(); 