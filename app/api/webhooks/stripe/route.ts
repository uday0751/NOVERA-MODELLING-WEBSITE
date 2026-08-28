import { NextResponse } from 'next/server';
import { stripe, PLATFORM_FEE_PERCENTAGE } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

// Service role Supabase client for webhook database operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') || '';

  let event;
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error(`Webhook Signature Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const bookingId = session.metadata?.booking_id;
        const totalAmount = Number(session.metadata?.amount || session.amount_total / 100);
        const platformFee = totalAmount * PLATFORM_FEE_PERCENTAGE;

        if (bookingId) {
          // Record held payment in payments table
          await supabaseAdmin.from('payments').insert({
            booking_id: bookingId,
            amount: totalAmount,
            platform_fee: platformFee,
            status: 'held',
            stripe_payment_intent_id: session.payment_intent as string,
          });

          // Ensure booking status is active/accepted
          await supabaseAdmin
            .from('bookings')
            .update({ status: 'accepted' })
            .eq('id', bookingId);
        }
        break;
      }

      case 'account.updated': {
        const account = event.data.object as any;
        const profileId = account.metadata?.profile_id;
        const isCompleted = account.details_submitted && account.charges_enabled;

        if (profileId) {
          await supabaseAdmin
            .from('profiles')
            .update({
              stripe_account_id: account.id,
              stripe_onboarding_completed: isCompleted,
            })
            .eq('id', profileId);
        }
        break;
      }

      case 'identity.verification_session.verified': {
        const session = event.data.object as any;
        const profileId = session.metadata?.profile_id;

        if (profileId) {
          await supabaseAdmin
            .from('profiles')
            .update({
              identity_verified: true,
              identity_verified_at: new Date().toISOString(),
            })
            .eq('id', profileId);
        }
        break;
      }

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }
  } catch (err: any) {
    console.error('Error handling webhook event:', err.message);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
