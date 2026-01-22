import pandas as pd

# Load the raw file
df = pd.read_csv('gpm_stl.csv')

# Rename columns to match Supabase schema
rename_map = {
    'Track ID': 'id',
    'Title': 'title',
    'Artist': 'artist',
    'Album': 'album',
    'mp3_url': 'url',
    'Tag category: Mood/feel': 'moods',
    'Tag category: Lyric themes': 'keywords',
    'Duration': 'duration',
    'BPM': 'bpm',
    'Genre': 'genre'
}

# Select only the needed columns
final_cols = ['id', 'title', 'artist', 'album', 'url', 'moods', 'keywords', 'duration', 'bpm', 'genre']

# Apply changes
df_clean = df.rename(columns=rename_map)[final_cols]
df_clean.to_csv('clean_import.csv', index=False)
print("✅ Success! 'clean_import.csv' is ready for Supabase.")
