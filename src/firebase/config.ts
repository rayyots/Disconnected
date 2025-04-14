
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBq2XUIbKqvKo9UPgXaOqVVWCf6lqTOAIk",
  authDomain: "disconnected-ride.firebaseapp.com",
  projectId: "disconnected-ride",
  storageBucket: "disconnected-ride.appspot.com",
  messagingSenderId: "654321098765",
  appId: "1:654321098765:web:987654321098765432109"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
