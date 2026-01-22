import { createClient } from '@/utils/supabase/client';

export interface Playlist {
  id: string;
  name: string;
  description: string;
  track_ids: string[];
  image_url: string;
  mood_category: string;
  is_featured: boolean;
  created_at: string;
}

export const getFeaturedPlaylists = async (): Promise<Playlist[]> => {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('playlists')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching featured playlists:', err);
    return [];
  }
};

export const getPlaylistByMood = async (mood: string): Promise<Playlist[]> => {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('playlists')
      .select('*')
      .eq('mood_category', mood)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching playlists by mood:', err);
    return [];
  }
};

export const getHeroImages = async () => {
  const supabase = createClient();
  
  try {
    // Get featured playlists and their images for hero carousel
    const playlists = await getFeaturedPlaylists();
    return playlists.map((playlist) => ({
      id: playlist.id,
      image: playlist.image_url,
      title: playlist.name,
      description: playlist.description,
      mood: playlist.mood_category,
      playlistId: playlist.id,
    }));
  } catch (err) {
    console.error('Error fetching hero images:', err);
    return [];
  }
};

export const rotateHeroContent = (items: any[], currentIndex: number): any => {
  if (!items || items.length === 0) return null;
  const nextIndex = (currentIndex + 1) % items.length;
  return { currentItem: items[currentIndex], nextIndex };
};

export default {
  getFeaturedPlaylists,
  getPlaylistByMood,
  getHeroImages,
  rotateHeroContent,
};
