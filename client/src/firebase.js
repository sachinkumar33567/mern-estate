// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-a4494.firebaseapp.com",
  projectId: "mern-estate-a4494",
  storageBucket: "mern-estate-a4494.appspot.com",
  messagingSenderId: "250542415433",
  appId: "1:250542415433:web:7fb18b38ce1b688c276998"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);