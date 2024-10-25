import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";

export const doCreateUserWithEmailAndPassword = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const doSignInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true }; 
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      return { error: 'User not found.' };
    } else if (error.code === 'auth/wrong-password') {
      return { error: 'Incorrect password.' };
    } else {
      return { error: 'Incorrect password or email.' };
    }
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true }; // Indicate success
  } catch (error) {

    if (error.code === 'auth/invalid-email') {
      return { error: 'Invalid email format.' };
    } else if (error.code === 'auth/user-not-found') {
      return { error: 'User not found.' };
    } else {
      return { error: 'An unknown error occurred. Please try again.' };
    }
  }
};

export const doSignOut = () => {
  return auth.signOut();
};

export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/home`,
  });
};
