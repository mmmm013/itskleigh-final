# 🚀 EXECUTE AUDIO MIGRATION - COMPLETE INSTRUCTIONS

## 📋 What This Does

Migrates ALL 586 songs from DISCO to Supabase Storage, making **Supabase the authoritative source for ALL audio**.

---

## ⚡ QUICK START (Test with "Memories" first)

### Step 1: Get Supabase Service Key

1. Go to: https://supabase.com/dashboard/project/eajxgrbxvkhfmmfiotpm/settings/api
2. Copy your `service_role` key (starts with `eyJ...`)
3. **IMPORTANT:** Never commit this key to Git!

### Step 2: Set Environment Variable

```bash
# In your terminal (Mac/Linux):
export SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Or create a .env file:
echo 'SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' > .env
```

### Step 3: Install Dependencies

```bash
npm install @supabase/supabase-js axios
```

### Step 4: Test with "Memories" Song

```bash
node scripts/test-migrate-memories.js
```

**Expected Output:**
```
🎵 Test Migration: "Memories" by Kleigh
============================================================

📊 Step 1: Fetching song data...
   ✓ Found: "MEMORIES" by KLEIGH
   ✓ Current URL: https://l2-disco-data-us.s3.amazonaws.com/media/trac...
   ✓ Storage path: (null)

⬇️  Step 2: Downloading MP3 from DISCO...
   Progress: 100%
   ✓ Downloaded: 3.45 MB

⬆️  Step 3: Uploading to Supabase Storage...
   ✓ Uploaded to: tracks/148166619.mp3

🔗 Step 4: Generating public URL...
   ✓ New URL: https://eajxgrbxvkhfmmfiotpm.supabase.co/storage/v1/object/public/public-audio/tracks/148166619.mp3

💾 Step 5: Updating database...
   ✓ Database updated

✅ Step 6: Verification...
   ✓ Title: MEMORIES
   ✓ URL: https://eajxgrbxvkhfmmfiotpm.supabase.co/storage/v1/object/public/public-audio/tracks/148166619.mp3
   ✓ Storage path: tracks/148166619.mp3

============================================================
✅ TEST MIGRATION SUCCESSFUL!

🎯 Next Steps:
   1. Test playback at https://www.2kleigh.com/
   2. Search for "Memories" and verify it plays correctly
   3. If successful, run: node scripts/migrate-all-audio.js
============================================================
```

### Step 5: Verify Playback

1. Go to https://www.2kleigh.com/
2. Search for "Memories"
3. Click play and verify audio works
4. **If it plays correctly, proceed to full migration!**

---

## 🎯 FULL MIGRATION (All 586 Songs)

### Option A: Use Existing Script (from COMPLETE-MIGRATION-GUIDE.md)

Create `scripts/migrate-all-audio.js` with the bulk migration code, then:

```bash
node scripts/migrate-all-audio.js
```

**Timeline:**
- Downloads + Uploads: ~2-5 minutes for all 586 songs
- Rate limited to prevent API throttling
- Progress displayed in terminal

**Expected Output:**
```
Migrating 44077370: TIL I'M DYIN' I'M TRYIN'
✓ Success (1/586)
Migrating 148166619: MEMORIES  
✓ Success (2/586)
...

Migration Complete!
Success: 586
Failed: 0
```

### Option B: Manual Upload via Supabase UI (Not Recommended)

Only if scripts fail:
1. Download all MP3s from DISCO URLs
2. Upload to Supabase Storage: `public-audio/tracks/`
3. Run SQL to update URLs (see below)

---

## 🔍 POST-MIGRATION VERIFICATION

### Check Migration Status

Run this SQL in Supabase SQL Editor:

```sql
SELECT 
  COUNT(*) as total_songs,
  COUNT(CASE WHEN url LIKE '%supabase%' THEN 1 END) as supabase_urls,
  COUNT(CASE WHEN url LIKE '%disco%' THEN 1 END) as disco_urls,
  COUNT(CASE WHEN storage_path IS NOT NULL THEN 1 END) as has_storage_path
FROM songs;
```

**Expected Result:**
| total_songs | supabase_urls | disco_urls | has_storage_path |
|-------------|---------------|------------|------------------|
| 586         | 586           | 0          | 586              |

**✅ Success = All songs using Supabase!**

### Test Random Samples

```sql
SELECT track_id, title, artist, url, storage_path
FROM songs
ORDER BY RANDOM()
LIMIT 10;
```

