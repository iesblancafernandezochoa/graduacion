// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCq3RwtL7pC71jij_qR_T5kbwX1KLVWoec",
  authDomain: "graduacion-ies.firebaseapp.com",
  projectId: "graduacion-ies",
  storageBucket: "graduacion-ies.firebasestorage.app",
  messagingSenderId: "971424459910",
  appId: "1:971424459910:web:69c72475195e0bb927b507",
  measurementId: "G-9S5DEFL193"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
