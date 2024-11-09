import React from 'react';
import { useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from './firebase-config';
import { db } from './firebase-config';
import { addDoc, collection, getDocs,doc, setDoc,query,where} from 'firebase/firestore';
import { Link } from 'react-router-dom';





export default function Signup() {
  const [isButtonDisable, setIsButtonDisable] = useState(true);
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [user, setUser] = useState(null);
  const userCollectionRef = collection(db, 'users');

  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);


  const check = async () => {
    const q = query(collection(db, 'usernames'), where('username', '==', registerUsername));
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      setIsButtonDisable(true);
      alert("Username already exists");
    }
    else{
      setUsernameAvailable(true);
    }
  }

  useEffect(() => {
    check();
  }, [registerUsername]);

  const register = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      const newUser = userCredential.user;
      try{
        await setDoc(doc(db, "users", `${newUser.uid}` ), {
          exists: true
        });

        await setDoc(doc(db, "usernames", `${newUser.uid}` ), {
          username: `${registerUsername}`}
        );

        setUsernameAvailable(false);

      }
      catch(error){
        console.log(error.message)
      }
      console.log(newUser);
    } catch (error) {
      console.log(error.message);
    }
  };

  const checkButton = () => {
    if (registerEmail !== '' && registerPassword !== '' && registerUsername !== '') {
      setIsButtonDisable(true);
      return false;
    }
      setIsButtonDisable(false);
      return true;
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
        <h1 style={{ color: 'green', marginBottom: '20px' ,display:'flex',justifyContent:'center', }}>Signup</h1>

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
            onChange={(event) => setRegisterEmail(event.target.value)}
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
            onChange={(event) => setRegisterPassword(event.target.value)}
          />
          <input
            placeholder="Username"
            type='text'
            style={{
              padding: '10px',
              border: '1px solid gray',
              borderRadius: '5px',
              marginBottom: '10px',
            }}
            onChange={(event) => {
              setRegisterUsername(event.target.value)
              console.log(registerUsername)
            }}
          />
          <button
            type="button"
            onClick={register}
            disabled={checkButton==true && usernameAvailable}
            style={{
              backgroundColor: 'green',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '5px',
              hover: 'cursor-pointer',
            }}
          >
            Next
          </button>

          <Link style={{color:'black',marginTop:'10px',display:'flex',justifyContent:'center',alignContent:'center'}} to="/login">Not a user? Signup</Link>


        </div>
        
      </div>
    </div>
  );
}
