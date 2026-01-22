# COMPLETE AUDIO MIGRATION GUIDE
## Migrating ALL Audio from DISCO to Supabase Storage

### ✅ CURRENT STATUS

**Infrastructure Ready:**
- ✅ Supabase Storage bucket: `public-audio` (PUBLIC)
- ✅ Folder structure: `public-audio/tracks/` 
- ✅ Database schema: `songs` table with `url`, `storage_path`, `track_id` columns
- ✅ 586 songs in database, all with DISCO URLs
- ❌ 0 songs migrated to Supabase (storage_path = NULL for all)

### 🎯 MIGRATION STRATEGY

**Option A: Automated Bulk Migration (RECOMMENDED)**

Use this Node.js script to migrate all 586 songs automatically:

```javascript
// migrate-all-audio.js
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function migrateAllAudio() {
  // 1. Get all songs with DISCO URLs
  const { data: songs, error } = await supabase
    .from('songs')
    .select('track_id, title, artist, url')
    .like('url', '%l2-disco-data-us%')
    .is('storage_path', null);

  if (error) throw error;
  
  console.log(`Found ${songs.length} songs to migrate`);
  
  let success = 0;
  let failed = 0;
  
  for (const song of songs) {
    try {
      console.log(`Migrating ${song.track_id}: ${song.title}`);
      
      // 2. Download MP3 from DISCO
      const response = await axios.get(song.url, {
        responseType: 'arraybuffer',
        timeout: 60000 // 60 second timeout
      });
      
      const mp3Buffer = Buffer.from(response.data);
      const filename = `${song.track_id}.mp3`;
      const storagePath = `tracks/${filename}`;
      
      // 3. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('public-audio')
        .upload(storagePath, mp3Buffer, {
          contentType: 'audio/mpeg',
          upsert: true
        });
      
      if (uploadError) throw uploadError;
      
      // 4. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('public-audio')
        .getPublicUrl(storagePath);
      
      // 5. Update database
      const { error: updateError } = await supabase
        .from('songs')
        .update({
          url: publicUrl,
          storage_path: storagePath
        })
        .eq('track_id', song.track_id);
      
      if (updateError) throw updateError;
      
      success++;
      console.log(`✓ Success (${success}/${songs.length})`);
      
      // Rate limiting - wait 100ms between uploads
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (err) {
      failed++;
      console.error(`✗ Failed ${song.track_id}:`, err.message);
    }
  }
  
  console.log(`\nMigration Complete!`);
  console.log(`Success: ${success}`);
  console.log(`Failed: ${failed}`);
}

migrateAllAudio();
```

**Run the script:**
```bash
cd scripts
node migrate-all-audio.js
```

---

### 🧪 OPTION B: Test with ONE Song First

**Test Song:** track_id = `44077370` - "TIL I'M DYIN' I'M TRYIN'"

**Manual Steps:**
1. Get DISCO URL from database:
```sql
SELECT track_id, title, url 
FROM songs 
WHERE track_id = '44077370';
```

2. Download MP3 from DISCO URL

3. Upload to Supabase Storage:
   - Navigate to: Storage → Buckets → public-audio → tracks/
   - Upload file as: `44077370.mp3`

4. Update database:
```sql
UPDATE songs
SET 
  url = 'https://eajxgrbxvkhfmmfiotpm.supabase.co/storage/v1/object/public/public-audio/tracks/44077370.mp3',
  storage_path = 'tracks/44077370.mp3'
WHERE track_id = '44077370';
```

5. Test playback at https://www.2kleigh.com/

---

### 📋 POST-MIGRATION VERIFICATION

**1. Check Migration Status:**
```sql
SELECT 
  COUNT(*) as total_songs,
  COUNT(CASE WHEN url LIKE '%supabase%' THEN 1 END) as supabase_urls,
  COUNT(CASE WHEN url LIKE '%disco%' THEN 1 END) as disco_urls,
  COUNT(CASE WHEN storage_path IS NOT NULL THEN 1 END) as has_storage_path
FROM songs;
```

**Expected Result:**
```
total_songs | supabase_urls | disco_urls | has_storage_path
------------|---------------|------------|------------------
    586     |      586      |     0      |       586
```

**2. Test Random Samples:**
```sql
SELECT track_id, title, artist, url, storage_path
FROM songs
ORDER BY RANDOM()
LIMIT 10;
```

**3. Check for Failed Migrations:**
```sql
SELECT track_id, title, url
FROM songs
WHERE url LIKE '%disco%' OR storage_path IS NULL;
```

---

### 🔧 UPDATE PLAYER CODE

Once migration is complete, update `PersistentPlayer.tsx`:

```typescript
// OLD CODE (with DISCO dependency):
const audioUrl = track.url; // Still points to DISCO

// NEW CODE (Supabase only):
const audioUrl = track.storage_path 
  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/public-audio/${track.storage_path}`
  : track.url; // Fallback to direct URL
```

**Better approach - use `url` directly:**
Since we're updating the `url` column to Supabase URLs, the player should work without code changes!

---

### 🗑️ REMOVE DISCO DEPENDENCY

**After 100% migration verified:**

1. Remove DISCO references from code:
```bash
grep -r "disco" --include="*.tsx" --include="*.ts" --include="*.js"
```

2. Update environment variables:
```bash
# Remove DISCO credentials from .env.local
# Remove from Vercel environment variables
```

3. Archive old DISCO URLs:
```sql
-- Optional: Keep backup of old URLs
ALTER TABLE songs ADD COLUMN old_disco_url TEXT;
UPDATE songs SET old_disco_url = url WHERE url LIKE '%disco%';
```

---

### ⚡ PERFORMANCE OPTIMIZATION

**After migration, set CDN caching:**

1. Update Supabase Storage bucket policies:
   - Cache-Control: `public, max-age=31536000, immutable`
   - Content-Type: `audio/mpeg`

2. Enable Range requests for streaming:
   - Already supported by Supabase Storage
   - Test with: `curl -I -H "Range: bytes=0-1023" [audio_url]`

---

### 🚨 TROUBLESHOOTING

**Issue: Download timeouts from DISCO**
- Solution: Increase timeout, add retry logic
- Alternative: Use `wget` or `curl` to batch download

**Issue: Upload failures to Supabase**
- Check storage bucket quota
- Verify service role key permissions
- Ensure public-audio bucket exists and is PUBLIC

**Issue: Audio won't play**
- Verify CORS settings on storage bucket
- Check browser console for errors
- Confirm URL format matches: `https://[project].supabase.co/storage/v1/object/public/public-audio/tracks/[track_id].mp3`

---

### 📊 MIGRATION TIMELINE

**Estimated time for 586 songs:**
- Download rate: ~100ms per file
- Upload rate: ~100ms per file  
- Total: ~2 minutes for all 586 songs

**Recommended:**
1. Test with 1 song first (5 minutes)
2. Migrate batch of 10 songs (1 minute)
3. Verify playback (5 minutes)
4. Run full migration (2-5 minutes)
5. Final verification (10 minutes)

**Total: ~30 minutes end-to-end**

---

## ✅ READY TO EXECUTE

**Choose your path:**
- **Quick Test:** Follow Option B with track `44077370`
- **Full Migration:** Run the bulk migration script (Option A)

All infrastructure is ready. Supabase is now the single source of truth for audio!