// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6h46v86j7Mae0BA2KN78n3pLSYFfG4l4",
  authDomain: "blooddonation-b319e.firebaseapp.com",
  projectId: "blooddonation-b319e",
  storageBucket: "blooddonation-b319e.firebasestorage.app",
  messagingSenderId: "8457371220",
  appId: "1:8457371220:web:9636d6320199fae025b7c1"
};


export default firebaseConfig;
// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);