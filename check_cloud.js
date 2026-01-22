const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// LOAD CREDENTIALS
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("CRITICAL ERROR: Missing Supabase Credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function scanCloud() {
  console.log("--- INITIATING SUPABASE CLOUD SCAN ---");
  
  // 1. LIST ALL BUCKETS
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  if (bucketError) {
    console.error("SCAN FAILED:", bucketError.message);
    return;
  }

  console.log(`FOUND ${buckets.length} BUCKETS:`);
  
  // 2. SCAN EACH BUCKET FOR VIDEOS
  for (const bucket of buckets) {
    console.log(`\n[BUCKET: ${bucket.name}]`);
    
    // List files (limit 50)
    const { data: files, error: fileError } = await supabase.storage
      .from(bucket.name)
      .list('', { limit: 50, sortBy: { column: 'name', order: 'asc' } });
      
    if (fileError) {
      console.log(`  > Error accessing bucket: ${fileError.message}`);
      continue;
    }

    if (files.length === 0) {
      console.log("  > (Empty)");
    } else {
      files.forEach(f => {
        // HIGHLIGHT VIDEOS
        if (f.name.match(/\.(mp4|mov|mkv|snippet5s)$/i)) {
          console.log(`  > *** VIDEO ASSET FOUND: ${f.name} ***`);
        } else {
          console.log(`  > ${f.name}`);
        }
      });
    }
  }
}

scanCloud();
