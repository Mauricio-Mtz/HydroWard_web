// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyByA8BOKHWFcWbNO-pFjADhh3uEpNylniQ",
  authDomain: "hydroward-aaae8.firebaseapp.com",
  projectId: "hydroward-aaae8",
  storageBucket: "hydroward-aaae8.appspot.com",
  messagingSenderId: "924825257949",
  appId: "1:924825257949:web:64a2b61d67f77718f9d834",
  measurementId: "G-0F0ZGBXKPP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);