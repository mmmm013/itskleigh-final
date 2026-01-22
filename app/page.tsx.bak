'use client';

import { useState } from 'react';
import Image from 'next/image';
import { usePlayer } from '@/components/PlayerContext';
import { Zap, Moon, Sun, MessageSquare, Music, CloudRain, Wind, Activity } from 'lucide-react';

export default function Home() {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();
  const [activeVibe, setActiveVibe] = useState('focus');

  // THE FULL 8-VIBE GRID (Matches your "Right" Image)
  const vibes = [
    { id: 'melancholy', label: 'Melancholy', icon: CloudRain, color: 'from-blue-900/50' },
    { id: 'dreamy', label: 'dreamy', icon: Wind, color: 'from-purple-900/50' },
    { id: 'focus', label: 'Focus', icon: Music, color: 'from-emerald-900/50' },
    { id: 'uplifting', label: 'Uplifting', icon: Activity, color: 'from-orange-900/50' },
    { id: 'energy', label: 'High Energy', icon: Zap, color: 'from-yellow-900/50' },
    { id: 'night', label: 'Late Night', icon: Moon, color: 'from-indigo-900/50' },
    { id: 'sunrise', label: 'Sunrise', icon: Sun, color: 'from-rose-900/50' },
    { id: 'bot', label: 'Ask the Bot', icon: MessageSquare, color: 'from-cyan-900/50' },
  ];

  const currentVibeLabel = vibes.find(v => v.id === activeVibe)?.label || 'FOCUS';

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      
      {/* BACKGROUND IMAGE - Uses the file we know exists */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/hero.jpg" 
          alt="Kleigh Background" 
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60" />
      </div>

      {/* HERO SECTION */}
      <div className="relative z-10 flex h-[75vh] flex-col items-center justify-center text-center px-4">
        
        {/* Main Title */}
        <h1 className="font-black uppercase tracking-tighter text-white drop-shadow-2xl text-[12vw] leading-none mb-4">
          IT'S KLEIGH
        </h1>

        {/* Subtitle / Status */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-amber-500 uppercase">
            Official Stream • Live Rotation
          </span>
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-white/30"></span>
            <span className="text-xl md:text-2xl font-light tracking-[0.2em] text-white uppercase">
              • {currentVibeLabel} •
            </span>
            <span className="h-px w-12 bg-white/30"></span>
          </div>
        </div>

      </div>

      {/* VIBE SELECTOR (Bottom Grid) */}
      <div className="relative z-20 mx-auto w-full max-w-5xl px-6 pb-20">
        <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-4">
           <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase">Select Your Vibe</span>
           <span className="text-[10px] text-neutral-600 uppercase tracking-widest">G Putnam Archives</span>
        </div>

        {/* 8-GRID LAYOUT */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {vibes.map((vibe) => (
            <button
              key={vibe.id}
              onClick={() => setActiveVibe(vibe.id)}
              className={`group relative h-24 md:h-32 overflow-hidden rounded-xl border bg-neutral-900/40 backdrop-blur-sm transition-all duration-300 ${
                activeVibe === vibe.id 
                  ? 'border-white ring-1 ring-white/50 bg-neutral-800/60' 
                  : 'border-white/10 hover:border-white/30 hover:bg-neutral-800/40'
              }`}
            >
              {/* Hover Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${vibe.color} to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
              
              {/* Icon & Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
# 1. Update the file locally
cat <<'EOF' > app/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { usePlayer } from '@/components/PlayerContext';
import { Zap, Moon, Sun, MessageSquare, Music, CloudRain, Wind, Activity } from 'lucide-react';

export default function Home() {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();
  const [activeVibe, setActiveVibe] = useState('focus');

  // THE FULL 8-VIBE GRID (Matches your "Right" Image)
  const vibes = [
    { id: 'melancholy', label: 'Melancholy', icon: CloudRain, color: 'from-blue-900/50' },
    { id: 'dreamy', label: 'dreamy', icon: Wind, color: 'from-purple-900/50' },
    { id: 'focus', label: 'Focus', icon: Music, color: 'from-emerald-900/50' },
    { id: 'uplifting', label: 'Uplifting', icon: Activity, color: 'from-orange-900/50' },
    { id: 'energy', label: 'High Energy', icon: Zap, color: 'from-yellow-900/50' },
    { id: 'night', label: 'Late Night', icon: Moon, color: 'from-indigo-900/50' },
    { id: 'sunrise', label: 'Sunrise', icon: Sun, color: 'from-rose-900/50' },
    { id: 'bot', label: 'Ask the Bot', icon: MessageSquare, color: 'from-cyan-900/50' },
  ];

  const currentVibeLabel = vibes.find(v => v.id === activeVibe)?.label || 'FOCUS';

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      
      {/* BACKGROUND IMAGE - Uses the file we know exists */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/hero.jpg" 
          alt="Kleigh Background" 
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60" />
      </div>

      {/* HERO SECTION */}
      <div className="relative z-10 flex h-[75vh] flex-col items-center justify-center text-center px-4">
        
        {/* Main Title */}
        <h1 className="font-black uppercase tracking-tighter text-white drop-shadow-2xl text-[12vw] leading-none mb-4">
          IT'S KLEIGH
        </h1>

        {/* Subtitle / Status */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-amber-500 uppercase">
            Official Stream • Live Rotation
          </span>
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-white/30"></span>
            <span className="text-xl md:text-2xl font-light tracking-[0.2em] text-white uppercase">
              • {currentVibeLabel} •
            </span>
            <span className="h-px w-12 bg-white/30"></span>
          </div>
        </div>

      </div>

      {/* VIBE SELECTOR (Bottom Grid) */}
      <div className="relative z-20 mx-auto w-full max-w-5xl px-6 pb-20">
        <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-4">
           <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase">Select Your Vibe</span>
           <span className="text-[10px] text-neutral-600 uppercase tracking-widest">G Putnam Archives</span>
        </div>

        {/* 8-GRID LAYOUT */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {vibes.map((vibe) => (
            <button
              key={vibe.id}
              onClick={() => setActiveVibe(vibe.id)}
              className={`group relative h-24 md:h-32 overflow-hidden rounded-xl border bg-neutral-900/40 backdrop-blur-sm transition-all duration-300 ${
                activeVibe === vibe.id 
                  ? 'border-white ring-1 ring-white/50 bg-neutral-800/60' 
                  : 'border-white/10 hover:border-white/30 hover:bg-neutral-800/40'
              }`}
            >
              {/* Hover Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${vibe.color} to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
              
              {/* Icon & Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <vibe.icon size={20} className={`text-neutral-400 transition-colors group-hover:text-white ${activeVibe === vibe.id ? 'text-white' : ''}`} />
                <span className={`text-[10px] font-bold tracking-widest uppercase transition-colors ${activeVibe === vibe.id ? 'text-white' : 'text-neutral-400 group-hover:text-white'}`}>
                  {vibe.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
