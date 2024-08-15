// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBjtK7Dc8dVE3zCvLclRaA3XUlvlYZOl0U",
  authDomain: "addis-fetch.firebaseapp.com",
  projectId: "addis-fetch",
  storageBucket: "addis-fetch.appspot.com",
  messagingSenderId: "790581236009",
  appId: "1:790581236009:web:b8b5941806e9758dc9a738",
  measurementId: "G-LLVJQGRTXH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const db = getFirestore(app);
const storage = getStorage(app);
// Initialize Storage

// Export all necessary services
export { auth, db, doc, storage };
