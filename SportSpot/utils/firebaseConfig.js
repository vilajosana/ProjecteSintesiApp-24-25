import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Afegit per inicialitzar Firestore

const firebaseConfig = {
  apiKey: "AIzaSyDWOaj8E3LXjza0jPLzVT2kfWh6MSFfpCg",
  authDomain: "projectesintesiapp-24-25.firebaseapp.com",
  projectId: "projectesintesiapp-24-25",
  storageBucket: "projectesintesiapp-24-25.firebasestorage.app",
  messagingSenderId: "532613042016",
  appId: "1:532613042016:web:af61d2cfbb2d64acde9805",
  measurementId: "G-GKCFKY9TFB"
};

// Inicialitza Firebase
const app = initializeApp(firebaseConfig);

// Obtenim els serveis de Firebase
const auth = getAuth(app);
const db = getFirestore(app);

export { db, auth };
