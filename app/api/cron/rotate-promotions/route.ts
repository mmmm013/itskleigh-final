import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: current } = await supabase
    .from('featured_rotation')
    .select('current_playlist_id')
    .eq('domain', '2kleigh.com')
    .single()

  const nextPlaylistId = current 
    ? (current.current_playlist_id % 7) + 1 
    : 1

  await supabase
    .from('featured_rotation')
    .upsert({
      domain: '2kleigh.com',
      current_playlist_id: nextPlaylistId,
      updated_at: new Date().toISOString()
    })

  return NextResponse.json({
    success: true,
    previous_playlist: current?.current_playlist_id,
    new_playlist: nextPlaylistId
  })
}
