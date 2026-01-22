"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Play, Pause, Download, Music, Star } from 'lucide-react';

export default function Hero() {
  const [tracks, setTracks] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchTracks() {
      const { data } = await supabase
        .from('st1')
        .select('*')
        .order('id', { ascending: false })
        .limit(6);
      if (data) setTracks(data);
    }
    fetchTracks();
  }, []);

  const handlePlay = (url: string) => {
    if (audio) {
      audio.pause();
      if (currentTrack === url && isPlaying) {
        setIsPlaying(false);
        return;
      }
    }
    const newAudio = new Audio(url);
    newAudio.play();
    setAudio(newAudio);
    setCurrentTrack(url);
    setIsPlaying(true);
    newAudio.onended = () => setIsPlaying(false);
  };

  return (
    <section className="relative w-full min-h-screen bg-[#3E2723] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#4E342E] via-[#3E2723] to-[#271c19] opacity-90" />
      <div className="relative z-10 container mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12">
        <div className="w-full md:w-1/2 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFD54F]/10 rounded-full border border-[#FFD54F]/20">
            <Star size={16} className="text-[#FFD54F]" fill="currentColor" />
            <span className="text-[#FFD54F] text-xs font-bold tracking-widest uppercase">G Putnam Music Presents</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none">
            ITS<span className="text-[#FFD54F]">KLEIGH</span>
          </h1>
          <p className="text-xl text-[#D7CCC8] max-w-lg leading-relaxed">
            The architecture of modern pop. Sync-ready anthems built for
            <span className="text-white font-bold"> high-stakes storytelling</span>.
            100% Cleared. One Stop.
          </p>
          <div className="pt-8 border-t border-white/10">
             <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-[#5D4037] rounded-full flex items-center justify-center border border-[#FFD54F]/30 shadow-inner">
                   <Music className="text-[#FFD54F]" size={24} />
                </div>
                <div>
                   <h3 className="text-white font-bold text-lg">Michael Clay</h3>
                   <p className="text-[#D7CCC8] text-sm">Pianist. Vocalist. Producer. <br/>The architecture of GPM Pop.</p>
                </div>
             </div>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <div className="bg-[#271c19]/50 backdrop-blur-md border border-[#FFD54F]/10 rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-white font-bold text-xl">Latest Drops</h3>
               <span className="text-[#FFD54F] text-xs font-bold uppercase tracking-wider">Live Feed</span>
            </div>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {tracks.length === 0 ? (
                 <div className="text-[#D7CCC8] text-center py-10 italic">Loading catalog assets...</div>
              ) : (
                tracks.map((track) => (
                  <div key={track.id} className="group flex items-center gap-4 p-4 bg-[#3E2723]/60 hover:bg-[#4E342E] rounded-xl transition border border-transparent hover:border-[#FFD54F]/20 cursor-pointer">
                    <button
                      onClick={() => handlePlay(track.filename)}
                      className="h-12 w-12 bg-[#FFD54F] rounded-full flex items-center justify-center text-[#3E2723] shadow-lg group-hover:scale-110 transition"
                    >
                      {currentTrack === track.filename && isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-bold truncate">{track.title || "Untitled Track"}</h4>
                      <div className="flex items-center gap-2 text-xs text-[#D7CCC8]">
                         <span className="px-2 py-0.5 bg-black/20 rounded text-[#FFD54F]">{track.bpm || "Mid"} BPM</span>
                         <span className="truncate">{track.moods ? track.moods[0] : "Cinematic"}</span>
                      </div>
                    </div>
                    <a href={track.filename} download className="p-2 text-[#D7CCC8] hover:text-white transition opacity-0 group-hover:opacity-100">
                      <Download size={20} />
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
