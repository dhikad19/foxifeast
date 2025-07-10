import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDQ3mAOaBOEiLgfjM0KIzNh4jj9gQVmCek",
  authDomain: "foxifeast.firebaseapp.com",
  projectId: "foxifeast",
  storageBucket: "foxifeast.firebasestorage.app",
  messagingSenderId: "47584954436",
  appId: "1:47584954436:web:cc8eeb5e223da53264d411",
  measurementId: "G-N3V0XHN7DM",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const storage = getStorage(app);
export { auth, db };
