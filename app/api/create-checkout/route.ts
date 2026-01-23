import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const track = body.track || {};

    // Fallback buy link if Stripe is not configured
    const FALLBACK = 'https://buy.stripe.com/4gM14n4KD8Zg1zI8ZO9IQ03';

    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRICE_ID || !process.env.NEXT_PUBLIC_APP_URL) {
      return NextResponse.json({ url: FALLBACK });
    }

    const params = new URLSearchParams();
    params.append('mode', 'payment');
    params.append('line_items[0][price]', process.env.STRIPE_PRICE_ID!);
    params.append('line_items[0][quantity]', '1');
    params.append('success_url', `${process.env.NEXT_PUBLIC_APP_URL}/?checkout=success`);
    params.append('cancel_url', `${process.env.NEXT_PUBLIC_APP_URL}/?checkout=cancel`);
    if (track.id) params.append('metadata[track_id]', String(track.id));
    if (track.title) params.append('metadata[title]', String(track.title));

    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: 500 });
    }

    const json = await res.json();
    return NextResponse.json({ url: json.url });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
