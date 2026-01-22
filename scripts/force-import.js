require('dotenv').config({ path: ['.env.local', '.env'] });
const fs = require('fs');
const csv = require('csv-parser');
const { createClient } = require('@supabase/supabase-js');

// 1. SETUP
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ CRITICAL ERROR: Missing Supabase Keys.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const CSV_FILE = 'stl.csv'; 

console.log(`\n🚀 STARTING IMPORT: Reading from ${CSV_FILE} (Generating IDs)...`);

if (!fs.existsSync(CSV_FILE)) {
    console.error(`❌ ERROR: File not found at ${process.cwd()}/${CSV_FILE}`);
    process.exit(1);
}

const tracks = [];
// START ID COUNTER (Using timestamp ensures they are unique integers)
let trackIdCounter = Date.now(); 

// 2. PARSE with LOWERCASE mapping
fs.createReadStream(CSV_FILE)
  .pipe(csv({
    mapHeaders: ({ header }) => header.toLowerCase().trim()
  }))
  .on('data', (data) => {
    let streamUrl = "";
    
    // Intelligent URL Extraction
    if (data.track_formats) {
        try {
            const cleanJson = data.track_formats.replace(/""/g, '"'); 
            const formats = JSON.parse(cleanJson);
            if (formats.mp3) streamUrl = formats.mp3;
            else if (formats.original) streamUrl = formats.original;
        } catch (e) {}
    }
    if (!streamUrl) {
        const values = Object.values(data);
        streamUrl = values.find(v => v && v.toString().startsWith('http') && (v.includes('disco') || v.includes('mp3'))) || "";
    }

    if (streamUrl) {
        // SIX SIGMA FIX:
        // 1. Manually assign ID to satisfy "Not Null" constraint
        // 2. Map Column R and Tempo to 'mood'
        const combinedMoods = [
            data['tag category: mood/feel'], // Column R
            data.mood, 
            data.keywords,
            data.tempo 
        ].filter(Boolean).join(", ");

        tracks.push({
          id: trackIdCounter++, // <--- THE FIX: Manually creating the ID
          title: data.title || "Unknown Title",
          artist: "G Putnam Music",
          mood: combinedMoods, 
          url: streamUrl.trim() 
        });
    }
  })
  .on('end', async () => {
    console.log(`📊 PARSED: Found ${tracks.length} valid tracks.`);
    
    if (tracks.length === 0) {
        console.error("❌ ERROR: No tracks found.");
        process.exit(1);
    }

    // 3. WIPE OLD DATA
    console.log("🧹 WIPING old data...");
    await supabase.from('tracks').delete().neq('id', 0);

    // 4. INSERT NEW DATA
    console.log("📥 INSERTING data into Supabase Cloud...");
    
    const chunkSize = 100;
    for (let i = 0; i < tracks.length; i += chunkSize) {
        const chunk = tracks.slice(i, i + chunkSize);
        const { error } = await supabase.from('tracks').insert(chunk);
        
        if (error) {
            console.error(`❌ INSERT ERROR (Batch ${i}):`, error.message);
        } else {
            console.log(`   ✅ Loaded tracks ${i + 1} to ${Math.min(i + chunkSize, tracks.length)}`);
        }
    }

    console.log("\n🏁 SUCCESS: Database refilled. REFRESH YOUR SITE.");
  });
