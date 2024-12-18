import React, { useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

export default function App() {
  const [playlists] = useState({
    "A. R. Rahman": [
      { id: 1, title: "Pudhu Vellai Mazhai", src: "./resources/Pudhu-Vellai-Mazhai.mp3" },
      { id: 2, title: "Kadhal Rojave", src: "./resources/Kadhal-Rojave.mp3" },
    ],
    "Energetic Beats": [
      { id: 1, title: "Energy", src: "https://www.bensound.com/bensound-music/bensound-energy.mp3" },
      { id: 2, title: "Happy Rock", src: "https://www.bensound.com/bensound-music/bensound-happyrock.mp3" },
    ],
    "Sunny Vibes": [
      { id: 1, title: "Sunny", src: "https://www.bensound.com/bensound-music/bensound-sunny.mp3" },
      { id: 2, title: "Adventure", src: "https://www.bensound.com/bensound-music/bensound-adventure.mp3" },
    ],
    "Memorable Melodies": [
      { id: 1, title: "Memories", src: "https://www.bensound.com/bensound-music/bensound-memories.mp3" },
      { id: 2, title: "Buddy", src: "https://www.bensound.com/bensound-music/bensound-buddy.mp3" },
    ],
    "Relaxation Tunes": [
      { id: 1, title: "Ukulele", src: "https://www.bensound.com/bensound-music/bensound-ukulele.mp3" },
      { id: 2, title: "Relaxing", src: "https://www.bensound.com/bensound-music/bensound-relaxing.mp3" },
    ],
    "Dreamy Escapes": [
      { id: 1, title: "Dreams", src: "https://www.bensound.com/bensound-music/bensound-dreams.mp3" },
      { id: 2, title: "Funkorama", src: "https://www.bensound.com/bensound-music/bensound-funkorama.mp3" },
    ],
    "Cute & Lovely": [
      { id: 1, title: "Cute", src: "https://www.bensound.com/bensound-music/bensound-cute.mp3" },
      { id: 2, title: "Love", src: "https://www.bensound.com/bensound-music/bensound-love.mp3" },
    ],
    "Jazzy Feels": [
      { id: 1, title: "Jazzy Frenchy", src: "https://www.bensound.com/bensound-music/bensound-jazzyfrenchy.mp3" },
      { id: 2, title: "Epic", src: "https://www.bensound.com/bensound-music/bensound-epic.mp3" },
    ],
    "Once Again Playlist": [
      { id: 1, title: "Once Again", src: "https://www.bensound.com/bensound-music/bensound-onceagain.mp3" },
      { id: 2, title: "Sweet", src: "https://www.bensound.com/bensound-music/bensound-sweet.mp3" },
    ],
    "Smile Playlist": [
      { id: 1, title: "Smile", src: "https://www.bensound.com/bensound-music/bensound-smile.mp3" },
      { id: 2, title: "Tomorrow", src: "https://www.bensound.com/bensound-music/bensound-tomorrow.mp3" },
    ],
  });

  const [currentPlaylist, setCurrentPlaylist] = useState("A. R. Rahman");
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const handleNext = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % playlists[currentPlaylist].length);
  };

  const handlePrevious = () => {
    setCurrentSongIndex((prevIndex) =>
      prevIndex === 0 ? playlists[currentPlaylist].length - 1 : prevIndex - 1
    );
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Prabu Playlists</h2>
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
      <p style={styles.nowPlaying}>
        Now Playing: {playlists[currentPlaylist][currentSongIndex].title}
      </p>
      <AudioPlayer
        src={playlists[currentPlaylist][currentSongIndex].src}
        onPlay={() => console.log("Playing")}
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
            {song.title}
          </li>
        ))}
      </ul>
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
