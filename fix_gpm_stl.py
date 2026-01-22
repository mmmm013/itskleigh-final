import pandas as pd
import os

# Load the current file
file_path = 'gpm_stl.csv'
if not os.path.exists(file_path):
    print("❌ Error: gpm_stl.csv not found in this folder.")
    exit()

df = pd.read_csv(file_path)

# Map to clean headers (Supabase format)
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

# Apply renaming
df = df.rename(columns=rename_map)

# Keep ONLY the columns Supabase needs (Removes all other 'Tag category' junk)
required_cols = ['id', 'title', 'artist', 'album', 'url', 'moods', 'keywords', 'duration', 'bpm', 'genre']

# Filter to available columns only (in case you run it twice)
final_cols = [c for c in required_cols if c in df.columns]
df = df[final_cols]

# Overwrite the file
df.to_csv(file_path, index=False)
print("✅ Success! 'gpm_stl.csv' has been fixed and is ready for Supabase.")
