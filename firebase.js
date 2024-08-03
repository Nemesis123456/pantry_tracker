// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDP1s_rJxgcFahScnb9_0gDkI1sFlNXXuQ",
  authDomain: "pantry-tracker-28102.firebaseapp.com",
  projectId: "pantry-tracker-28102",
  storageBucket: "pantry-tracker-28102.appspot.com",
  messagingSenderId: "451191272461",
  appId: "1:451191272461:web:33f5089517f19016981144",
  measurementId: "G-5W074XX0DB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };