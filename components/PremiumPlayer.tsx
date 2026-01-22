"use client";

import { useState, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Zap } from 'lucide-react';

export default function PremiumPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // TRACK CONFIGURATION (Sample Track)
  const track = {
    title: "Shine the Light",
    artist: "G Putnam Music",
    // We use the QR Code as the album art for branding
    cover: "/gpm_qrcode.png", 
    // This is a sample MP3. For production, you will replace this with a real URL from your Supabase data later.
    audioSrc: "https://s3.amazonaws.com/media.sample.com/shine_light.mp3" 
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto overflow-hidden rounded-3xl shadow-2xl bg-neutral-900 border border-neutral-800">
      
      {/* Dynamic Background Blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 blur-2xl scale-125 transition-transform duration-1000"
        style={{ 
          backgroundImage: `url(${track.cover})`,
          transform: isPlaying ? 'scale(1.3)' : 'scale(1.1)' 
        }}
      />
      
      {/* Glass Content Layer */}
      <div className="relative z-10 p-8 flex flex-col items-center text-white backdrop-blur-sm">
        
        {/* Album Art with "Sponsor Me" Badge */}
        <div className="relative w-64 h-64 mb-6 group">
          <div className="w-full h-full rounded-2xl shadow-2xl overflow-hidden border-2 border-white/10 relative z-0">
            <img src={track.cover} alt="Album Art" className="object-cover w-full h-full" />
          </div>
          
          {/* HOVER EFFECT: Shows Sponsor Link */}
          <a 
            href="https://buy.stripe.com/4gM14n4KD8Zg1zI8ZO9IQ03" 
            target="_blank"
            className="absolute inset-0 z-10 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl cursor-pointer"
          >
            <Zap className="text-yellow-400 mb-2" size={32} />
            <span className="font-bold text-sm tracking-widest uppercase">Become a Sponsor</span>
          </a>
        </div>

        {/* Track Info */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight mb-1">{track.title}</h2>
          <p className="text-blue-400 text-sm font-medium tracking-wide uppercase">{track.artist}</p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-10 mb-8">
          <button className="text-neutral-400 hover:text-white transition active:scale-95"><SkipBack size={28} /></button>
          
          <button 
            onClick={togglePlay}
            className="bg-white text-black p-5 rounded-full hover:scale-105 transition shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            {isPlaying ? <Pause size={36} fill="black" /> : <Play size={36} fill="black" className="ml-1" />}
          </button>
          
          <button className="text-neutral-400 hover:text-white transition active:scale-95"><SkipForward size={28} /></button>
        </div>

        {/* The "Golden" Sponsorship Button */}
        <a 
          href="https://buy.stripe.com/4gM14n4KD8Zg1zI8ZO9IQ03" 
          target="_blank" 
          className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-800 rounded-full text-white text-xs font-bold tracking-widest hover:brightness-110 transition shadow-lg border border-yellow-500/30"
        >
          <Zap size={14} className="text-yellow-200" />
          SPONSOR THIS EXPERIENCE
        </a>

        {/* Hidden Audio Element */}
        <audio ref={audioRef} src={track.audioSrc} />
      </div>
    </div>
  );
}
