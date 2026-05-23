// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD3pkhFjDPVBu3p6bkR6mtuYGO_mHQJZJ8",
  authDomain: "tripbuddy-b8b55.firebaseapp.com",
  projectId: "tripbuddy-b8b55",
  storageBucket: "tripbuddy-b8b55.firebasestorage.app",
  messagingSenderId: "173960925679",
  appId: "1:173960925679:web:f4a1b6329ab457f877261a",
  measurementId: "G-RFWJRXW07C",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
