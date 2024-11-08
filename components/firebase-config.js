// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getMessaging } from "firebase/messaging";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9B1W4yRvTY0LhvsazV6g21j8qIme5hyw",
  authDomain: "mindmates-2078c.firebaseapp.com",
  projectId: "mindmates-2078c",
  storageBucket: "mindmates-2078c.appspot.com",
  messagingSenderId: "385877791288",
  appId: "1:385877791288:web:72f2ea9ef2b117c4d50ccd",
  measurementId: "G-MTZ4XNE3X4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db };

const addAssessment = async (userId, results) => {
  try {
    // Create a reference to the user's assessments collection
    const assessmentsCollection = collection(db, "assessments");

    // Add a new document with the assessment data
    await addDoc(assessmentsCollection, {
      userId: userId,
      assessmentData: results,
      timestamp: serverTimestamp(), // Automatically set the timestamp
    });

    console.log("Assessment added successfully!");
  } catch (error) {
    console.error("Error adding assessment: ", error);
  }
};

// Example of calling the function with dummy data
addAssessment("user123", { depression: 42, anxiety: 42, stress: 36 });
