// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage,ref,getDownloadURL } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import {getDatabase} from "firebase/database"
import {getAuth} from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCozzvCqtpYPq8tEiA7wthSZAOMxXbNBK4",
  authDomain: "purviewallinone.firebaseapp.com",
  databaseURL: "https://purviewallinone-default-rtdb.firebaseio.com",
  projectId: "purviewallinone",
  storageBucket: "purviewallinone.appspot.com",
  messagingSenderId: "649404346977",
  appId: "1:649404346977:web:901eff8c0cc31e57073020",
  measurementId: "G-81FJVRCQ0D"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const storage = getStorage(app);
const firestore = getFirestore(app);
const db=getDatabase(app)
const auth= getAuth(app)

export { storage, firestore ,db,app, auth,ref,getDownloadURL};
