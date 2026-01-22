'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';

export interface Track {
  id: string;
  title: string;
  artist: string;
  mood: string[];
  mood_category: string;
  duration: number;
  audio_url: string;
  image_url: string;
  created_at: string;
}

export interface AudioContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playlist: Track[];
  currentMood: string | null;
  searchTerm: string;
  isLoading: boolean;
  error: string | null;
  playTrack: (track: Track) => Promise<void>;
  pauseTrack: () => void;
  resumeTrack: () => void;
  skipTrack: (direction: 'next' | 'prev') => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  loadPlaylist: (mood?: string) => Promise<void>;
  setCurrentMood: (mood: string | null) => void;
  setSearchTerm: (term: string) => void;
  addToPlaylist: (track: Track) => void;
  removeFromPlaylist: (trackId: string) => void;
}

export const useAudio = (): AudioContextType => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const supabase = createClient();

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
      audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));
      audio.addEventListener('ended', () => handleTrackEnd());
      audioRef.current = audio;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Load playlist from Supabase
  const loadPlaylist = useCallback(async (mood?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      let query = supabase.from('songs').select('*');
      
      if (mood) {
        query = query.contains('mood', [mood]);
      }
      
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,artist.ilike.%${searchTerm}%`);
      }

      const { data, error: fetchError } = await query.limit(100);

      if (fetchError) throw fetchError;
      
      setPlaylist(data || []);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load playlist';
      setError(errorMsg);
      console.error('Error loading playlist:', err);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, supabase]);

  // Play track
  const playTrack = useCallback(async (track: Track) => {
    try {
      if (audioRef.current) {
        audioRef.current.src = track.audio_url;
        audioRef.current.volume = volume;
        await audioRef.current.play();
        setCurrentTrack(track);
        setIsPlaying(true);
        setError(null);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to play track';
      setError(errorMsg);
      console.error('Error playing track:', err);
    }
  }, [volume]);

  // Pause track
  const pauseTrack = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  // Resume track
  const resumeTrack = useCallback(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [currentTrack]);

  // Skip to next/previous track
  const skipTrack = useCallback((direction: 'next' | 'prev') => {
    if (playlist.length === 0 || !currentTrack) return;
    
    const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
    let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    
    if (nextIndex < 0) nextIndex = playlist.length - 1;
    if (nextIndex >= playlist.length) nextIndex = 0;
    
    playTrack(playlist[nextIndex]);
  }, [playlist, currentTrack, playTrack]);

  // Handle track end
  const handleTrackEnd = useCallback(() => {
    skipTrack('next');
  }, [skipTrack]);

  // Set volume
  const handleSetVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
  }, []);

  // Set current time
  const handleSetCurrentTime = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  // Add to playlist
  const addToPlaylist = useCallback((track: Track) => {
    setPlaylist(prev => {
      if (prev.some(t => t.id === track.id)) return prev;
      return [...prev, track];
    });
  }, []);

  // Remove from playlist
  const removeFromPlaylist = useCallback((trackId: string) => {
    setPlaylist(prev => prev.filter(t => t.id !== trackId));
  }, []);

  // Load playlist when mood or search changes
  useEffect(() => {
    loadPlaylist(currentMood || undefined);
  }, [currentMood, searchTerm, loadPlaylist]);

  return {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    playlist,
    currentMood,
    searchTerm,
    isLoading,
    error,
    playTrack,
    pauseTrack,
    resumeTrack,
    skipTrack,
    setVolume: handleSetVolume,
    setCurrentTime: handleSetCurrentTime,
    loadPlaylist,
    setCurrentMood,
    setSearchTerm,
    addToPlaylist,
    removeFromPlaylist,
  };
};

export default useAudio;
