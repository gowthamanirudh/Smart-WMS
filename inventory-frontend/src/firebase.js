// Import required Firebase services
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXNE7FOghlCklFd0mPqRieRRh1UGXXEdc",
  authDomain: "smart-warehouse-6859e.firebaseapp.com",
  projectId: "smart-warehouse-6859e",
  storageBucket: "smart-warehouse-6859e.appspot.com",
  messagingSenderId: "500845546313",
  appId: "1:500845546313:web:f859cf29b41c5de6b2a898",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const db = getFirestore(app);      // Firestore Database
export const storage = getStorage(app);   // Firebase Storage
export const auth = getAuth(app);         // Firebase Authentication
