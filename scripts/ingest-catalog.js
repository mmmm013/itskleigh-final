require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const csv = require('csv-parser');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ ERROR: Missing Supabase Keys.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const CSV_FILE = 'stl.csv';

console.log(`🚀 Scanning ${CSV_FILE} for audio data...`);

if (!fs.existsSync(CSV_FILE)) {
    console.error(`❌ ERROR: Could not find ${CSV_FILE}`);
    process.exit(1);
}

const results = [];

fs.createReadStream(CSV_FILE)
  .pipe(csv())
  .on('data', (data) => {
    // --- 1. REBRANDING ENFORCEMENT ---
    // We ignore the CSV's artist column. We are G Putnam Music.
    const cleanArtist = "G Putnam Music"; 
    
    // --- 2. URL DETECTION (The "Smart" Logic) ---
    // We look for track_formats (JSON) OR any column with a URL
    let streamUrl = "";
    
    // Try JSON parsing (DISCO format)
    if (data.track_formats) {
        try {
            const cleanJson = data.track_formats.replace(/""/g, '"'); 
            const formats = JSON.parse(cleanJson);
            if (formats.mp3) streamUrl = formats.mp3;
            else if (formats.original) streamUrl = formats.original;
        } catch (e) {}
    }

    // Fallback: Scan all columns for http links
    if (!streamUrl) {
        const values = Object.values(data);
        streamUrl = values.find(v => v && v.toString().startsWith('http') && (v.includes('disco') || v.includes('mp3'))) || "";
    }

    // --- 3. SAVE IF VALID ---
    if (streamUrl) {
        results.push({
          title: data.Title || "Unknown Title",
          artist: cleanArtist, // <--- FORCED IDENTITY
          mood: data['Tag category: Mood/Feel'] || data.Mood || "General",
          url: streamUrl.trim()
        });
    }
  })
  .on('end', async () => {
    if (results.length === 0) {
        console.error("❌ CRITICAL: 0 Tracks Found.");
        console.error("   ACTION: We need the CSV with 'Include file URLs' checked from DISCO.");
        return;
    }

    console.log(`📊 Found ${results.length} tracks. Applying 'G Putnam Music' branding...`);
    
    // Clear old data
    const { error: deleteError } = await supabase.from('tracks').delete().neq('id', 0);
    
    // Insert new branded data
    const chunkSize = 50;
    for (let i = 0; i < results.length; i += chunkSize) {
        const chunk = results.slice(i, i + chunkSize);
        await supabase.from('tracks').insert(chunk);
        console.log(`✅ Branded & Stocked tracks ${i} - ${i + chunk.length}`);
    }
    console.log("🏁 REBRANDING & INGEST COMPLETE.");
  });
