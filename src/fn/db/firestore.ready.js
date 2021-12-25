import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../firebase.config";
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore();
