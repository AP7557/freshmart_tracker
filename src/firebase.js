// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBrhGNzC2JEoYMR34bXv2vwMBQPVNl3NG8",
  authDomain: "freshmart-tracker.firebaseapp.com",
  projectId: "freshmart-tracker",
  storageBucket: "freshmart-tracker.firebasestorage.app",
  messagingSenderId: "36913606146",
  appId: "1:36913606146:web:5516b95ff654f02a9fc11b",
  measurementId: "G-MP5V2Y0VX2",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
