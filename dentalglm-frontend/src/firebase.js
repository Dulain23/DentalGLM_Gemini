// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "dentalglm.firebaseapp.com",
  projectId: "dentalglm",
  storageBucket: "dentalglm.appspot.com",
  messagingSenderId: "509412699368",
  appId: "1:509412699368:web:976ae47fe22463bd5bad5d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);