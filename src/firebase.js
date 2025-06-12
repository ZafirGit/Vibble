// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCticHNdDpJr7jOVvfbDMm2BVnqCT7imRc",
  authDomain: "vibble-project.firebaseapp.com",
  projectId: "vibble-project",
  storageBucket: "vibble-project.firebasestorage.app",
  messagingSenderId: "381859541046",
  appId: "1:381859541046:web:bb6ac231a631bf1241a897"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);
export { db };
export const storage = getStorage(app);
