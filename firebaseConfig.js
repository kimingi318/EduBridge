// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBvVXGqE1NMl_ESJM24z8p4mw-beD-6e5s",
  authDomain: "edubridge-61275.firebaseapp.com",
  projectId: "edubridge-61275",
  storageBucket: "edubridge-61275.firebasestorage.app",
  messagingSenderId: "807999001841",
  appId: "1:807999001841:web:548b8a2e28356a63fb8550",
  measurementId: "G-V1DJT25HSV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

export const usersRef = collection(db, "users");
