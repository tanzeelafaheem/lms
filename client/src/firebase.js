// firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCPx_k5fymPBX49Mv8Sb5gzxXXNORtpBxk",
  authDomain: "lms-app-7f257.firebaseapp.com",
  projectId: "lms-app-7f257",
  storageBucket: "lms-app-7f257.firebasestorage.app",
  messagingSenderId: "483159687651",
  appId: "1:483159687651:web:f8881ce5ccc7889f5be0d6",
  measurementId: "G-Y0YV3DE5M4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
