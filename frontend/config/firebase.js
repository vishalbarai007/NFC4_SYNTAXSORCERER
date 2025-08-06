// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDOvj55rRiKcMzwUqtaSUXKcSl6NvcKhdU",
  authDomain: "scriptcraft-21f4f.firebaseapp.com",
  projectId: "scriptcraft-21f4f",
  storageBucket: "scriptcraft-21f4f.firebasestorage.app",
  messagingSenderId: "1098972645414",
  appId: "1:1098972645414:web:6120c5ef0b97e5cef63ee7",
  measurementId: "G-HDQFE1QVZ1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);


