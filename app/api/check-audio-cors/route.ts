import { NextResponse } from 'next/server'

// Simple endpoint to check CORS and Cache headers for an audio URL or a
// filename in the configured public bucket. Query params:
// - url=<full-url> OR
// - filename=<path/inside/bucket>
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const params = url.searchParams;

    let target: string | null = null;
    if (params.get('url')) {
      target = params.get('url');
    } else if (params.get('filename')) {
      const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_URL;
      if (!bucket) {
        return NextResponse.json({ error: 'NEXT_PUBLIC_SUPABASE_BUCKET_URL not configured' }, { status: 400 });
      }
      const filename = params.get('filename');
      target = `${bucket.replace(/\/$/, '')}/${filename}`;
    } else {
      return NextResponse.json({ error: 'Provide url or filename query param' }, { status: 400 });
    }

    // Try a HEAD request first; fallback to GET if not allowed.
    let resp = null;
    try {
      resp = await fetch(target!, { method: 'HEAD' });
      if (!resp.ok && resp.status === 405) {
        resp = await fetch(target!);
      }
    } catch (err) {
      // Some servers reject HEAD; try GET as fallback
      resp = await fetch(target!);
    }

    if (!resp) throw new Error('No response from target');

    // Select headers we care about
    const headers = {
      'access-control-allow-origin': resp.headers.get('access-control-allow-origin'),
      'access-control-allow-methods': resp.headers.get('access-control-allow-methods'),
      'access-control-allow-headers': resp.headers.get('access-control-allow-headers'),
      'cache-control': resp.headers.get('cache-control'),
      'content-type': resp.headers.get('content-type'),
      'content-length': resp.headers.get('content-length'),
      'vary': resp.headers.get('vary')
    };

    return NextResponse.json({ ok: resp.ok, status: resp.status, headers });
  } catch (err: any) {
    return NextResponse.json({ error: String(err.message || err) }, { status: 500 });
  }
}
