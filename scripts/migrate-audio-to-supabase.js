/**
 * 🔴 AUDIO FIX: Migrate all audio files from DISCO to Supabase Storage
 * 
 * This script:
 * 1. Downloads MP3s from DISCO URLs (from songs table)
 * 2. Uploads them to Supabase Storage (public-audio bucket)
 * 3. Updates songs table with new Supabase URLs
 * 4. Uses track_id as the primary mapping key
 * 
 * Usage:
 *   node scripts/migrate-audio-to-supabase.js
 * 
 * Environment variables needed:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY (from Supabase Settings > API)
 */

const { createClient } = require('@supabase/supabase-js')
const axios = require('axios')
const fs = require('fs')
const path = require('path')

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eajxgrbxvkhfmmfiotpm.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SERVICE_ROLE_KEY) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required')
  console.error('   Get it from: Supabase Dashboard > Settings > API > service_role key')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

// Stats tracking
const stats = {
  total: 0,
  success: 0,
  failed: 0,
  skipped: 0
}

async function migrateSongs(limit = null) {
  console.log('\n🎵 Starting audio migration from DISCO to Supabase...\n')
  
  try {
    // Get all songs with DISCO URLs
    let query = supabase
      .from('songs')
      .select('id, track_id, title, artist, url')
      .like('url', '%disco%')
      .order('id')
    
    if (limit) {
      query = query.limit(limit)
    }
    
    const { data: songs, error } = await query
    
    if (error) throw error
    
    if (!songs || songs.length === 0) {
      console.log('✅ No songs found with DISCO URLs. Migration complete!')
      return
    }
    
    stats.total = songs.length
    console.log(`📊 Found ${songs.length} songs to migrate\n`)
    
    // Process each song
    for (let i = 0; i < songs.length; i++) {
      const song = songs[i]
      const progress = `[${i + 1}/${songs.length}]`
      
      try {
        await migrateSingleSong(song, progress)
        stats.success++
      } catch (err) {
        console.error(`${progress} ❌ FAILED: ${song.title} - ${err.message}`)
        stats.failed++
      }
      
      // Add delay to avoid rate limits
      if (i < songs.length - 1) {
        await sleep(100)
      }
    }
    
    // Print summary
    console.log('\n' + '='.repeat(60))
    console.log('📊 MIGRATION SUMMARY')
    console.log('='.repeat(60))
    console.log(`Total songs:    ${stats.total}`)
    console.log(`✅ Success:      ${stats.success}`)
    console.log(`❌ Failed:       ${stats.failed}`)
    console.log(`⏭️  Skipped:      ${stats.skipped}`)
    console.log('='.repeat(60) + '\n')
    
  } catch (error) {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  }
}

async function migrateSingleSong(song, progress) {
  const { id, track_id, title, artist, url } = song
  
  // Skip if no track_id
  if (!track_id) {
    console.log(`${progress} ⏭️  SKIP: ${title} (no track_id)`)
    stats.skipped++
    return
  }
  
  // Check if already migrated
  const { data: existing } = await supabase
    .from('songs')
    .select('storage_path')
    .eq('id', id)
    .single()
  
  if (existing?.storage_path) {
    console.log(`${progress} ⏭️  SKIP: ${title} (already migrated)`)
    stats.skipped++
    return
  }
  
  console.log(`${progress} 🔄 Processing: ${title} by ${artist}`)
  
  // Step 1: Download from DISCO
  console.log(`          ⬇️  Downloading from DISCO...`)
  const response = await axios.get(url, { 
    responseType: 'arraybuffer',
    timeout: 30000 // 30 second timeout
  })
  
  const audioBuffer = Buffer.from(response.data)
  console.log(`          ✅ Downloaded ${(audioBuffer.length / 1024 / 1024).toFixed(2)} MB`)
  
  // Step 2: Upload to Supabase Storage
  const filename = `${track_id}.mp3`
  const storagePath = `tracks/${filename}`
  
  console.log(`          ⬆️  Uploading to Supabase...`)
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('public-audio')
    .upload(storagePath, audioBuffer, {
      contentType: 'audio/mpeg',
      upsert: true
    })
  
  if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)
  
  // Step 3: Generate new Supabase URL
  const newUrl = `${SUPABASE_URL}/storage/v1/object/public/public-audio/${storagePath}`
  
  // Step 4: Update database
  console.log(`          💾 Updating database...`)
  const { error: updateError } = await supabase
    .from('songs')
    .update({ 
      url: newUrl,
      storage_path: storagePath
    })
    .eq('id', id)
  
  if (updateError) throw new Error(`Database update failed: ${updateError.message}`)
  
  console.log(`${progress} ✅ SUCCESS: ${title}`)
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Run migration
// Start with 10 songs for testing, then do all:
const LIMIT = process.argv[2] ? parseInt(process.argv[2]) : null

if (LIMIT) {
  console.log(`⚠️  TEST MODE: Migrating first ${LIMIT} songs only`)
  console.log(`   Run without limit to migrate all: node scripts/migrate-audio-to-supabase.js\n`)
} else {
  console.log('🚀 FULL MODE: Migrating ALL songs\n')
}

migrateSONgs(LIMIT)
  .then(() => {
    console.log('✅ Migration script completed!')
    process.exit(0)
  })
  .catch((err) => {
    console.error('❌ Migration failed:', err)
    process.exit(1)
migrateSongs(LIMIT)