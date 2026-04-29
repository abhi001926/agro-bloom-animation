// Import the functions
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 🔥 Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCbE15b91oyB1bIFnutfpUDYQ6H2DawAP4",
  authDomain: "modern-krishi-53641.firebaseapp.com",
  projectId: "modern-krishi-53641",
  storageBucket: "modern-krishi-53641.firebasestorage.app",
  messagingSenderId: "367853296430",
  appId: "1:367853296430:web:4798a971a76f5b154e78bf",
  measurementId: "G-74XZ2F77R6"
};

// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Firestore DB export
export const db = getFirestore(app);