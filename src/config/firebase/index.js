// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from '@config/environment';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Authorization firebase
// const firebaseAuth = getAuth(firebaseApp);
// const firebaseProvider = new GoogleAuthProvider();
// const firebaseDB = getFirestore(firebaseApp);

const firebaseStorage = getStorage(firebaseApp);

export { firebaseApp, firebaseStorage };
