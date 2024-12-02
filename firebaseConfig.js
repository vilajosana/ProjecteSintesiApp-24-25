// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB4emd_JM3O_eVcsqebuYkBVAiqWkjE1GQ",
    authDomain: "sportspot-83fdf.firebaseapp.com",
    projectId: "sportspot-83fdf",
    storageBucket: "sportspot-83fdf.firebasestorage.app",
    messagingSenderId: "32610019002",
    appId: "1:32610019002:web:7f55f3e116530699208483",
    measurementId: "G-04SV0Q88Y5"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Utiliza getFirestore en lugar de getAnalytics

export { db };