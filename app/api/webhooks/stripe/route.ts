import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Simple Stripe webhook to insert entitlements when Checkout completes.
export async function POST(request: Request) {
  const sig = request.headers.get('stripe-signature') || '';
  const body = await request.text();

  // If webhook secret not set, return 400
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing STRIPE_WEBHOOK_SECRET' }, { status: 400 });
  }

  // Verify using Stripe if available, otherwise accept POST (best-effort)
  let event: any = null;
  try {
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (stripeSecret) {
      const stripe = await import('stripe').then(m => new m.default(stripeSecret));
      event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } else {
      event = JSON.parse(body);
    }
  } catch (err) {
    console.error('Stripe webhook verification failed', err);
    return NextResponse.json({ error: 'Webhook verification failed' }, { status: 400 });
  }

  // Handle checkout.session.completed with idempotency check
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    // metadata should include track_id if set in create-checkout
    const trackId = session.metadata?.track_id || session?.client_reference_id;

    if (trackId) {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Idempotency: skip if we've already recorded this session_id
        const { data: existing } = await supabase
          .from('entitlements')
          .select('id')
          .eq('session_id', session.id)
          .limit(1)
          .maybeSingle();

        if (!existing) {
          await supabase.from('entitlements').insert({
            track_id: trackId,
            session_id: session.id,
            purchased_at: new Date().toISOString()
          });
        } else {
          console.log('Entitlement already exists for session:', session.id);
        }
      } catch (err) {
        console.error('Failed to insert entitlement', err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
