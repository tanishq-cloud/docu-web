import { initializeApp, getApp, getApps } from "firebase/app";
import { getStorage, ref, listAll,uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc } from "firebase/firestore";
import  { getAuth } from "firebase/auth";

// fetching from .env.local
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
const storage = getStorage(app);
const db = getFirestore(app);
const auth  = getAuth(app);

export { doc, app, auth, db, storage, ref, listAll, getDownloadURL, uploadBytes};