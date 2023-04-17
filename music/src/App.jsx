import { Route, Routes,useNavigate, json } from 'react-router-dom';
import Header from './Header';
import { useEffect, useState } from 'react';
import { get } from 'colornames';
import Playlist from './Playlist';
import Tracks from './tracks';

function App() {
	const client_id = "f7c37a156d784ebe863225216e645c13";
	const client_secret = "322fc3939d3d412b9b43dbc4828d48ee";
	
	const [search, setSearch] = useState('');
	const [accessToken, setAccessToken] = useState('');
	const [albums, setAlbums] = useState(() => {
		const storedAlbums = localStorage.getItem('albums');
		return storedAlbums ? JSON.parse(storedAlbums) : [];
	});
	const [isLoading, setIsLoading] = useState(true);
	const [currentTrack, setCurrentTrack] = useState(null);
	const [audio, setAudio] = useState(null);
	const [recommended,setRecommended]=useState([]);
	const [playlist,setPlaylist]=useState(() => {
		const storedPlaylist = localStorage.getItem('playlist');
		return storedPlaylist? JSON.parse(storedPlaylist):[];
	});
	
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
		
		let trackResults = await fetch(`https://api.spotify.com/v1/search?q=${search}&type=track&market=US&limit=50`, trackParameters)
		.then(response => response.json())
		.then(data => data.tracks.items)
		setAlbums(trackResults)
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
	
	const setCurrentTrackAndAudio = async (track) => {
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
		
		let fullTrack = await fetch(`https://api.spotify.com/v1/tracks/${track.id}`, trackParameters)
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
	
	const set_playlist = (track) => {
		setPlaylist([...playlist, track]);
	};
	
	return (
		<div className="App">
			<Header
			title="Music Player"
			search={search}
			setSearch={setSearch}
			search_album={search_album}
			playlist={playlist}
			/>
			
			<Routes>
				<Route path='/' element={<Tracks
					albums={albums}
					setCurrentTrackAndAudio={setCurrentTrackAndAudio}
					set_playlist={set_playlist}
					currentTrack={currentTrack}
					handlePlayPause={handlePlayPause}/>}>
				</Route>
				<Route path='/playlist' element={<Playlist
					playlist={playlist}
					setCurrentTrackAndAudio={setCurrentTrackAndAudio}
					handlePlayPause={handlePlayPause}
					set_playlist={set_playlist}
					currentTrack={currentTrack}/>}> 
				</Route>
			</Routes>
		</div>
		);
}	

export default App;