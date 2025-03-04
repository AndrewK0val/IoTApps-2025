import { initializeApp } from "firebase/app"
import { getDatabase, ref, set, get, push, onValue } from "firebase/database"

const firebaseConfig = {
    apiKey: "AIzaSyBVFEZKZ9wUqtiHaIAC2uTtD1N11fg8osQ",
    authDomain: "iot-project-a9efd.firebaseapp.com",
    databaseURL: "https://iot-project-a9efd-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "iot-project-a9efd",
    storageBucket: "iot-project-a9efd.firebasestorage.app",
    messagingSenderId: "623744416216",
    appId: "1:623744416216:web:1db99a840694cc587c1aad",
    measurementId: "G-9Y6NK089Y7"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

export { db, ref, set, get, push, onValue }