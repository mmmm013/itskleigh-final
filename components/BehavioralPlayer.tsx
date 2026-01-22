'use client';

import { usePlayer } from '@/components/PlayerContext';

export default function BehavioralPlayer() {
  const { togglePlay, isPlaying } = usePlayer();
  
  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Live Stream</h3>
        <p className="text-sm text-gray-600">Streaming from the vault</p>
      </div>
      
      <button
        onClick={togglePlay}
        className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-all"
      >
        {isPlaying ? '⏸ Pause Stream' : '▶ Start Stream'}
      </button>
    </div>
  );
}
