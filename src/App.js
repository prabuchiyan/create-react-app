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
      { title: "Manasilayo", src: "./resources/music/Anirudh/Manasilayo.mp3" },
      { title: "Dheema", src: "./resources/music/Anirudh/Dheema.mp3" },
    ],
  },
  // Add more playlists as needed
];

export default function App() {
  const [playlists, setPlaylists] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [currentPlaylist, setCurrentPlaylist] = useState([]);
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0); // Track current playlist index
  const [isPlaying, setIsPlaying] = useState(false); // State to track play/pause status
  const wavesurferRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    // Set the playlists data when component loads
    setPlaylists(playlistsData);
    setCurrentPlaylist(playlistsData[0].songs); // Start with the first playlist
  }, []);

  useEffect(() => {
    // Clean up any previous instance of WaveSurfer before initializing a new one
    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
    }

    // Initialize WaveSurfer
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

    // Load the current song
    if (currentPlaylist.length > 0) {
      waveSurfer.load(currentPlaylist[currentSongIndex]?.src);
    }

    // Set the reference to the new waveSurfer instance
    wavesurferRef.current = waveSurfer;

    // Listen for when the song is fully loaded, and play it
    waveSurfer.on('ready', () => {
      if (isPlaying) {
        waveSurfer.play();  // Play the song once it's ready
      }
    });

    // Clean up on unmount
    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, [currentPlaylist, currentSongIndex, isPlaying]);  // Re-run when currentSongIndex or isPlaying changes

  const handleNext = () => {
    // Go to next song, loop back to the first song if at the end of the playlist
    setCurrentSongIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % currentPlaylist.length;
      return nextIndex;
    });
    setIsPlaying(true); // Set to playing when moving to the next song
  };

  const handlePrevious = () => {
    // Go to previous song, loop back to the last song if at the start of the playlist
    setCurrentSongIndex((prevIndex) => {
      const prevIndex1 = prevIndex === 0 ? currentPlaylist.length - 1 : prevIndex - 1;
      return prevIndex1;
    });
    setIsPlaying(true); // Set to playing when moving to the previous song
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

  const handlePlaylistSelect = (playlist, index) => {
    setCurrentPlaylist(playlist.songs);
    setCurrentPlaylistIndex(index); // Set the index of the selected playlist
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
            onClick={() => handlePlaylistSelect(playlist, idx)}
            style={{
              ...styles.playlistButton,
              backgroundColor: idx === currentPlaylistIndex ? "#ff7f50" : "#4b0082", // Highlight current playlist
            }}
          >
            {playlist.name} ({playlist.songs.length}) {/* Display song count */}
          </button>
        ))}
      </div>

      <ul style={styles.playlist}>
        {currentPlaylist.map((song, index) => (
          <li
            key={index}
            style={{
              ...styles.song,
              backgroundColor: index === currentSongIndex ? "#ff7f50" : "#4b0082", // Highlight current song
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
    flexWrap: "wrap", // Ensure buttons wrap on smaller screens
  },
  playlistButton: {
    backgroundColor: "#4b0082",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 20px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    margin: "5px", // Add some space between buttons
    flexBasis: "45%", // Allow buttons to take up space on smaller screens
    minWidth: "150px", // Ensure buttons are not too small
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
  // Media Queries for responsiveness
  "@media (max-width: 768px)": {
    container: {
      padding: "15px",
    },
    heading: {
      fontSize: "24px",
    },
    nowPlaying: {
      fontSize: "16px",
    },
    controlButton: {
      fontSize: "14px",
      padding: "8px 16px",
    },
    playlistButton: {
      padding: "8px 16px",
      fontSize: "14px",
    },
    song: {
      fontSize: "14px",
      padding: "8px",
    },
  },
  "@media (max-width: 480px)": {
    container: {
      padding: "10px",
    },
    heading: {
      fontSize: "20px",
    },
    nowPlaying: {
      fontSize: "14px",
    },
    controlButton: {
      fontSize: "12px",
      padding: "6px 12px",
    },
    playlistButton: {
      padding: "6px 12px",
      fontSize: "12px",
    },
    song: {
      fontSize: "12px",
      padding: "6px",
    },
  },
};
