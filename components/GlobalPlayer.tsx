"use client";
import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { usePlayer } from './PlayerContext';

export default function GlobalPlayer() {
  const { currentTrack, isPlaying, togglePlay, nextTrack, prevTrack } = usePlayer();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;
    if (!audio) return;

    audio.onended = () => {
      nextTrack();
    };

    return () => {
      audio.onended = null;
    };
  }, [nextTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentTrack?.url) {
      if (audio.src !== currentTrack.url) {
        audio.src = currentTrack.url;
      }
    }

    if (isPlaying) {
      audio.play().catch(err => console.warn('Playback interrupted:', err));
    } else {
      audio.pause();
    }
  }, [currentTrack, isPlaying]);

  const moodColor = (currentTrack && (currentTrack as any).moodColor) || '#8B4513';

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#2C241B] text-[#FFFDF5] p-4 shadow-2xl border-t z-50 transition-colors duration-500"
         style={{ borderColor: moodColor }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex flex-col">
          <h4 className="text-sm font-bold uppercase tracking-widest transition-colors duration-500"
              style={{ color: moodColor === '#8B4513' ? '#FFD54F' : moodColor }}>
            {currentTrack?.title || 'GPM Audio Engine'}
          </h4>
          <p className="text-xs opacity-60">{currentTrack?.artist || 'Select a Track'}</p>
        </div>

        <div className="flex items-center gap-6">
          {currentTrack && !currentTrack.url ? (
            <div className="flex items-center gap-3">
              <div className="text-sm font-bold text-[#FFD54F]">Locked</div>
              <button
                onClick={async () => {
                  if (!currentTrack) return;
                  setIsPurchasing(true);
                  try {
                    const res = await fetch('/api/create-checkout', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ track: currentTrack })
                    });
                    const json = await res.json();
                    if (json.url) window.location.href = json.url;
                    else alert('Unable to create checkout session');
                  } catch (err) {
                    console.error(err);
                    alert('Payment error');
                  } finally {
                    setIsPurchasing(false);
                  }
                }}
                className="px-4 py-2 bg-[#FFD54F] text-[#3E2723] font-bold rounded-md shadow"
              >
                {isPurchasing ? 'Opening...' : 'Purchase to Play'}
              </button>
            </div>
          ) : (
            <button 
              onClick={() => togglePlay()}
              className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-white transition text-[#2C241B]"
              style={{ backgroundColor: moodColor === '#8B4513' ? '#FFD54F' : moodColor }}
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
            </button>
          )}
        </div>

        <audio ref={audioRef} className="hidden" />
      </div>
    </div>
  );
}
