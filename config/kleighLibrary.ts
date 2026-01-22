/* config/kleighLibrary.ts */

export type Mood = 'Melancholy' | 'Uplifting' | 'Focus' | 'High Energy' | 'Dreamy';

export interface LicenseInfo {
  holder: string;
  type: string;       // e.g. "exclusive", "non-exclusive"
  territories?: string[]; // optional list of territories
  expires?: string;   // ISO date if applicable
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string; // The DIRECT audio link from Disco (use signed URLs or short-lived tokens when possible)
  coverImage: string;
  moods: Mood[];
  isPremium: boolean;

  /* Suggested enhancements */
  durationSeconds?: number;
  releaseDate?: string; // ISO date
  bpm?: number;
  key?: string;
  explicit?: boolean;
  format?: string; // e.g. "mp3", "flac"
  previewUrl?: string;
  waveformUrl?: string;
  licenseInfo?: LicenseInfo;
  metadata?: Record<string, unknown>; // any additional provider-specific fields
}

// ---------------------------------------------------------
// THE MASTER MANIFEST
// These tracks stream directly from your Disco servers.
// Keep direct links secure (prefer signed URLs or proxy).
// ---------------------------------------------------------
export const KLEIGH_LIBRARY: Track[] = [
  {
    id: 'k1',
    title: 'Kleigh Song 01',
    artist: 'Kleigh',
    url: 'https://musicmaykers.disco.ac/your-direct-mp3-link-here',
    coverImage: '/images/kleigh-cover.jpg',
    moods: ['Melancholy', 'Focus'],
    isPremium: true,

    durationSeconds: 198,
    releaseDate: '2024-09-01',
    bpm: 78,
    key: 'Em',
    explicit: false,
    format: 'mp3',
    previewUrl: 'https://musicmaykers.disco.ac/preview/k1-clip.mp3',
    waveformUrl: '/waveforms/k1.json',
    licenseInfo: {
      holder: 'Kleigh / MusicMaykers',
      type: 'non-exclusive',
      territories: ['US', 'CA'],
    },
    metadata: { source: 'disco', catalogId: 'disco:k1' }
  },
  {
    id: 'k2',
    title: 'Kleigh Song 02',
    artist: 'Kleigh',
    url: 'https://musicmaykers.disco.ac/your-direct-mp3-link-here',
    coverImage: '/images/kleigh-cover.jpg',
    moods: ['High Energy', 'Uplifting'],
    isPremium: true,

    durationSeconds: 222,
    releaseDate: '2024-09-01',
    bpm: 120,
    key: 'C',
    explicit: false,
    format: 'mp3',
    previewUrl: 'https://musicmaykers.disco.ac/preview/k2-clip.mp3',
    waveformUrl: '/waveforms/k2.json',
    licenseInfo: {
      holder: 'Kleigh / MusicMaykers',
      type: 'non-exclusive',
      territories: ['Global']
    },
    metadata: { source: 'disco', catalogId: 'disco:k2' }
  }
  // add more tracks following the shape above
];
