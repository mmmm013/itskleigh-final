'use client';
import { useState } from 'react';
import { Play, Zap, CloudRain, Moon, Sun, Coffee, Radio } from 'lucide-react';

// --- CONFIGURATION ---
const BUCKET_URL = "https://eajxgrbxvkhfmmfiotpm.supabase.co/storage/v1/object/public/tracks";

// --- KLEIGH MOOD POOL ---
const KLEIGH_POOL = [
  { 
    filename: "038 - kleigh - bought into your game.mp3", 
    title: "Bought Into Your Game", 
    artist: "Kleigh", 
    moodColor: "#FFD700" 
  }
];

export default function FeaturedPlaylists() {
  
  const handleVibeClick = (vibe: string) => {
    const track = KLEIGH_POOL[Math.floor(Math.random() * KLEIGH_POOL.length)];
    const event = new CustomEvent('play-track', { 
      detail: { 
        url: `${BUCKET_URL}/${track.filename}`, 
        title: track.title, 
        artist: track.artist,
        moodColor: track.moodColor
      } 
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 text-center">
      
      {/* 1. HERO HEADER */}
      <h1 className="text-6xl md:text-8xl font-black uppercase text-[#FFFDF5] mb-2 tracking-tighter drop-shadow-lg">
        IT'S KLEIGH
      </h1>
      <div className="flex items-center justify-center gap-4 text-[#DAA520] text-xs font-bold tracking-[0.3em] mb-12 uppercase">
        <span>Official Stream</span> • <span>Moods</span> • <span>Feelings</span>
      </div>

      {/* 2. MOBILE VIEW: THE "MOOD" CARD (Corrected from Genre) */}
      <div className="md:hidden mb-12">
        <div onClick={() => handleVibeClick('HIGH_ENERGY')}
             className="bg-[#3E2723] rounded-3xl p-8 shadow-2xl border border-[#FFD54F]/20 cursor-pointer active:scale-95 transition-transform duration-200 relative overflow-hidden group">
           
           {/* Top Badge: NOW SAYS A MOOD, NOT A GENRE */}
           <div className="flex justify-between items-start mb-8 relative z-10">
             <span className="bg-[#FFD54F] text-[#3E2723] px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-2">
               <Zap size={10} fill="currentColor" /> HIGH ENERGY
             </span>
             <span className="text-[#FFD54F] text-[10px] font-mono opacity-80">Live Mix</span>
           </div>

           {/* Big Play Button */}
           <div className="w-24 h-24 mx-auto bg-[#FFD54F] rounded-full flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 transition-transform duration-300">
             <Play size={40} className="text-[#3E2723] ml-1" fill="currentColor" />
           </div>

           {/* Footer Text */}
           <div className="text-[#D7CCC8] text-xs font-bold uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">
             Tap to Feel
           </div>
        </div>
      </div>

      {/* 3. DESKTOP VIEW: THE MOOD SELECTOR */}
      <div className="hidden md:block">
        <h3 className="text-[#D7CCC8] text-sm font-bold uppercase tracking-widest mb-6 opacity-60">Select Your Feeling</h3>
        
        <div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto">
          <VibeButton icon={<CloudRain size={18}/>} label="Melancholy" onClick={() => handleVibeClick('MELANCHOLY')} />
          <VibeButton icon={<Zap size={18}/>} label="Ethereal" onClick={() => handleVibeClick('ETHEREAL')} />
          <VibeButton icon={<Coffee size={18}/>} label="Focus" onClick={() => handleVibeClick('FOCUS')} />
          <VibeButton icon={<Sun size={18}/>} label="Uplifting" onClick={() => handleVibeClick('UPLIFTING')} />
          
          <VibeButton icon={<Zap size={18} fill="currentColor"/>} label="High Energy" isActive={true} onClick={() => handleVibeClick('HIGH_ENERGY')} />
          <VibeButton icon={<Moon size={18}/>} label="Late Night" onClick={() => handleVibeClick('LATE_NIGHT')} />
          <VibeButton icon={<Sun size={18}/>} label="Sunrise" onClick={() => handleVibeClick('SUNRISE')} />
          <VibeButton icon={<Radio size={18}/>} label="Surprise Me" onClick={() => handleVibeClick('RANDOM')} />
        </div>
      </div>

    </div>
  );
}

function VibeButton({ icon, label, isActive = false, onClick }: any) {
  return (
    <button onClick={onClick}
      className={`group flex flex-col items-center justify-center p-6 rounded-xl border transition-all duration-300 h-32
      ${isActive 
        ? 'bg-gradient-to-br from-[#FFD54F]/20 to-transparent border-[#FFD54F] shadow-[0_0_20px_rgba(255,213,79,0.2)]' 
        : 'bg-[#2C241B]/50 border-[#D7CCC8]/10 hover:border-[#FFD54F]/50 hover:bg-[#2C241B] hover:-translate-y-1'}`}
    >
      <div className={`mb-3 transition-colors duration-300 ${isActive ? 'text-[#FFD54F]' : 'text-[#D7CCC8] group-hover:text-[#FFD54F]'}`}>
        {icon}
      </div>
      <span className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${isActive ? 'text-white' : 'text-[#D7CCC8] group-hover:text-white'}`}>
        {label}
      </span>
    </button>
  );
}
