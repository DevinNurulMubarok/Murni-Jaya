import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCLXlSN_c7AdHmpr8K68exz_t_TZYcxfvo",
  authDomain: "murni-jaya.firebaseapp.com",
  projectId: "murni-jaya",
  storageBucket: "murni-jaya.firebasestorage.app",
  messagingSenderId: "672073288266",
  appId: "1:672073288266:web:f07743b5aab9be809034b3",
  measurementId: "G-4EBJSXHBW6"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, storage, googleProvider };
