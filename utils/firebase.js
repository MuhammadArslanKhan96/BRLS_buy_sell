// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCdrhd_QKK-jd5tWZgZJ1xIH029gpE0itc",
    authDomain: "makerx-b2640.firebaseapp.com",
    projectId: "makerx-b2640",
    storageBucket: "makerx-b2640.appspot.com",
    messagingSenderId: "191971434997",
    appId: "1:191971434997:web:4303ef75f9fa1677d840bc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
export { db, auth, storage };
