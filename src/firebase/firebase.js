// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore, collection, getDocs
} from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRLJXpRPePN_iweiBa7uFVX_mmRBKZWEA",
  authDomain: "hotelhunt-2e8aa.firebaseapp.com",
  projectId: "hotelhunt-2e8aa",
  storageBucket: "hotelhunt-2e8aa.appspot.com",
  messagingSenderId: "3930904092",
  appId: "1:3930904092:web:23edc498658300477a31d9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
//Initialize Service
const db = getFirestore()
//Collection reference
const colRef = collection(db, 'users')
//Get collection data
getDocs(colRef)
  .then((snapshot) => {
    let users = []
    snapshot.docs.forEach((doc) => {
      users.push({ ...doc.data, id: doc.id })
    })
    console.log(users)
})
.catch(err => {
  console.log(err.message)
})

export {app, auth};
