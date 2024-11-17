// Import the necessary functions from Firebase SDK (v9+ Modular API)
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRLJXpRPePN_iweiBa7uFVX_mmRBKZWEA",
  authDomain: "hotelhunt-2e8aa.firebaseapp.com",
  projectId: "hotelhunt-2e8aa",
  storageBucket: "hotelhunt-2e8aa.appspot.com",
  messagingSenderId: "3930904092",
  appId: "1:3930904092:web:23edc498658300477a31d9"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);  // Firebase Authentication
const db = getFirestore(app);  // Firestore

// Function to create a user and save to Firestore
export const addUserForm = async (email, password, firstName, lastName) => {
  try {
    // Step 1: Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Step 2: Save additional user information to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      firstName,
      lastName,
      email: user.email,
      uid: user.uid,
      createdAt: new Date(),
    });

    // Return user data
    return { user, error: null };
  } catch (error) {
    console.error("Error signing up:", error.message);
    return { user: null, error: error.message };
  }
};

export { app, auth, db };
