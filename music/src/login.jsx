import { useState,useEffect } from "react";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  getAuth
} from "firebase/auth";
import { auth } from "./firebase-config";
import { db } from './firebase-config';
import { addDoc, collection, getDocs,doc, setDoc} from 'firebase/firestore';
import LoginForm from "./loginform";
import { useRecoilValue } from "recoil";
import { Link } from 'react-router-dom';


export default function Signup() {
  const [user, setUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  

  const auth = getAuth();
  const userLoggedIn = auth.currentUser;

  
  const userCollectionRef = collection(db, 'users');

  const createUser = async () => {
    let userToCreate ;
    if (userLoggedIn) {
        userToCreate=userLoggedIn.uid;
    } else {
        console.log("Please log  in first");
    }
    /* tracks.forEach(async (track) => {
        await addDoc(userCollectionRef, track);
        }

    ); */

  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);



  const login = async () => {
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      localStorage.setItem('uid',user.user.uid);
      console.log(localStorage.getItem('uid'));

      console.log(user);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      
      <div
        style={{
          maxWidth:'60%',
          backgroundColor: '',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0px 2px 4px rgba(0, 1, 1, 0.9)',
          display:'flex',
          flexDirection:'column',
          marginTop:'-20%',
        }}
      >
        <h1 style={{ color: 'green', marginBottom: '20px' ,display:'flex',justifyContent:'center', }}>Login</h1>
        <h1 style={{color:'green',fontSize:'16px',display:'flex',justifyContent:'center'}}>Groove Your Way In!</h1>

        <div style={{marginTop:'50%' ,gap:'10px',display:'flex',flexDirection:'column'}}>
          <input
            placeholder="Email"
            type='email'
            style={{
              padding: '10px',
              border: '1px solid gray',
              borderRadius: '5px',
              marginBottom: '10px',
            }}
            onChange={(event) =>setLoginEmail(event.target.value)
            }
          />
          <input
            placeholder="Password"
            type='password'
            style={{
              padding: '10px',
              border: '1px solid gray',
              borderRadius: '5px',
              marginBottom: '10px',
            }}
            onChange={(event) =>  setLoginPassword(event.target.value)}
          />
          <button
            type="button"
            onClick={() => {
              login();
            }}
            style={{
              backgroundColor: 'green',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '5px',
              hover: 'cursor-pointer',
            }}
          >
            Login
          </button>

        </div>
        {/* <Link to="/signup" className="header-link">
          Signup
        </Link> */}

        <Link style={{color:'black',marginTop:'10px',marginLeft:'5px'}} to="/signup">Already a user? Signup</Link>
        
      </div>
      
    </div>
  );
}
