const trakcs=({albums,setCurrentTrackAndAudio,set_playlist,currentTrack,handlePlayPause})=>{
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
              <h1>{track.name}</h1>
              <div className="buttons">
                <button onClick={() => set_playlist(track)}>Add to Playlist</button>
                <button
                  className="btn1"
                  onClick={() => setCurrentTrackAndAudio(track)}
                >
                  Choose song
                </button>
                {currentTrack && currentTrack.id === track.id && (
                  <button className="btn2" onClick={handlePlayPause}>
                    {currentTrack.isPlaying ? "Pause" : "Play"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
  )
}

export default trakcs