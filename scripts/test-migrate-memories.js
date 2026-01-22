#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

const SUPABASE_URL = 'https://eajxgrbxvkhfmmfiotpm.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const TEST_TRACK_ID = '148166619';

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ Error: SUPABASE_SERVICE_KEY environment variable is required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function testMigrateMemories() {
  console.log('🎵 Test Migration: "Memories" by Kleigh');
  console.log('='.repeat(60));
  
  try {
    console.log('\n📊 Step 1: Fetching song data...');
    const { data: song, error: fetchError } = await supabase
      .from('songs')
      .select('track_id, title, artist, url, storage_path')
      .eq('track_id', TEST_TRACK_ID)
      .single();
    
    if (fetchError) throw fetchError;
    console.log(`   ✓ Found: "${song.title}" by ${song.artist}`);
    
    console.log('\n⬇️  Step 2: Downloading MP3...');
    const response = await axios.get(song.url, {
      responseType: 'arraybuffer',
      timeout: 60000
    });
    
    const mp3Buffer = Buffer.from(response.data);
    console.log(`   ✓ Downloaded: ${(mp3Buffer.length / (1024 * 1024)).toFixed(2)} MB`);
    
    console.log('\n⬆️  Step 3: Uploading to Supabase...');
    const storagePath = `tracks/${TEST_TRACK_ID}.mp3`;
    const { error: uploadError } = await supabase.storage
      .from('public-audio')
      .upload(storagePath, mp3Buffer, {
        contentType: 'audio/mpeg',
        upsert: true
      });
    
    if (uploadError) throw uploadError;
    
    const { data: { publicUrl } } = supabase.storage
      .from('public-audio')
      .getPublicUrl(storagePath);
    
    console.log(`   ✓ New URL: ${publicUrl}`);
    
    console.log('\n💾 Step 4: Updating database...');
    const { error: updateError } = await supabase
      .from('songs')
      .update({ url: publicUrl, storage_path: storagePath })
      .eq('track_id', TEST_TRACK_ID);
    
    if (updateError) throw updateError;
    
    console.log('\n✅ SUCCESS! Test at: https://www.2kleigh.com/');
    
  } catch (error) {
    console.error('\n❌ Migration Failed:', error.message);
    process.exit(1);
  }
}

testMigrateMemories();
