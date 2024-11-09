import { Route, Routes,useNavigate, json } from 'react-router-dom';
import Header from './Header';
import { useEffect, useState } from 'react';
import { get } from 'colornames';
import Playlist from './Playlist';
import Tracks from './tracks';
import Test from './test';
import Test2 from './test2';
import Signup from './signup';
import Login from './login';
import { db } from './firebase-config';
import Rooms from './rooms';
import Room from './room';
import { setDoc,doc,getDoc } from 'firebase/firestore';
import room from './room';


function App() {
	const client_id = "f7c37a156d784ebe863225216e645c13";
	const client_secret = "322fc3939d3d412b9b43dbc4828d48ee";
	
	const [search, setSearch] = useState('');
	const [accessToken, setAccessToken] = useState('');
	const[roomId,setRoomId]=useState('');
	const [albums, setAlbums] = useState(() => {
		const storedAlbums = localStorage.getItem('albums');

		try {
		  return storedAlbums ? JSON.parse(storedAlbums) : [];

		} catch (error) {
		  console.error('Error parsing playlist:', error);
		  return [];
		}
	  });
	  
	const [currentTrack, setCurrentTrack] = useState(null);
	const [audio, setAudio] = useState(null);
	const [playlist, setPlaylist] = useState(() => {
		const storedPlaylist = localStorage.getItem('playlist');
		try {
		  return storedPlaylist ? JSON.parse(storedPlaylist) : [];
		} catch (error) {
		  console.error('Error parsing playlist:', error);
		  return [];
		}
	  });

	  useEffect(() => {
		const fetchPlaylist = async () => {
		  try {
			const uid = localStorage.getItem('uid');
			const docRef = doc(db, 'users', uid);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
			  const data = docSnap.data();
			  const { exists, ...playlistWithoutExists } = data;
			  const playlistArray = Object.values(playlistWithoutExists);
			  setPlaylist(playlistArray);
			} else {
			  setPlaylist([]);
			}
		  } catch (error) {
			console.error('Error fetching playlist:', error);
			setPlaylist([]);
		  }
		};
	
		fetchPlaylist();
	  }, []);
	useEffect(() => {
		let authParameters = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: 'grant_type=client_credentials&client_id=' + client_id + '&client_secret=' + client_secret
		}
		
		fetch('https://accounts.spotify.com/api/token', authParameters)
		.then(response => response.json())
		.then(data => setAccessToken(data.access_token));
	}, []);
	
	useEffect(() => {
		localStorage.setItem('albums', JSON.stringify(albums));
	}, [albums]);
	
	useEffect(() => {
		localStorage.setItem('playlist', JSON.stringify(playlist));
	}, [playlist]);
	
	useEffect(() => {
		setPlaylist(() => {
			const storedPlaylist = localStorage.getItem('playlist');
			return storedPlaylist ? JSON.parse(storedPlaylist) : [];
		});
	}, []);
	
	useEffect(() => {
		if (search === "" && currentTrack) {
			get_recommended(currentTrack);
		} else {
			search_album();
		}
	}, [search]);

	
	
	const search_album = async () => {
		let trackParameters = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + accessToken
			}
		}
		try{
			let trackResults = await fetch(`https://api.spotify.com/v1/search?q=${search}&type=track&market=US&limit=50`, trackParameters)
			.then(response => response.json())
			.then(data => data.tracks.items)
			setAlbums(trackResults)
		}catch(err){
			console.error(err);
		}
	}
	
	const handlePlayPause = () => {
		if (currentTrack.isPlaying) {
			audio.pause();
		} else {
			audio.play().catch((err) => {
				console.log(err);
			});
		}
		setCurrentTrack({
			...currentTrack,
			isPlaying: !currentTrack.isPlaying
		});
	}
	
	const setCurrentTrackAndAudio = async (trackId) => {
		if (audio) {
			audio.pause();
		}
		let trackParameters = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + accessToken
			}
		}
		
		let fullTrack = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, trackParameters)
		.then(response => response.json())
		.then(data => data);
		let audioElement = new Audio(fullTrack.preview_url);
		audioElement.onended = () => {
			setCurrentTrack(null);
		};
		setAudio(audioElement);
		setCurrentTrack({
			...fullTrack,
			isPlaying: false
		});
	}
	
	const get_recommended = async (currentTrack) => {
		if (!currentTrack) return;
		
		const recommendedParameters = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + accessToken
			}
		};
		
		const seedTrackId = currentTrack.id;
		const seedParameters = `seed_tracks=${seedTrackId}&market=US&limit=20`;
		
		const recommendedResults = await fetch(`https://api.spotify.com/v1/recommendations?${seedParameters}`, recommendedParameters)
		.then(response => response.json())
		.then(data => data.tracks);
		setAlbums(recommendedResults);
	};


	const set_playlist = async (track) => {
		console.log(track)
		if (playlist.some(item => item.id === track.id)) {
		  delete_from_playlist(track);
		} else {
		  setPlaylist([...playlist, track]);
		  const docRef = doc(db, 'users', `${localStorage.getItem('uid')}`);
		  const docSnap = await getDoc(docRef);
		  const currentTracksObject = docSnap.exists() ? docSnap.data() : {};
	  
		  // Finding maximum numbered track
		  const trackKeys = Object.keys(currentTracksObject);
		  const maxTrackNum = trackKeys.reduce((max, key) => {
			const trackNum = parseInt(key.replace('track', ''));
			return trackNum > max ? trackNum : max;
		  }, 0);
		  //building new track key
		  const trackKey = `track${maxTrackNum + 1}`;
	  
		  const updatedTracksObject = {
			...currentTracksObject,
			[trackKey]: track
		  };
	  
		  await setDoc(docRef, updatedTracksObject);
		}
	  };
	  

	const delete_from_playlist = async (track) => {
		const updatedList = playlist.filter((song) => song.id !== track.id);
		setPlaylist(updatedList);
	  
		const docRef = doc(db, 'users', `${localStorage.getItem('uid')}`);
		const docSnap = await getDoc(docRef);
		const currentTracksObject = docSnap.exists() ? docSnap.data() : {};
	  
		// Remove the track from the current tracksObject
		const updatedTracksObject = { ...currentTracksObject };
		Object.keys(updatedTracksObject).forEach((key) => {
		  if (updatedTracksObject[key].id === track.id) {
			delete updatedTracksObject[key];
		  }
		});
	  
		// Update the tracksObject in the database
		await setDoc(docRef, updatedTracksObject);
	  };


	  const addTrackToRoom = async (roomId, track) => {
		try {
		  const roomDocRef = doc(db, 'rooms', roomId);
		  const roomDocSnap = await getDoc(roomDocRef);
	
		  if (roomDocSnap.exists()) {
			const roomData = roomDocSnap.data();
			const updatedTracks = [...roomData.tracks, track];
	
			await updateDoc(roomDocRef, { tracks: updatedTracks });
	
			console.log('Track added to room successfully.');
		  } else {
			console.log('Room not found.');
		  }
		} catch (error) {
		  console.error('Error adding track to room:', error);
		}
	  };
	  
	

	return (
		<div className="App">
			    {['/', '/playlist'].includes(window.location.pathname) && (
      <Header
        title="Home"
        search={search}
        setSearch={setSearch}
        search_album={search_album}
        playlist={playlist}
      />
    )}
			
			<Routes>
				<Route path='/' element={<Tracks
					albums={albums}
					setCurrentTrackAndAudio={setCurrentTrackAndAudio}
					set_playlist={set_playlist}
					currentTrack={currentTrack}
					addTrackToRoom={addTrackToRoom}
					handlePlayPause={handlePlayPause}
					playlist={playlist}/>}>
				</Route>
				<Route path='/playlist' element={<Playlist
					playlist={playlist}
					setCurrentTrackAndAudio={setCurrentTrackAndAudio}
					handlePlayPause={handlePlayPause}
					set_playlist={set_playlist}
					currentTrack={currentTrack}/>}> 
				</Route>

				<Route path='/test' element={ <Test/> }></Route>
				<Route path='/test2' element={ <Test2/> }></Route>
				<Route path='/signup' element={ <Signup/> }></Route>
				<Route path='/login' element={ <Login/> }></Route>
				<Route path='/rooms' element={ <Rooms roomId={roomId} setRoomId={setRoomId}/> }></Route>
				<Route path="/room/:roomId" element={<Room roomId={roomId} />} />
			</Routes>
		</div>
		);
}	

export default App;