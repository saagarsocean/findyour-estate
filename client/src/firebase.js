// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWWUJ7BlR0tNYF3isfFPE1QlT_W4kJAUk",
  authDomain: "findyourestate-mern.firebaseapp.com",
  projectId: "findyourestate-mern",
  storageBucket: "findyourestate-mern.appspot.com",
  messagingSenderId: "1094025424259",
  appId: "1:1094025424259:web:6b48819e916e6242d19ab6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);