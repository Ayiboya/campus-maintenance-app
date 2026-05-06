import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCId5qON4hU9PlP7umKu5USR926ecCBzNg",
  authDomain: "campus-maintenanace.firebaseapp.com",
  projectId: "campus-maintenanace",
  storageBucket: "campus-maintenanace.firebasestorage.app",
  messagingSenderId: "784314208385",
  appId: "1:784314208385:web:e914a0887f567c7d0c3d80",
  measurementId: "G-FT13MG2BRZ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
