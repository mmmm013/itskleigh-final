'use client';

import { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

// --- TYPES ---
export interface Track {
  id: string | number;
  title: string;
  artist?: string;
  url?: string;
  audio_url?: string;
  filename?: string;
  duration?: string;
  moodColor?: string;
}

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[]; 
  playTrack: (track: Track, newQueue?: Track[]) => Promise<void>;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Track[]>([]);

  // --- FETCH SONGS FROM 'tracks' TABLE ---
  useEffect(() => {
    const fetchMusic = async () => {
      console.log("🎵 Connecting to G Putnam Archives (tracks)...");
      
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // We use 'tracks' because your Supabase screenshot confirmed this name
      const { data, error } = await supabase
        .from('tracks') 
        .select('*');

      if (error) {
        console.error('❌ Error loading music:', error.message);
      } else if (data && data.length > 0) {
        console.log(`✅ Loaded ${data.length} tracks`);
        // Normalize tracks so they include a `url` field the player can use.
        const normalized = data.map((d: any) => {
          const url = d.url || d.audio_url || d.audioUrl || d.filename || undefined;
          // If filename looks like a simple filename, build a storage path later when used.
          return {
            ...d,
            id: d.id ?? d.filename ?? d.audio_id ?? `${Math.random()}`,
            title: d.title || d.name || 'Untitled',
            artist: d.artist || d.album_artist || 'G Putnam Music',
            url,
            moodColor: d.moodColor || d.mood || undefined,
          } as Track;
        });

        // try to resolve simple filenames into public URLs when possible
        const BUCKET_URL = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_URL ||
          'https://eajxgrbxvkhfmmfiotpm.supabase.co/storage/v1/object/public/tracks';

        const withResolved = normalized.map((t: any) => {
          if (!t.url && t.filename) {
            return { ...t, url: `${BUCKET_URL}/${encodeURIComponent(t.filename)}` };
          }
          return t;
        });

        setQueue(withResolved);
        setCurrentTrack(withResolved[0]); // Load the first song
      } else {
        console.warn('⚠️ Connected to tracks table, but found 0 rows.');
      }
    };

    fetchMusic();
  }, []);

  // 1. Play a specific track 
  const playTrack = async (track: Track, newQueue?: Track[]) => {
    // Resolve URL if missing (support filename -> public bucket)
    const BUCKET_URL = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_URL ||
      'https://eajxgrbxvkhfmmfiotpm.supabase.co/storage/v1/object/public/tracks';

    let resolvedUrl = track.url || track.audio_url || (track.filename ? `${BUCKET_URL}/${encodeURIComponent(String(track.filename))}` : undefined);

    // If still unresolved but we have an id, attempt server-side resolution (signed URL)
    if (!resolvedUrl && track.id) {
      try {
        const res = await fetch(`/api/resolve-audio?track_id=${encodeURIComponent(String(track.id))}`);
        if (res.ok) {
          const json = await res.json();
          if (json.url) {
            resolvedUrl = json.url;
          } else if (json.access === 'purchase_required') {
            console.warn('Track requires purchase:', json.message || json);
            // set current track with no url to allow UI to show locked state
            const tLocked: Track = { ...track, url: undefined };
            setCurrentTrack(tLocked);
            if (newQueue) setQueue(newQueue);
            return;
          }
        } else {
          const body = await res.json().catch(() => ({}));
          console.warn('Failed to resolve audio:', body);
        }
      } catch (err) {
        console.error('Error resolving audio URL:', err);
      }
    }

    const t: Track = { ...track, url: resolvedUrl };

    setCurrentTrack(t);
    setIsPlaying(Boolean(resolvedUrl));
    if (newQueue) {
      setQueue(newQueue);
    } else if (queue.length === 0) {
      setQueue([track]);
    }
  };

  // 2. Toggle Play/Pause
  const togglePlay = () => {
    if (!currentTrack) return; 
    setIsPlaying((prev) => !prev);
  };

  // 3. Next Track Logic
  const nextTrack = () => {
    if (!currentTrack || queue.length === 0) return;
    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
    
    if (currentIndex === -1 || currentIndex === queue.length - 1) {
      setCurrentTrack(queue[0]); 
    } else {
      setCurrentTrack(queue[currentIndex + 1]);
    }
    setIsPlaying(true); 
  };

  // 4. Previous Track Logic
  const prevTrack = () => {
    if (!currentTrack || queue.length === 0) return;
    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);

    if (currentIndex <= 0) {
      setCurrentTrack(queue[queue.length - 1]); 
    } else {
      setCurrentTrack(queue[currentIndex - 1]);
    }
    setIsPlaying(true);
  };

  const value = useMemo(() => ({
    currentTrack,
    isPlaying,
    queue,
    playTrack,
    togglePlay,
    nextTrack,
    prevTrack
  }), [currentTrack, isPlaying, queue]);

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}