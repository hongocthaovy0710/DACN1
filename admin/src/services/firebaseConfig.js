import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD3pkhFjDPVBu3p6bkR6mtuYGO_mHQJZJ8",
  authDomain: "tripbuddy-b8b55.firebaseapp.com",
  projectId: "tripbuddy-b8b55",
  storageBucket: "tripbuddy-b8b55.firebasestorage.app",
  messagingSenderId: "173960925679",
  appId: "1:173960925679:web:f4a1b6329ab457f877261a",
  measurementId: "G-RFWJRXW07C",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
