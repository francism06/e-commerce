// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDho2MQTHgpVuakCrqAPnVeiJ2f-APgwus",
  authDomain: "sicat-91ef3.firebaseapp.com",
  projectId: "sicat-91ef3",
  storageBucket: "sicat-91ef3.appspot.com",
  messagingSenderId: "263543332703",
  appId: "1:263543332703:web:5043fd562c94fd8939a0ea",
  measurementId: "G-B14D5LZCX1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
