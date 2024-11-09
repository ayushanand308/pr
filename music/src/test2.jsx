import React from 'react';
import { useState, useEffect } from 'react';
import { db } from './firebase-config';
import { addDoc, collection, getDocs,doc, setDoc} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';







export default function Test2() {
  const [users, setUsers] = useState([]);
  const userCollectionRef = collection(db, 'users');
  const tracks = [
    { name: "song1", url: "xyz" },
    { name: "song2", url: "abc" },
    {name:"song3",url:"mno"}
  ];
  

  const tracksObject = {};
  for (let i = 0; i < tracks.length; i++) {
    const trackKey = `track${i + 1}`;
    tracksObject[trackKey] = tracks[i];
  }

  

  
  const createUser = async () => {
    /* tracks.forEach(async (track) => {
        await addDoc(userCollectionRef, track);
        }
    ); */
    await setDoc(doc(db,'users'),userToCreate)

  };


  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(userCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getUsers();
    createUser()
  }, []);

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>
          <h1>{user.name}</h1>
        </div>
      ))}
    </div>
  );
}
