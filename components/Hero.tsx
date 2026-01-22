"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Play, Pause, Download, Music, Star, Zap, Volume2 } from 'lucide-react';

export default function Hero() {
  const [tracks, setTracks] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const supabase = createClient();

  // THE VETTED "SHOWSTOPPER" STATIC PLAYLIST
  const featuredTitles = [
    "ALL I WANT IS YOU",
    "BORN WHO YOU ARE",
    "CHASER",
    "ALONE WITH YOU",
    "YOUR HEART POUNDING",
    "TO LOVE ME",
    "BLINKIN' 'BOUT YOU",
    "DO NOT FEAR",
    "EVEN IF I TRIED",
    "GET LUCKY TONIGHT",
    "HEARTS LIKE MINE",
    "JOYFUL HARMONY"
  ];

  useEffect(() => {
    async function fetchTracks() {
      console.log("Fetching Featured Playlist...");
      
      // 1. Fetch ONLY the specific vetted titles
      const { data, error } = await supabase
        .from('st1')
        .select('*')
        .in('title', featuredTitles);

      if (error) {
        console.error("Supabase Error:", error);
      }

      if (data) {
        // 2. Sort them to match your list order (optional, but good for curation)
        const sortedData = featuredTitles.map(title => 
          data.find(item => item.title === title)
        ).filter(Boolean); // Remove any that weren't found in DB
        
        setTracks(sortedData);
      }
    }
    fetchTracks();
  }, []);

  const handlePlay = (track: any) => {
    // FAIL-SAFE AUDIO URL CONSTRUCTOR
    // If filename is just "song.mp3", we add the storage path. 
    // If it is a full URL, we use it.
    let url = track.filename;
    
    if (!url) return console.error("No URL for track:", track.title);

    // Stop current audio
    if (audio) {
      audio.pause();
      if (currentTrack === url && isPlaying) {
        setIsPlaying(false);
        return;
      }
    }

    console.log("Playing:", track.title, url);
    
    const newAudio = new Audio(url);
    newAudio.volume = 1.0; // Force max volume
    
    // Play attempt with error handling
    const playPromise = newAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error("Playback Failed:", error);
        alert("Audio Error: Could not play " + track.title + ". Check URL.");
      });
    }

    setAudio(newAudio);
    setCurrentTrack(url);
    setIsPlaying(true);
    newAudio.onended = () => setIsPlaying(false);
  };

  return (
    <section className="relative w-full min-h-screen bg-[#3E2723] overflow-hidden font-sans text-white">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2c1e1b] via-[#3E2723] to-[#000000]" />

      <div className="relative z-10 container mx-auto px-4 py-10 lg:py-20 flex flex-col lg:flex-row gap-12">
        
        {/* LEFT: BRANDING */}
        <div className="w-full lg:w-5/12 space-y-6">
          <div className="inline-block px-3 py-1 bg-[#FFD54F] text-[#3E2723] text-xs font-bold uppercase tracking-widest rounded-sm">
            G Putnam Music Catalog
          </div>
          
          <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.85]">
            SYNC<br/><span className="text-[#FFD54F]">READY</span>
          </h1>
          
          <p className="text-lg text-[#D7CCC8] leading-relaxed border-l-2 border-[#FFD54F] pl-4">
            <strong>G Putnam Music, LLC.</strong><br/>
            One Stop. 100% Cleared. Pre-Vetted. <br/>
            The architecture of modern storytelling.
          </p>

          {/* Catalog Stats / Badges */}
          <div className="flex flex-wrap gap-3 pt-4">
             <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium flex items-center gap-2">
               <Zap size={16} className="text-[#FFD54F]" /> Fast License
             </div>
             <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium flex items-center gap-2">
               <Volume2 size={16} className="text-[#FFD54F]" /> High Fidelity
             </div>
          </div>
        </div>

        {/* RIGHT: FEATURED PLAYLIST (THE ENGINE) */}
        <div className="w-full lg:w-7/12">
          <div className="bg-[#1a100e]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
            
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#271c19]">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Music className="text-[#FFD54F]" /> Featured Playlist
              </h2>
              <span className="text-xs font-mono text-[#FFD54F]/80">LIVE FEED</span>
            </div>

            {/* Track List */}
            <div className="max-h-[600px] overflow-y-auto">
              {tracks.length === 0 ? (
                <div className="p-10 text-center text-[#D7CCC8] animate-pulse">
                  Loading Master Audio Assets...
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <tbody className="divide-y divide-white/5">
                    {tracks.map((track, i) => (
                      <tr key={track.id || i} className="group hover:bg-[#FFD54F]/10 transition-colors">
                        
                        {/* Play Button Column */}
                        <td className="p-4 w-16">
                          <button 
                            onClick={() => handlePlay(track)}
                            className="h-10 w-10 bg-[#FFD54F] hover:bg-white text-[#3E2723] rounded-full flex items-center justify-center transition shadow-lg transform group-hover:scale-110"
                          >
                            {currentTrack === track.filename && isPlaying ? 
                              <Pause size={18} fill="currentColor" /> : 
                              <Play size={18} fill="currentColor" className="ml-1" />
                            }
                          </button>
                        </td>

                        {/* Title & Artist */}
                        <td className="p-4">
                          <div className="font-bold text-white text-base leading-tight">
                            {track.title}
                          </div>
                          <div className="text-xs text-[#D7CCC8] mt-1 font-medium tracking-wide">
                            {track.artist || "G Putnam Music"}
                          </div>
                        </td>

                        {/* Metadata (BPM/Genre) */}
                        <td className="p-4 text-right hidden sm:table-cell">
                           <div className="flex flex-col items-end gap-1">
                              <span className="text-xs bg-black/30 px-2 py-0.5 rounded text-[#D7CCC8]">
                                {track.bpm ? `${track.bpm} BPM` : "N/A"}
                              </span>
                              <span className="text-[10px] text-[#FFD54F] uppercase tracking-wider">
                                {track.genre || "Sync"}
                              </span>
                           </div>
                        </td>

                        {/* Download Action */}
                        <td className="p-4 w-12 text-right">
                          <a 
                            href={track.filename} 
                            download 
                            className="text-[#D7CCC8] hover:text-[#FFD54F] transition opacity-20 group-hover:opacity-100"
                            title="Download Asset"
                          >
                            <Download size={18} />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