Verify all URLs start with: `https://eajxgrbxvkhfmmfiotpm.supabase.co/storage/v1/object/public/public-audio/tracks/`

### Check for Failures

```sql
SELECT track_id, title, url
FROM songs
WHERE url LIKE '%disco%' OR storage_path IS NULL;
```

**Should return 0 rows!**

---

## 🎵 PLAY "MEMORIES" FROM SUPABASE

Once migration is complete:

### Method 1: Via 2kleigh.com Website

1. Go to https://www.2kleigh.com/
2. Search: "Memories"
3. Click play button
4. **Audio should stream from Supabase Storage!**

### Method 2: Direct URL Test

Open in browser:
```
https://eajxgrbxvkhfmmfiotpm.supabase.co/storage/v1/object/public/public-audio/tracks/148166619.mp3
```

### Method 3: SQL Verification

```sql
SELECT track_id, title, artist, url, storage_path
FROM songs  
WHERE title ILIKE '%memories%';
```

Should show:
- track_id: `148166619`
- title: `MEMORIES`
- artist: `KLEIGH`
- url: `https://eajxgrbxvkhfmmfiotpm.supabase.co/storage/v1/object/public/public-audio/tracks/148166619.mp3`
- storage_path: `tracks/148166619.mp3`

---

## 🗑️ POST-MIGRATION CLEANUP

### 1. Remove DISCO Dependency from Code

```bash
# Search for DISCO references
grep -r "disco" --include="*.tsx" --include="*.ts" --include="*.js" .

# Remove any DISCO-specific code
```

### 2. Update Environment Variables

**Remove from `.env.local` and Vercel:**
- Any DISCO API keys
- DISCO URLs
- DISCO authentication tokens

### 3. Archive Old DISCO URLs (Optional)

```sql
-- Keep backup of old URLs
ALTER TABLE songs ADD COLUMN IF NOT EXISTS old_disco_url TEXT;
UPDATE songs 
SET old_disco_url = url 
WHERE url LIKE '%disco%' AND old_disco_url IS NULL;
```

### 4. Update Documentation

- Update README to reflect Supabase as audio source
- Remove DISCO setup instructions
- Add Supabase Storage setup instructions

---

## 🚨 TROUBLESHOOTING

### Error: "SUPABASE_SERVICE_KEY is required"

**Solution:**
```bash
export SUPABASE_SERVICE_KEY="your-key-here"
# Verify it's set:
echo $SUPABASE_SERVICE_KEY
```

### Error: "Download timeout from DISCO"

**Solution:**
- Increase timeout in script (currently 60 seconds)
- Check internet connection
- Verify DISCO URLs are still valid

### Error: "Upload failed to Supabase"

**Solution:**
- Check Supabase storage quota
- Verify service role key has storage permissions
- Ensure `public-audio` bucket exists and is PUBLIC

### Audio Won't Play on Website

**Check:**
1. CORS settings on Supabase Storage bucket
2. Browser console for errors
3. URL format is correct
4. File actually uploaded to Supabase (check Storage UI)

### Migration Script Hangs

**Solution:**
- Kill process: `Ctrl+C`
- Check which song failed (last console output)
- Re-run script (it will skip already migrated songs with `upsert: true`)

---

## ✅ FINAL CHECKLIST

- [ ] Test migration completed successfully for "Memories"
- [ ] "Memories" plays correctly on 2kleigh.com
- [ ] Full migration completed (586/586 songs)
- [ ] All SQL verification queries return expected results
- [ ] Random sample songs play correctly
- [ ] DISCO URLs removed from environment variables
- [ ] Code references to DISCO removed
- [ ] Documentation updated
- [ ] **Supabase is now the authoritative audio source!** 🎉

---

## 📊 MIGRATION SUMMARY

**Before:**
- Audio source: DISCO (external S3 bucket)
- Dependency: Required DISCO API access
- Control: Limited
- URLs: `https://l2-disco-data-us.s3.amazonaws.com/media/trackfiles/...`

**After:**
- Audio source: Supabase Storage (your infrastructure)
- Dependency: None - fully self-hosted
- Control: Complete
- URLs: `https://eajxgrbxvkhfmmfiotpm.supabase.co/storage/v1/object/public/public-audio/tracks/{track_id}.mp3`

**Result:** 🎯 **SUPABASE IS NOW AUTHORITATIVE FOR ALL AUDIO!**