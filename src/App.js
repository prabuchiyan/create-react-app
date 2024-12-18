import React, { useState, useEffect } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const CLIENT_ID = 'uzbfr1fa1nc6fbj';  // Replace with your Dropbox App's client ID
const CLIENT_SECRET = '05nvjajmj99qbx7';  // Replace with your Dropbox App's client secret
const REDIRECT_URI = 'http://localhost:3001/';  // Your redirect URI

function App() {
  const [playlists, setPlaylists] = useState({});
  const [currentPlaylist, setCurrentPlaylist] = useState("Playlist1");
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [accessToken, setAccessToken] = useState(null);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    handleAuthRedirect();
  }, []);

  // Handle OAuth Redirect
  const handleAuthRedirect = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // Exchange the code for an access token
      const response = await fetch('https://api.dropboxapi.com/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          redirect_uri: REDIRECT_URI,
          grant_type: 'authorization_code',
        }),
      });

      const data = await response.json();
      setAccessToken(data.access_token);
      fetchFilesFromDropbox(data.access_token);
    }
  };

  // Fetch files from Dropbox and get temporary links for MP3 files
  const fetchFilesFromDropbox = async (accessToken) => {
    const response = await fetch('https://api.dropboxapi.com/2/files/list_folder', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: '',  // Use an empty string to list the root directory or specify a folder path (e.g., '/Folder1')
      }),
    });
  
    const data = await response.json();
    console.log(data.entries); // This will list all files and folders at the specified path


    // const data = await response.json();
    const mp3Files = data?.entries?.filter(file => file.name.endsWith('.mp3'));

    // Get temporary links for each MP3 file
    const filesWithLinks = await Promise.all(mp3Files?.map(async (file) => {
      const tempLink = await getTemporaryLink(file.path_display, accessToken);
      return {
        ...file,
        src: tempLink,  // Use the temporary link for streaming
      };
    }));

    setFiles(filesWithLinks);

    // Create a dynamic playlist based on the files fetched
    const dynamicPlaylist = {
      Playlist1: filesWithLinks?.map((file, index) => ({
        id: index + 1,
        title: file.name,
        artist: 'Unknown',  // You can modify this if you have artist info
        album: 'Unknown',  // Modify if album info is available
        src: file.src,
        image: '',  // Optional: Add album artwork if available
      })),
    };

    setPlaylists(dynamicPlaylist);
  };

  // Generate temporary link for an MP3 file from Dropbox
  const getTemporaryLink = async (filePath, accessToken) => {
    const response = await fetch('https://api.dropboxapi.com/2/files/get_temporary_link', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: filePath,
      }),
    });

    const data = await response.json();
    return data.link;  // This is the temporary link for streaming
  };

  const handleNext = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % playlists[currentPlaylist].length);
  };

  const handlePrevious = () => {
    setCurrentSongIndex((prevIndex) =>
      prevIndex === 0 ? playlists[currentPlaylist].length - 1 : prevIndex - 1
    );
  };

  const currentSong = playlists[currentPlaylist] && playlists[currentPlaylist][currentSongIndex];
  
  // Start OAuth flow
  const authenticate = () => {
    const authUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}`;
    window.location.href = authUrl;
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Dynamic Music Player</h2>
      <button onClick={authenticate} style={styles.authButton}>
        Login to Dropbox
      </button>
      {accessToken && (
        <div>
          <h3>Your Files from Dropbox:</h3>
          <ul style={styles.filesList}>
            {files?.map((file) => (
              <li key={file.id} style={styles.fileItem}>
                {file.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div style={styles.playlistSelector}>
        {Object.keys(playlists)?.map((playlistName) => (
          <button
            key={playlistName}
            onClick={() => {
              setCurrentPlaylist(playlistName);
              setCurrentSongIndex(0);
            }}
            style={{
              ...styles.playlistButton,
              backgroundColor: currentPlaylist === playlistName ? "#ff7f50" : "#4b0082",
              color: currentPlaylist === playlistName ? "#000" : "#fff",
            }}
          >
            {playlistName}
          </button>
        ))}
      </div>
      {currentSong && (
        <>
          {currentSong.image && (
            <img
              src={currentSong.image}
              alt="Album Art"
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "8px",
                margin: "20px 0",
                objectFit: "cover",
              }}
            />
          )}
          <p style={styles.nowPlaying}>
            Now Playing: <strong>{currentSong.title}</strong> by {currentSong.artist}
          </p>
          <p style={styles.albumName}>Album: {currentSong.album}</p>
          <AudioPlayer
            src={currentSong.src}
            onClickNext={handleNext}
            onClickPrevious={handlePrevious}
            onEnded={handleNext}
            showSkipControls
            showJumpControls={false}
            style={styles.audioPlayer}
          />
          <ul style={styles.playlist}>
            {playlists[currentPlaylist]?.map((song, index) => (
              <li
                key={song.id}
                style={{
                  ...styles.song,
                  backgroundColor: index === currentSongIndex ? "#ff7f50" : "#4b0082",
                  color: index === currentSongIndex ? "#000" : "#fff",
                }}
                onClick={() => setCurrentSongIndex(index)}
              >
                {song.title} - {song.artist}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    textAlign: "center",
    fontFamily: "'Poppins', sans-serif",
    padding: "20px",
    border: "2px solid #ff7f50",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #4b0082, #ff7f50)",
    color: "#fff",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
  },
  heading: {
    fontSize: "28px",
    marginBottom: "15px",
  },
  authButton: {
    padding: "10px 20px",
    backgroundColor: "#4b0082",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    marginBottom: "20px",
  },
  filesList: {
    listStyleType: "none",
    padding: 0,
  },
  fileItem: {
    padding: "10px",
    backgroundColor: "#fff",
    color: "#4b0082",
    margin: "5px 0",
    borderRadius: "8px",
  },
  nowPlaying: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  albumName: {
    fontSize: "16px",
    fontStyle: "italic",
    marginBottom: "20px",
  },
  audioPlayer: {
    marginTop: "15px",
    borderRadius: "10px",
    backgroundColor: "#fff",
    maxWidth: "100%",
  },
  playlistSelector: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: "20px",
    gap: "10px",
  },
  playlistButton: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s, color 0.3s",
    fontSize: "14px",
    fontWeight: "bold",
  },
  playlist: {
    listStyleType: "none",
    padding: 0,
    marginTop: "20px",
  },
  song: {
    padding: "10px",
    backgroundColor: "#4b0082",
    color: "#fff",
    margin: "5px 0",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default App;
