import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";


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
const auth = getAuth(app);  
const db = getFirestore(app);  

// Function to create a user and save to Firestore
export const addUserForm = async (email, password, firstName, lastName) => {
  try {
    // Check if the user is already logged in
    const user = auth.currentUser;

    if (user) {
      // If the user is logged in, proceed to save user info in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        email: user.email,
        uid: user.uid,
        createdAt: new Date(),
      });

      return { user, error: null };
    } else {
      // If the user is not logged in, sign them up with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      // Save additional user information to Firestore
      await setDoc(doc(db, 'users', newUser.uid), {
        firstName,
        lastName,
        email: newUser.email,
        uid: newUser.uid,
        createdAt: new Date(),
      });

      return { user: newUser, error: null };
    }
  } catch (error) {
    console.error("Error signing up:", error.message);
    return { user: null, error: error.message };
  }
};

export { app, auth, db };
