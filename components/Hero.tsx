'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Star, Menu, MessageSquare, QrCode, Film, Video, Heart, Lock, Clock, Anchor } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import SponsorshipModal from './SponsorshipModal';

const supabase = createClient('https://eajxgrbxvkhfmmfiotpm.supabase.co', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

// BUSINESS RULES
const ROTATION_MS = 12780000; 
const MAX_PLAYS = 2; 

const FP_THEMES = [
  { id: 'FP1', title: 'POP ANTHEMS', mood: 'energy' },
  { id: 'FP2', title: 'ACOUSTIC SOUL', mood: 'soul' }
];

export default function Hero() {
  const [currentFP, setCurrentFP] = useState(FP_THEMES[0]);
  const [timeLeft, setTimeLeft] = useState('');
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [videoClips, setVideoClips] = useState<any[]>([]);
  const [playCounts, setPlayCounts] = useState<{[key:string]: number}>({});
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const updateRotation = () => {
      const now = Date.now();
      const globalIndex = Math.floor(now / ROTATION_MS) % FP_THEMES.length;
      setCurrentFP(FP_THEMES[globalIndex]);
      const nextSwitch = (Math.floor(now / ROTATION_MS) + 1) * ROTATION_MS;
      const msRemaining = nextSwitch - now;
      const mins = Math.floor((msRemaining / (1000 * 60)) % 60);
      const hrs = Math.floor((msRemaining / (1000 * 60 * 60)));
      setTimeLeft(`${hrs}h ${mins}m`);
    };
    updateRotation();
    const timer = setInterval(updateRotation, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function fetchData() {
      const { data: audio } = await supabase.from('tracks').select('*').ilike('tags', `%${currentFP.mood}%`).ilike('artist', '%Kleigh%').limit(6);
      if (audio) setPlaylist(audio);
      const { data: video } = await supabase.from('tracks').select('*').or('url.ilike.%.mp4,tags.ilike.%clip%').ilike('artist', '%Kleigh%').limit(3);
      if (video) setVideoClips(video);
    }
    fetchData();
  }, [currentFP]);

  const handlePlay = (index: number) => {
    const track = playlist[index];
    const currentCount = playCounts[track.id] || 0;
    if (currentCount >= MAX_PLAYS) { setIsModalOpen(true); return; }
    if (currentTrackIndex !== index || !isPlaying) setPlayCounts(prev => ({...prev, [track.id]: currentCount + 1}));
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (audioRef.current) { isPlaying ? audioRef.current.pause() : audioRef.current.play(); setIsPlaying(!isPlaying); }
  };

  const cleanTitle = (t: any) => (t?.title || t?.name || '').replace(/^\d+\s*-\s*/,'').replace(/kleigh\s*-\s*/i,'').replace(/\.mp3|\.wav/gi,'').replace(/_/g,' ');
  const activeTrack = playlist[currentTrackIndex];

  // SCROLL TO VISUALS
  const scrollToVisuals = () => {
    const element = document.getElementById('visuals-feed');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen w-full bg-[#3E2723] text-[#D7CCC8] pt-24 pb-20 flex flex-col items-center overflow-x-hidden font-sans">
      
      {/* UPDATED NAV: INCLUDES CLIPS & VIDEOS */}
      <nav className="absolute top-0 w-full p-4 flex justify-between items-center z-50 bg-[#3E2723]/90 backdrop-blur-sm border-b border-[#D7CCC8]/10">
        <div className="flex items-center gap-3">
           <img src="/gpm_logp.jpg" alt="GPM" className="w-10 h-10 rounded-md border border-[#D7CCC8]/20" />
           <div className="hidden md:block font-black text-xs tracking-widest text-[#D7CCC8]">G PUTNAM MUSIC, LLC</div>
        </div>
        
        {/* NEW MENU LINKS */}
        <div className="flex items-center gap-6 text-[10px] font-bold tracking-[0.15em] text-[#FFD54F] uppercase">
           <button onClick={scrollToVisuals} className="hover:text-white transition">Clips</button>
           <button onClick={scrollToVisuals} className="hover:text-white transition">Videos</button>
           <button onClick={() => setIsModalOpen(true)} className="bg-[#FFD54F] text-[#3E2723] px-3 py-1 rounded-full hover:scale-105 transition flex items-center gap-1">
             <Heart size={10} fill="currentColor" /> Join
           </button>
        </div>
      </nav>

      <SponsorshipModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {activeTrack && (
        <audio ref={audioRef} src={activeTrack.public_url || activeTrack.url} onEnded={() => setCurrentTrackIndex((prev) => (prev + 1) % playlist.length)} autoPlay={isPlaying} />
      )}

      {/* PLAYER UI */}
      <div className="container mx-auto px-4 text-center z-10 mt-8 mb-16 relative">
        <h1 className="text-[10rem] md:text-[14rem] leading-none font-black text-[#5D4037] opacity-50 absolute left-1/2 -translate-x-1/2 top-10 pointer-events-none select-none">KLEIGH</h1>
        <div className="bg-[#4E342E]/90 backdrop-blur-md border border-[#D7CCC8]/20 p-8 rounded-3xl max-w-2xl mx-auto mt-20 shadow-2xl relative z-10">
           <div className="flex justify-between items-center mb-6">
              <span className="bg-[#FFD54F] text-[#3E2723] text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest flex items-center gap-2"><Star size={10} fill="currentColor" /> {currentFP.title}</span>
              <div className="flex items-center gap-2 text-[10px] font-mono text-[#FFD54F]"><Clock size={10} /> {timeLeft}</div>
           </div>
           <div className="flex flex-col items-center mb-8">
              <div className="w-32 h-32 bg-[#FFD54F] rounded-full flex items-center justify-center mb-6 shadow-xl text-[#3E2723] ring-4 ring-[#D7CCC8]/20">
                 <button onClick={togglePlay} className="hover:scale-110 transition">{isPlaying ? <Pause size={48} fill="currentColor" /> : <Play size={48} fill="currentColor" className="ml-2" />}</button>
              </div>
              <h2 className="text-3xl font-black text-white mb-1 text-center leading-tight">{cleanTitle(activeTrack)}</h2>
           </div>
           <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-hide">
              {playlist.map((track, idx) => (
                 <div key={track.id || idx} onClick={() => handlePlay(idx)} className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition ${idx === currentTrackIndex ? 'bg-[#D7CCC8] text-[#3E2723]' : 'bg-[#3E2723]/50 hover:bg-[#5D4037]'}`}>
                    <div className="flex items-center gap-4 flex-1"><div className="text-[10px] font-black opacity-50">0{idx + 1}</div><div className="text-sm font-bold truncate">{cleanTitle(track)}</div></div>
                    {playCounts[track.id] >= MAX_PLAYS && <Lock size={12} className="text-[#FFD54F]" />}
                 </div>
              ))}
           </div>
        </div>
      </div>

      {/* CLIPS & VIDEO FEED (ID ADDED FOR NAV) */}
      <div id="visuals-feed" className="container mx-auto px-4 z-10 max-w-4xl mb-20">
         <div className="flex items-center gap-2 mb-6 border-b border-[#D7CCC8]/10 pb-2">
            <Film size={20} className="text-[#FFD54F]" />
            <h3 className="text-xl font-black text-[#D7CCC8] tracking-widest">CLIPS & VISUALS</h3>
         </div>
         {videoClips.length === 0 ? (
            <div className="text-center p-8 border border-dashed border-[#D7CCC8]/20 rounded-xl opacity-50"><p>Syncing Visuals from GPM Vault...</p></div>
         ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
               {videoClips.map((clip) => (
                  <a key={clip.id} href={clip.public_url || clip.url} target="_blank" className="aspect-[9/16] bg-[#4E342E] rounded-2xl relative overflow-hidden group cursor-pointer border border-[#D7CCC8]/10 hover:border-[#FFD54F] transition shadow-lg block">
                     <div className="absolute inset-0 bg-[#3E2723] opacity-50 group-hover:opacity-30 transition"></div>
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-[#FFD54F]/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition"><Play size={20} className="text-[#FFD54F]" fill="currentColor" /></div>
                     </div>
                     <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-[#3E2723] to-transparent">
                        <h4 className="font-bold text-white leading-tight">{cleanTitle(clip)}</h4>
                     </div>
                  </a>
               ))}
            </div>
         )}
      </div>

      {/* MICHAEL CLAY BIO */}
      <div className="container mx-auto px-4 max-w-4xl border-t border-[#D7CCC8]/10 pt-8">
         <div className="flex flex-col md:flex-row items-center gap-8 bg-[#4E342E]/50 p-6 rounded-3xl border border-[#FFD54F]/10">
            <div className="w-24 h-24 bg-[#FFD54F] rounded-full flex items-center justify-center shrink-0 shadow-xl"><span className="font-black text-[#3E2723] text-2xl">MC</span></div>
            <div className="text-center md:text-left">
               <div className="inline-block bg-[#FFD54F] text-[#3E2723] px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest mb-2">Introducing Michael Clay</div>
               <p className="text-[#D7CCC8] text-sm leading-relaxed font-medium">Behind the Kleigh sound is the distinct composition of <strong>Michael Clay</strong>. Pianist. Vocalist. Producer. The architecture of GPM Pop.</p>
            </div>
         </div>
      </div>
    </section>
  );
}
