import React, { useState } from "react";
import { setDoc,doc,getDoc } from 'firebase/firestore';
import { db } from './firebase-config';


const trakcs=({albums,setCurrentTrackAndAudio,set_playlist,currentTrack,handlePlayPause,playlist})=>{
  const [roomInput, setRoomInput] = useState('');

  const handleAddToRoom = (track) => {
    addToRoom(roomInput, track); // Call the addToRoom function with the room ID and track
  };

  const addToRoom = async (roomId, track) => {
    try {
      const docRef = doc(db, 'rooms', roomId);
      const docSnap = await getDoc(docRef);
      const currentTracksObject = docSnap.exists() ? docSnap.data() : {};
  
      // Assuming the existing tracks are stored in an array called 'tracks'
      const existingTracks = currentTracksObject.tracks || [];
      console.log(existingTracks);
      
      // Append the new track to the existing tracks array
      const updatedTracksArray = [...existingTracks, track];
  
      const updatedTracksObject = { ...currentTracksObject, tracks: updatedTracksArray };
      await setDoc(docRef, updatedTracksObject);
      console.log('Track added to room successfully.');
    } catch (error) {
      console.error('Error adding track to room:', error);
    }
};
  return(
    <div className="album-list">
        {albums.map((track) => (
          <div className="card" key={track.id}>
            <img
              src={track.album.images[0].url}
              alt=""
              height="200"
              width="200"
            />
            <div className="lowerCont">
              <h1>{track.name.split(/[(,:]/)[0].trim()}</h1>
              <div className="buttons">
                <button onClick={() => set_playlist(track)}>{playlist.some(item => item.id === track.id) ?"Delete":"Add to playlist"}</button>
                {!(currentTrack && currentTrack.id === track.id) && <button
                  className="btn1"
                  onClick={() => setCurrentTrackAndAudio(track.id)}
                >
                  Choose song
                </button>}
                {currentTrack && currentTrack.id === track.id && (
                  <button className="btn2" onClick={handlePlayPause}>
                    {currentTrack.isPlaying ? "Pause" : "Play"}
                  </button>
                )}
                <input
                type="text"
                placeholder="Enter Room ID"
                value={roomInput}
                onChange={(e) => setRoomInput(e.target.value)}
              />
              <button onClick={() => handleAddToRoom(track)}>Add to Room</button>
              </div>
            </div>
          </div>
        ))}
      </div>
  )
}

export default trakcs