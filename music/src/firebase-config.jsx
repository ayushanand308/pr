import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyChAHXfswJot6NMPAIKcZT5tW8gi42qzlg",
    authDomain: "authdev-601af.firebaseapp.com",
    projectId: "authdev-601af",
    storageBucket: "authdev-601af.appspot.com",
    messagingSenderId: "1042173116427",
    appId: "1:1042173116427:web:4bef72a96e30637f8bc70e",
    measurementId: "G-14E1C8TCB4"
  };
    

const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);
export const auth = getAuth(app);
