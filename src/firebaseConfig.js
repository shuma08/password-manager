import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBcxBBiXtbJNzGv2gytFnAxknYhx7daw9M",
    authDomain: "password-manager-bb981.firebaseapp.com",
    projectId: "password-manager-bb981",
    storageBucket: "password-manager-bb981.appspot.com",
    messagingSenderId: "77754654345",
    appId: "1:77754654345:web:b716006972c96ebf153058"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);