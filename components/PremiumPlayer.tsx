"use client";

import { useMemo } from 'react';
import { Play, Pause, SkipForward, SkipBack, Zap } from 'lucide-react';
import { usePlayer } from './PlayerContext';

export default function PremiumPlayer() {
  const { currentTrack, isPlaying, playTrack, togglePlay, nextTrack, prevTrack } = usePlayer();

  // TRACK CONFIGURATION (Sample Track)
  const sample = useMemo(() => ({
    id: 'premium-sample',
    title: 'Shine the Light',
    artist: 'G Putnam Music',
    cover: '/file.svg',
    url: 'https://s3.amazonaws.com/media.sample.com/shine_light.mp3'
  }), []);

  const handleToggle = () => {
    if (currentTrack?.id === sample.id) {
      togglePlay();
    } else {
      playTrack(sample, [sample]);
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto overflow-hidden rounded-3xl shadow-2xl bg-neutral-900 border border-neutral-800">
      {/* Dynamic Background Blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 blur-2xl scale-125 transition-transform duration-1000"
        style={{ backgroundImage: `url(${sample.cover})` }}
      />

      {/* Glass Content Layer */}
      <div className="relative z-10 p-8 flex flex-col items-center text-white backdrop-blur-sm">
        <div className="relative w-64 h-64 mb-6 group">
          <div className="w-full h-full rounded-2xl shadow-2xl overflow-hidden border-2 border-white/10 relative z-0">
            <img src={sample.cover} alt="Album Art" className="object-cover w-full h-full" />
          </div>

          <a 
            href="https://buy.stripe.com/4gM14n4KD8Zg1zI8ZO9IQ03" 
            target="_blank"
            className="absolute inset-0 z-10 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl cursor-pointer"
          >
            <Zap className="text-yellow-400 mb-2" size={32} />
            <span className="font-bold text-sm tracking-widest uppercase">Become a Sponsor</span>
          </a>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight mb-1">{sample.title}</h2>
          <p className="text-blue-400 text-sm font-medium tracking-wide uppercase">{sample.artist}</p>
        </div>

        <div className="flex items-center gap-10 mb-8">
          <button onClick={prevTrack} className="text-neutral-400 hover:text-white transition active:scale-95"><SkipBack size={28} /></button>
          <button 
            onClick={handleToggle}
            className="bg-white text-black p-5 rounded-full hover:scale-105 transition shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            {currentTrack?.id === sample.id && isPlaying ? <Pause size={36} fill="black" /> : <Play size={36} fill="black" className="ml-1" />}
          </button>
          <button onClick={nextTrack} className="text-neutral-400 hover:text-white transition active:scale-95"><SkipForward size={28} /></button>
        </div>

        <a 
          href="https://buy.stripe.com/4gM14n4KD8Zg1zI8ZO9IQ03" 
          target="_blank" 
          className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-800 rounded-full text-white text-xs font-bold tracking-widest hover:brightness-110 transition shadow-lg border border-yellow-500/30"
        >
          <Zap size={14} className="text-yellow-200" />
          SPONSOR THIS EXPERIENCE
        </a>
      </div>
    </div>
  );
}
