import pandas as pd

# Load your file
df = pd.read_csv('gpm_stl.csv')

# 1. RENAME the important columns (Removing "Tag category" prefix)
rename_map = {
    'Track ID': 'id',
    'Title': 'title',
    'Artist': 'artist',
    'Album': 'album',
    'mp3_url': 'url',
    'Tag category: Mood/feel': 'moods',       # Fixed!
    'Tag category: Lyric themes': 'keywords', # Fixed!
    'Duration': 'duration',
    'BPM': 'bpm',
    'Genre': 'genre'
}

# 2. KEEP only the columns Supabase needs (Discarding the rest)
final_columns = ['id', 'title', 'artist', 'album', 'url', 'moods', 'keywords', 'duration', 'bpm', 'genre']

# Apply changes and save
df_clean = df.rename(columns=rename_map)
df_clean = df_clean[final_columns]
df_clean.to_csv('clean_import.csv', index=False)
print("Success! Created 'clean_import.csv' with clean headers.")
