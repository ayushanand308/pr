import React, { useEffect, useState } from 'react';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase-config';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { roomIdState } from './recoil/atom/roomId';
import { auth } from './firebase-config';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  getAuth,
} from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


function Rooms() {
  const [roomName, setRoomName] = useState('');
  const [roomsList, setRoomsList] = useState([]);
  const roomCollectionRef = collection(db, 'rooms');

  const [roomId, setRoomId] = useRecoilState(roomIdState);
  const navigate = useNavigate();

  const auth = getAuth();
  const userLoggedIn = auth.currentUser;

  const createRoomDocument = async () => {
    if (roomName.trim() !== '') {
      try {
        await setDoc(doc(roomCollectionRef, `${roomName}`), {
          admin: userLoggedIn.uid,
          users: [],
          tracks: [],
        });
        console.log('Room document created:', roomName);
        setRoomName('');
        fetchRoomsList();
      } catch (error) {
        console.log(error.message);
      }
    } else {
      console.log('Please enter a valid room name.');
    }
  };

  const fetchRoomsList = async () => {
    try {
      const querySnapshot = await getDocs(roomCollectionRef);
      const rooms = [];
      querySnapshot.forEach((doc) => {
        rooms.push(doc.id);
      });
      setRoomsList(rooms);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchRoomsList();
  }, []);

  return (
    <div
      style={{
        backgroundColor: '#f5f5f5',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        marginTop: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <h1 style={{ color: '#333', marginBottom: '20px', fontSize: '24px' }}>
        Create a New Room
      </h1>
      <input
        placeholder="Room Name "
        value={roomName}
        style={{
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          marginBottom: '10px',
          width: '100%',
        }}
        onChange={(event) => {
          // Use JavaScript to limit the input to 12 characters
            setRoomName(event.target.value);
        }}
      />
      <button
        type="button"
        onClick={createRoomDocument}
        style={{
          backgroundColor: '#1DB954',
          color: '#fff',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
          border: 'none',
        }}
      >
        Create Room
      </button>
      {/* Display the list of rooms in rows */}
      <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap',alignContent:'center',justifyContent:'center' }}>
        {roomsList.map((room) => (
          <div
            key={room}
            style={{
              flex: '0 0 calc(25% - 20px)', // 4 items per row
              margin: '10px',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <p className='testing'
              style={{
                color: '#333',
                fontWeight: 'bold',
                margin: '0',
              }}
            >
              {room}
            </p>
            <button
              onClick={() => {
                navigate(`/room/${room}`);
                setRoomId(room);
              }}
              style={{
                backgroundColor: '#1DB954',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '5px',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              Go To
            </button>
          </div>
        ))}
      </div>
      <style jsx>{`
      .testing{
        display:flex,
        flex-direction:column;
        justify-content:center;
        align-items:center;
        width:160px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
        
      `}</style>
    </div>
  );
}

export default Rooms;
