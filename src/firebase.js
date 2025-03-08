import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAiIivgTCrL_9jkb7OQaZ0VgN9Fr1rmGAw",
    authDomain: "ballu-s-kadai.firebaseapp.com",
    projectId: "ballu-s-kadai",
    storageBucket: "ballu-s-kadai.appspot.com",
    messagingSenderId: "6818954206",
    appId: "1:6818954206:web:2cd5d1e13d43a731a3bb4f",
    measurementId: "G-PQKW9M16XR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, app, db };
