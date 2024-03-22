import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyByA8BOKHWFcWbNO-pFjADhh3uEpNylniQ",
  authDomain: "hydroward-aaae8.firebaseapp.com",
  projectId: "hydroward-aaae8",
  storageBucket: "hydroward-aaae8.appspot.com",
  messagingSenderId: "924825257949",
  appId: "1:924825257949:web:64a2b61d67f77718f9d834",
  measurementId: "G-0F0ZGBXKPP"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);