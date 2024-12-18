import React, { useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

export function App() {
  const [playlists] = useState({
    Playlist1: [
      {
        id: 1,
        title: "Acoustic Breeze",
        artist: "Bensound",
        album: "Relaxation Vibes",
        src: "https://www.bensound.com/bensound-music/bensound-acousticbreeze.mp3",
        image: "https://www.bensound.com/img/bensound-acousticbreeze.jpg",
      },
      {
        id: 2,
        title: "Creative Minds",
        artist: "Bensound",
        album: "Inspiration",
        src: "https://www.bensound.com/bensound-music/bensound-creativeminds.mp3",
        image: "https://www.bensound.com/img/bensound-creativeminds.jpg",
      },
    ],
    Playlist2: [
      {
        id: 1,
        title: "Energy",
        artist: "Bensound",
        album: "Workout Mix",
        src: "https://www.bensound.com/bensound-music/bensound-energy.mp3",
        image: "https://www.bensound.com/img/bensound-energy.jpg",
      },
      {
        id: 2,
        title: "Happy Rock",
        artist: "Bensound",
        album: "Rock Anthems",
        src: "https://www.bensound.com/bensound-music/bensound-happyrock.mp3",
        image: "https://www.bensound.com/img/bensound-happyrock.jpg",
      },
    ],
  });

  const [currentPlaylist, setCurrentPlaylist] = useState("Playlist1");
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const handleNext = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % playlists[currentPlaylist].length);
  };

  const handlePrevious = () => {
    setCurrentSongIndex((prevIndex) =>
      prevIndex === 0 ? playlists[currentPlaylist].length - 1 : prevIndex - 1
    );
  };

  const currentSong = playlists[currentPlaylist][currentSongIndex];

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Dynamic Music Player</h2>
      <div style={styles.playlistSelector}>
        {Object.keys(playlists).map((playlistName) => (
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
            {playlists[currentPlaylist].map((song, index) => (
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
    cursor: "pointer",
    border: "1px solid #fff",
    marginBottom: "5px",
    borderRadius: "8px",
    transition: "background-color 0.3s, color 0.3s",
  },
};

export default App;