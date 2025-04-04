import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, collection, addDoc, getDoc, getDocs  } from "firebase/firestore";

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

// Function to create a user and save bookings under them
export const addUserForm = async (email, password, firstName, lastName) => {
  try {
    const user = auth.currentUser;

    if (user) {
      // If the user is logged in, proceed to save user info in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        email: user.email,
        uid: user.uid,
        createdAt: new Date(),
      }, { merge: true });  // Use merge to avoid overwriting existing data

      return { userId: user.uid, error: null };  
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

      return { userId: newUser.uid, error: null };  
    }
  } catch (error) {
    console.error("Error signing up:", error.message);
    return { userId: null, error: error.message };  
  }
};

// Function to save a new booking under the user's bookings subcollection
export const addBooking = async (userId, bookingData) => {
  try {
    const bookingsRef = collection(db, 'users', userId, 'bookings');
    const bookingDocRef = await addDoc(bookingsRef, {
      ...bookingData, 
      createdAt: new Date(),  
    });

    console.log("Booking saved with ID: ", bookingDocRef.id);
    return { bookingId: bookingDocRef.id, error: null };
  } catch (error) {
    console.error("Error saving booking:", error.message);
    return { bookingId: null, error: error.message };
  }
};

// Function to fetch user data from Firestore
export const getUserData = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return { data: userDoc.data(), error: null };
    } else {
      console.log("No such user found in Firestore");
      return { data: null, error: 'User not found' };
    }
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    return { data: null, error: error.message };
  }
};

// Function to fetch bookings data for a user
export const getBookings = async (userId) => {
  try {
    const bookingsRef = collection(db, 'users', userId, 'bookings');
    const bookingsSnapshot = await getDocs(bookingsRef);

    if (!bookingsSnapshot.empty) {
	  const bookings = [];
	  bookingsSnapshot.docs.map((doc) => {
	    let docId = doc.id;
	    bookings.push({
        docId,
        ...doc.data()
		  });
      return bookings;
	  });
      return { bookings, error: null };
    } else {
      console.log("No bookings found for this user");
      return { bookings: [], error: 'No bookings found' };
    }
  } catch (error) {
    console.error("Error fetching bookings:", error.message);
    return { bookings: [], error: error.message };
  }
};

export { app, auth, db };
