# 🔴 AUDIO FIX: NO DISCO DEPENDENCY

## THE REAL PROBLEM

You're right - if DISCO URLs are dead, the migration script that downloads from DISCO won't work.

## ✅ THREE DISCO-FREE OPTIONS

### **OPTION 1: Manual Upload via Supabase Dashboard** (SIMPLEST)

**If you have MP3 files on your computer:**

1. Go to [Supabase Storage](https://supabase.com/dashboard/project/eajxgrbxvkhfmmfiotpm/storage/files/buckets/public-audio)
2. Click into `public-audio` bucket
3. Create folder: `tracks/`
4. **Upload your MP3 files**
   - Name them: `{track_id}.mp3` (e.g., `44077375.mp3`)
   - You can drag-and-drop in batches

5. Once files are uploaded, run this SQL to update the database:

```sql
-- This will set the correct Supabase URLs for ALL songs
UPDATE songs
SET 
  url = 'https://eajxgrbxvkhfmmfiotpm.supabase.co/storage/v1/object/public/public-audio/tracks/' || track_id || '.mp3',
  storage_path = 'tracks/' || track_id || '.mp3'
WHERE track_id IS NOT NULL;

-- Verify
SELECT id, title, track_id, url, storage_path 
FROM songs 
WHERE storage_path IS NOT NULL 
LIMIT 5;
```

**That's it! Audio will work immediately.**

---

### **OPTION 2: Bulk Upload from Local Folder** (AUTOMATED)

**If you have all MP3s in a local folder:**

Create `scripts/upload-local-files.js`:

```javascript
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const SUPABASE_URL = 'https://eajxgrbxvkhfmmfiotpm.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SERVICE_ROLE_KEY) {
  console.error('❌ Set SUPABASE_SERVICE_ROLE_KEY environment variable')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

// CHANGE THIS to your local folder path
const LOCAL_FOLDER = '/path/to/your/mp3s'

async function uploadFolder() {
  const files = fs.readdirSync(LOCAL_FOLDER)
  
  for (const file of files) {
    if (!file.endsWith('.mp3')) continue
    
    const filePath = path.join(LOCAL_FOLDER, file)
    const fileBuffer = fs.readFileSync(filePath)
    const track_id = file.replace('.mp3', '')
    
    console.log(`Uploading: ${file}...`)
    
    const { error } = await supabase.storage
      .from('public-audio')
      .upload(`tracks/${file}`, fileBuffer, {
        contentType: 'audio/mpeg',
        upsert: true
      })
    
    if (error) {
      console.error(`❌ ${file}: ${error.message}`)
    } else {
      // Update database
      const newUrl = `${SUPABASE_URL}/storage/v1/object/public/public-audio/tracks/${file}`
      await supabase
        .from('songs')
        .update({ 
          url: newUrl,
          storage_path: `tracks/${file}`
        })
        .eq('track_id', track_id)
      
      console.log(`✅ ${file}`)
    }
  }
}

uploadFolder()
```

**Run it:**
```bash
export SUPABASE_SERVICE_ROLE_KEY="your-key"
node scripts/upload-local-files.js
```

---

### **OPTION 3: Use Existing Files (If You Have Them Somewhere)**

**WHERE ARE YOUR MP3 FILES?**

- External hard drive?
- Cloud storage (Dropbox, Google Drive)?
- Another server?
- Downloaded from DISCO before it died?

Once you locate them, use Option 1 or Option 2 above.

---

## 🎯 THE KEY INSIGHT

**You DON'T need DISCO anymore!** 

Once files are in Supabase Storage:
- ✅ `url` column points to Supabase
- ✅ `storage_path` tracks file location
- ✅ `PersistentPlayer.tsx` uses `currentTrack.url`
- ✅ **DISCO is completely out of the picture**

---

## ❓ WHAT IF YOU DON'T HAVE THE MP3 FILES?

If DISCO is dead AND you don't have local copies:

1. **Check if DISCO still allows direct downloads** (even if URLs in database are dead)
2. **Contact DISCO support** to get your files
3. **Rebuild from source** if these are your own recordings

**The migration script only helps IF DISCO URLs still work for downloading.**

---

## 🚀 RECOMMENDED APPROACH

**Start with ONE song as a test:**

1. Pick any song from your database (e.g., track_id = `44077375`)
2. Get that MP3 file (however you can)
3. Upload to Supabase Storage as `tracks/44077375.mp3`
4. Update that song's URL in database:

```sql
UPDATE songs
SET 
  url = 'https://eajxgrbxvkhfmmfiotpm.supabase.co/storage/v1/object/public/public-audio/tracks/44077375.mp3',
  storage_path = 'tracks/44077375.mp3'
WHERE track_id = '44077375';
```

5. Go to [2kleigh.com](https://www.2kleigh.com/) and test if that song plays
6. Once confirmed working, scale to all 586 songs

---

**WHERE ARE YOUR MP3 FILES RIGHT NOW?** 

Tell me and I'll give you the exact steps for your situation.