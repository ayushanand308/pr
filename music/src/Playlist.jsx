const Playlist=({playlist,set_playlist,setCurrentTrackAndAudio,handlePlayPause,currentTrack})=>{
    return(
        <div className="album-list">
        {playlist.length!==0?(playlist.map((track) => (
          <div className="card" key={track.id}>
{/*             {console.log(track.id)};
 */}            <img
              src={track.album.images[0].url}
              alt=""
              height="200"
              width="200"
            />
            <div className="lowerCont">
            <h1 className="cardh1">{track.name.split(/[(,:]/)[0].trim()}</h1>
              <div className="buttons">
                <button onClick={() => set_playlist(track)}>{playlist.some(item => item.id === track.id)?"Delete":"Add to playlist"}</button>
                <button
                  className="btn1"
                  onClick={() => {setCurrentTrackAndAudio(track.id);console.log(track.id+"this here--")}}
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
        ))): <p style={{display:'flex',justifyContent:"center",alignItems:'center'}}>Playlist Empty</p> }
      </div>
    )
}

export default Playlist