'use client';
import { useState, useEffect, useRef } from 'react';
import { Pause, Play } from 'lucide-react';

export default function GlobalPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  // DEFAULT STATE (The "Ready" Mode)
  const [track, setTrack] = useState({
    title: "GPM Audio Engine",
    artist: "Select a Track from the Rotation",
    url: "", 
    moodColor: "#8B4513"
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- THE LISTENER (The Circuit) ---
  useEffect(() => {
    const handleTrackSelect = (e: CustomEvent) => {
      // 1. Receive Data from Grid
      const incoming = e.detail;
      console.log("Audio Engine Received:", incoming);

      // 2. Load Track
      setTrack({
        title: incoming.title,
        artist: incoming.artist,
        url: incoming.url,
        // Robust Fallback for Mood Color
        moodColor: incoming.moodTheme?.primary || incoming.moodColor || "#8B4513"
      });
      
      // 3. Auto-Play
      setIsPlaying(true);
    };

    // Open the Ears
    window.addEventListener('play-track', handleTrackSelect as EventListener);
    // Clean up ears on close
    return () => window.removeEventListener('play-track', handleTrackSelect as EventListener);
  }, []);

  // --- PLAYBACK CONTROLLER ---
  useEffect(() => {
    if (audioRef.current && track.url) {
      if (isPlaying) {
        audioRef.current.play().catch(err => console.error("Playback Error:", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, track.url]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#2C241B] text-[#FFFDF5] p-4 shadow-2xl border-t z-50 transition-colors duration-500"
         style={{ borderColor: track.moodColor }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* TRACK INFO */}
        <div className="flex flex-col">
          <h4 className="text-sm font-bold uppercase tracking-widest transition-colors duration-500"
              style={{ color: track.moodColor === "#8B4513" ? "#FFD54F" : track.moodColor }}>
            {track.title}
          </h4>
          <p className="text-xs opacity-60">{track.artist}</p>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => track.url && setIsPlaying(!isPlaying)}
            className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-white transition text-[#2C241B]"
            style={{ backgroundColor: track.moodColor === "#8B4513" ? "#FFD54F" : track.moodColor }}
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
          </button>
        </div>

        {/* HIDDEN ENGINE */}
        <audio 
          ref={audioRef} 
          src={track.url} 
          onEnded={() => setIsPlaying(false)}
        />
      </div>
    </div>
  );
}
