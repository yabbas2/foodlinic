// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmD3EHHrsoCDw3IKXP9PeJzfHi5WieOEs",
  authDomain: "digital-shelter-362209.firebaseapp.com",
  projectId: "digital-shelter-362209",
  storageBucket: "digital-shelter-362209.appspot.com",
  messagingSenderId: "247553109630",
  appId: "1:247553109630:web:9ab40b9540185fb741f22f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
