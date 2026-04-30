// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDt-j-QRFpIBg2UY2jfPOw0oGXQPmKhe5E",
    authDomain: "smart-canteen-system-1.firebaseapp.com",
    projectId: "smart-canteen-system-1",
    storageBucket: "smart-canteen-system-1.firebasestorage.app",
    messagingSenderId: "359087461796",
    appId: "1:359087461796:web:5dead5a8523af76784dd31",
    measurementId: "G-F87EHS94TY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);