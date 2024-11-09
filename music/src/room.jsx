import React, { useEffect, useState } from 'react';
import { collection, doc, getDoc,getDocs } from 'firebase/firestore';
import { db } from './firebase-config';
import { constSelector, useRecoilValue,useSetRecoilState } from 'recoil';
import { roomIdState } from './recoil/atom/roomId';
import { adminId } from './recoil/atom/adminId';
import ReactPlayer from "react-player";
import io from "socket.io-client";

const socket = io.connect("https://musback.onrender.com");

function Room({ roomId }) {
  const [users, setUsers] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [currentUserName,setCurrentUserName]=useState("");
  const admin= useRecoilValue(adminId);
  const setAdmin = useSetRecoilState(adminId);

  const roomToFind = useRecoilValue(roomIdState);
  const [currentSelectedTrackImg, setCurrentSelectedTrackImg] = useState('');


  const [room, setRoom] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [message, setMessage] = useState(''); // New state for chat messages
  const [messages, setMessages] = useState([]); // State to store chat history

  const joinRoom = () => {
    if (room !== '') {
      socket.emit('join_room', room);
    }
  };

  const togglePlayPause = () => {
    setIsAudioPlaying(!isAudioPlaying);
    socket.emit('toggle_play_pause', { room, isAudioPlaying: !isAudioPlaying });
  };

  const sendCurrentTrackImg = () => {
    if (currentSelectedTrackImg !== '') {
      socket.emit('send_current_track_img', { currentSelectedTrackImg, room });
    }
  };
  

  const sendAudio = () => {
    if (audioUrl !== '') {
      socket.emit('send_audio', { audioUrl, room, isAudioPlaying });
    }
  };

  const broadcastAudioUrl = (url) => {
    socket.emit('send_audio', { audioUrl: url, room, isAudioPlaying });
  };

  const sendMessage = () => {
    if (message.trim() !== '') {
      socket.emit('send_message', { message, room });
      setMessage(''); // Clear the input field
    }
  };

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      console.log("asfdfasd-->");
      setMessages((prevMessages) => [...prevMessages, data]);
    };
  
    socket.on('receive_audio', (data) => {
      setAudioUrl(data.audioUrl);
      setIsAudioPlaying(data.isAudioPlaying);
    });
  
    socket.on('toggle_play_pause', (data) => {
      setIsAudioPlaying(data.isAudioPlaying);
    });
  
    socket.on('user_joined', () => {
      if (audioUrl !== '') {
        broadcastAudioUrl(audioUrl);
      }
    });
    socket.on('receive_current_track_img', (data) => {
      setCurrentSelectedTrackImg(data.currentSelectedTrackImg);
    });
  
    // Listen for incoming chat messages
    socket.on('receive_message', handleReceiveMessage);
  
    return () => {
      // Clean up the event listener when the component unmounts
      socket.off('receive_message', handleReceiveMessage);
    };

    
  }, [socket, audioUrl]);
  


  const handleSetAudioUrl = (url) => {
    setAudioUrl(url);
    broadcastAudioUrl(url);
  };

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const roomDocRef = doc(db, 'rooms', roomToFind);
        const roomDocSnap = await getDoc(roomDocRef);
        if (roomDocSnap.exists()) {
          const roomData = roomDocSnap.data();
          setAdmin(roomData.admin || '');
          setUsers(roomData.users || []);
          setTracks(roomData.tracks || []);
          socket.emit('user_joined', roomToFind);
        } else {
          console.log('Room not found');
        }
      } catch (error) {
        console.error('Error fetching room data:', error);
      }
    };

    fetchRoomData();
  }, [roomId]);


  const currentuser=localStorage.getItem('uid');

  const getCurrentUserName=async()=>{
    const userNameRef=doc(db, 'usernames', `${currentuser}`);
    const userNameSnap = await getDoc(userNameRef);
    if (userNameSnap.exists()) {
      const userNameData = userNameSnap.data();
      setCurrentUserName(userNameData.username || 'Login First');
    }
  }
  useEffect(() => {
    getCurrentUserName();
  }, []);

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column', // Make the container a row
      justifyContent: 'center',
      alignItems: 'center',

      flexWrap:'wrap' // Add space between left and right sections
    },
    leftSection: {
      display: 'flex',
      flexDirection: 'column', // Make the left section a column
      justifyContent: 'center',
      flex: 1, // Take up all available space in the left section
      marginLeft: '20px',
      marginTop:"50px"
       // Add some spacing between left and right sections
    },
    rightSection: {
      flex: 1, // Take up all available space in the right section
    },
    roomContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    },
    roomControls: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '20px',
      flexWrap:'wrap',
      gap:'10px'

    },
    roomInput: {
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      marginRight: '10px',
    },
    roomButton: {
      backgroundColor: '#1DB954',
      color: '#fff',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      marginRight: '10px',
    },
    playPauseButton: {
      backgroundColor: '#1DB954',
      color: '#fff',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      marginLeft: '10px',
    },
    audioContainer: {
      textAlign: 'center',
      marginBottom: '20px',
    },
    roomAdmin: {
      marginTop: '20px',
      fontSize: '18px',
    },
    userList: {
      listStyleType: 'none',
      padding: '0',
    },
    albumList: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '20px',
      marginBottom: '30px',
    },
    card: {
      border: '1px solid #ccc',
      borderRadius: '5px',
      padding: '10px',
      width: '220px',
      backgroundColor: '#fff',
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
    },
    setAudioButton: {
      backgroundColor: '#1DB954',
      color: '#fff',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      marginTop: '10px',
    },
    chatContainer: {
      marginTop: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      marginTop: '20px',
    },
    chatHeader: {
      fontSize: '20px',
      marginTop: '20px',
    },
    chatHistory: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid #ccc',
      borderRadius: '5px',
      padding: '10px',
      width: '100%',
      height: '600px',
      overflowY: 'auto',
    },
    message: {
      display: 'flex',
      marginBottom: '5px',
    },
    username: {
      marginRight: '5px',
      fontWeight: 'bold',
    },
    chatInput: {
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      width: '100%',
      marginTop: '10px',
    },
    sendButton: {
      backgroundColor: '#1DB954',
      color: '#fff',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      marginTop: '10px',
    },
    image:{
      borderRadius: '10px',
      width: '80%',
      height: '100%',
      marginBottom: '20px',
    },
    audioPlayer:{
      display: "none"
    },
    messages:{
      fontWeight:'bold',
      wordWrap: 'break-word', // Add this line to enable word wrapping
      textAlign: 'left', // Add this line for left alignment

    },
    /* '@media (max-width: 600px)': {
      roomControls: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '200px',
      },
    }, */
  };

  
    return (
      <div style={styles.container}>
        <div style={styles.leftSection}>
          {/* Left section content */}
          <div style={styles.roomControls}>
            <input
              style={styles.roomInput}
              placeholder="Room Number..."
              onChange={(event) => {
                setRoom(event.target.value);
              }}
            />
            <button style={styles.roomButton} onClick={joinRoom}>
              Join Room
            </button>

            {/* <input
              style={styles.roomInput}
              placeholder="Audio URL..."
              onChange={(event) => {
                setAudioUrl(event.target.value);
              }}
            />
            {
              currentuser===admin && 
            <button style={styles.roomButton} onClick={sendAudio}>
              Send Audio
            </button>} */}

            {
              currentuser===admin &&
              <button style={styles.playPauseButton} onClick={togglePlayPause}>
              {isAudioPlaying ? "Pause" : "Play"}
            </button>
            }
            
          </div>

          <div style={styles.rightSection}>
        {/* Right section content */}
        <div style={styles.chatContainer}>
          {/* Chatbox */}
          <h2 style={styles.chatHeader}>Chat:</h2>
          <div style={styles.chatHistory}>
            {/* Chat history */}
            {messages.map((msg, index) => (
              <div key={index} style={styles.message}>
                <span style={styles.username}>@{currentUserName}:</span>
                <span style={styles.messages}>{msg.text}</span>
              </div>
            ))}
          </div>
          <input
            type="text"
            style={styles.chatInput}
            placeholder="Type a message..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <button style={styles.sendButton} onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>

          <div style={styles.audioContainer}>
            <img src={currentSelectedTrackImg} alt="" style={styles.image}  />
            <ReactPlayer style={styles.audioPlayer} url={audioUrl} playing={isAudioPlaying} controls={true} />
          </div>
          <h1>Admin: @{currentUserName}</h1>
          <h2>Tracks:</h2>
          <div style={styles.albumList}>
            {tracks.length === 0 ? (
              <p>No tracks</p>
            ) : (
              tracks.map((track, index) => (
                <div style={styles.card} key={index}>
                  <img
                    src= {track.album.images[0].url}
                    alt=""
                    height="200"
                    width="200"
                  />
                  <div className="lowerCont">
                    <h1>{track.name.split(/[(,:]/)[0].trim()}</h1>
                    <div className="buttons">
                      {/* Add your buttons and other content here */}
                    </div>
                  </div>
                  {
                    currentuser===admin && 
                    <button
                    style={styles.setAudioButton}
                    onClick={() => {
                      setCurrentSelectedTrackImg(track.album.images[0].url)
                      sendCurrentTrackImg(currentSelectedTrackImg);
                      handleSetAudioUrl(track.preview_url)}}
                  >
                    Set Audio URL
                  </button>
                  }
                </div>
              ))
            )}
          </div>
        </div>
      
    </div>
    );
}

export default Room;
