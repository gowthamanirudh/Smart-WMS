import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXNE7FOghlCklFd0mPqRieRRh1UGXXEdc",
  authDomain: "smart-warehouse-6859e.firebaseapp.com",
  projectId: "smart-warehouse-6859e",
  storageBucket: "smart-warehouse-6859e.appspot.com",
  messagingSenderId: "500845546313",
  appId: "1:500845546313:web:f859cf29b41c5de6b2a898",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
