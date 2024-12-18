import React, { useState, useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

// Example static folder structure (this simulates what would be in your public/music folder)
const playlistsData = [
  {
    name: "A. R. Rahman",
    songs: [
      { title: "Pudhu Vellai Mazhai", src: "./resources/music/A_R_Rahman/Pudhu-Vellai-Mazhai.mp3" },
      { title: "Kadhal Rojave", src: "./resources/music/A_R_Rahman/Kadhal-Rojave.mp3" },
    ],
  },
  {
    name: "Anirudh",
    songs: [
      { title: "Happy Rock", src: "./resources/music/Anirudh/Pudhu-Vellai-Mazhai.mp3" },
      { title: "Energy", src: "./resources/music/Anirudh/Energy.mp3" },
    ],
  },
  {
    name: "Sunny Vibes",
    songs: [
      { title: "Sunny", src: "./resources/music/Sunny_Vibes/Sunny.mp3" },
      { title: "Adventure", src: "./resources/music/Sunny_Vibes/Adventure.mp3" },
    ],
  },
  // Add more playlists as needed
];

export default function App() {
  const [playlists, setPlaylists] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [currentPlaylist, setCurrentPlaylist] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false); // New state to track play/pause status
  const wavesurferRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    // Set the playlists data when component loads
    setPlaylists(playlistsData);
    setCurrentPlaylist(playlistsData[0].songs); // Start with the first playlist
  }, []);

  useEffect(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
    }

    const waveSurfer = WaveSurfer.create({
      container: playerRef.current,
      waveColor: "#4b0082",
      progressColor: "#ff7f50",
      barWidth: 3,
      height: 150,
      responsive: true,
      cursorColor: "#ff7f50",
      cursorWidth: 2,
      barGap: 2,
    });

    if (currentPlaylist.length > 0) {
      waveSurfer.load(currentPlaylist[currentSongIndex]?.src);
    }

    wavesurferRef.current = waveSurfer;

    return () => {
      waveSurfer.destroy();
    };
  }, [currentPlaylist, currentSongIndex]);

  const handleNext = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % currentPlaylist.length);
  };

  const handlePrevious = () => {
    setCurrentSongIndex((prevIndex) =>
      prevIndex === 0 ? currentPlaylist.length - 1 : prevIndex - 1
    );
  };

  const handlePlayPause = () => {
    if (wavesurferRef.current.isPlaying()) {
      wavesurferRef.current.pause();
      setIsPlaying(false); // Set play state to false when paused
    } else {
      wavesurferRef.current.play();
      setIsPlaying(true); // Set play state to true when playing
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Prabu Playlists</h2>
      <p style={styles.nowPlaying}>
        Now Playing: {currentPlaylist[currentSongIndex]?.title || "Loading..."}
      </p>

      <div ref={playerRef} style={styles.waveform}></div>

      <div style={styles.controls}>
        <button onClick={handlePrevious} style={styles.controlButton}>
          Prev
        </button>
        <button onClick={handlePlayPause} style={styles.controlButton}>
          {isPlaying ? "Pause" : "Play"} {/* Dynamically change the button label */}
        </button>
        <button onClick={handleNext} style={styles.controlButton}>
          Next
        </button>
      </div>

      <div style={styles.playlistSelector}>
        {playlists.map((playlist, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPlaylist(playlist.songs)}
            style={styles.playlistButton}
          >
            {playlist.name}
          </button>
        ))}
      </div>

      <ul style={styles.playlist}>
        {currentPlaylist.map((song, index) => (
          <li
            key={index}
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
  waveform: {
    width: "100%",
    marginTop: "20px",
    marginBottom: "20px",
    position: "relative",
  },
  controls: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "15px",
  },
  controlButton: {
    backgroundColor: "#4b0082",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  playlistSelector: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    gap: "15px",
  },
  playlistButton: {
    backgroundColor: "#4b0082",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 20px",
    cursor: "pointer",
    transition: "background-color 0.3s",
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
