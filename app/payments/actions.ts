'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { stripe, PLATFORM_FEE_PERCENTAGE } from '@/lib/stripe';
import {
  checkoutSessionSchema,
  completeBookingSchema,
  adminRefundSchema,
  CheckoutSessionInput,
  CompleteBookingInput,
  AdminRefundInput,
} from '@/lib/validations/payment';

/** 1. Create Stripe Connect Account & Onboarding Link for Models */
export async function createStripeConnectOnboardingLinkAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, user_id, role, email, stripe_account_id, stripe_onboarding_completed')
    .eq('user_id', user.id)
    .single();

  if (!profile || profile.role !== 'model') {
    return { error: 'Only models can onboard with Stripe Connect' };
  }

  try {
    let accountId = profile.stripe_account_id;

    // Create a Stripe Express account if model doesn't have one yet
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        email: profile.email || undefined,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        metadata: {
          profile_id: profile.id,
        },
      });
      accountId = account.id;

      await supabase
        .from('profiles')
        .update({ stripe_account_id: accountId })
        .eq('id', profile.id);
    }

    const domain = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${domain}/model/dashboard?stripe_connect=refresh`,
      return_url: `${domain}/model/dashboard?stripe_connect=success`,
      type: 'account_onboarding',
    });

    return { url: accountLink.url };
  } catch (err: any) {
    return { error: err.message || 'Failed to create Stripe Connect onboarding link' };
  }
}

/** 2. Check & Sync Stripe Connect Status for Model */
export async function syncStripeConnectStatusAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, stripe_account_id, stripe_onboarding_completed')
    .eq('user_id', user.id)
    .single();

  if (!profile || !profile.stripe_account_id) {
    return { completed: false };
  }

  try {
    const account = await stripe.accounts.retrieve(profile.stripe_account_id);
    const isCompleted = account.details_submitted && account.charges_enabled;

    if (isCompleted !== profile.stripe_onboarding_completed) {
      await supabase
        .from('profiles')
        .update({ stripe_onboarding_completed: isCompleted })
        .eq('id', profile.id);
    }

    revalidatePath('/model/dashboard');
    return { completed: isCompleted };
  } catch (err: any) {
    return { error: err.message };
  }
}

/** 3. Create Checkout Session for Client Payment on Accepted Booking */
export async function createBookingCheckoutSessionAction(data: CheckoutSessionInput) {
  const parsed = checkoutSessionSchema.safeParse(data);
  if (!parsed.success) return { error: 'Invalid checkout details' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { data: clientProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!clientProfile) return { error: 'Client profile not found' };

  // Fetch booking details
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('*, profiles:model_id(stripe_account_id, stripe_onboarding_completed, full_name)')
    .eq('id', parsed.data.bookingId)
    .single();

  if (bookingError || !booking) return { error: 'Booking not found' };

  if (booking.client_id !== clientProfile.id) {
    return { error: 'You are not authorized to pay for this booking' };
  }

  if (booking.status !== 'accepted') {
    return { error: 'Payment can only be processed when booking status is accepted' };
  }

  const modelProfile = booking.profiles as any;
  if (!modelProfile?.stripe_onboarding_completed) {
    return { error: 'Model has not completed Stripe Connect onboarding yet.' };
  }

  const amount = Number(booking.budget) || 100;
  const domain = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Booking with ${modelProfile.full_name || 'Model'}`,
              description: `Project: ${booking.project_type || 'Modeling'} | Date: ${booking.date}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${domain}/client/dashboard?payment=success&booking_id=${booking.id}`,
      cancel_url: `${domain}/client/dashboard?payment=cancelled`,
      metadata: {
        booking_id: booking.id,
        client_id: clientProfile.id,
        model_id: booking.model_id,
        model_stripe_account_id: modelProfile.stripe_account_id,
        amount: String(amount),
      },
    });

    return { url: session.url };
  } catch (err: any) {
    return { error: err.message || 'Failed to create Checkout session' };
  }
}

/** 4. Client Marks Booking as Completed & Releases Funds to Model */
export async function completeBookingAndReleasePayoutAction(data: CompleteBookingInput) {
  const parsed = completeBookingSchema.safeParse(data);
  if (!parsed.success) return { error: 'Invalid booking ID' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { data: clientProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!clientProfile) return { error: 'Client profile not found' };

  const { data: booking } = await supabase
    .from('bookings')
    .select('*, profiles:model_id(stripe_account_id)')
    .eq('id', parsed.data.bookingId)
    .single();

  if (!booking || booking.client_id !== clientProfile.id) {
    return { error: 'Booking not found or unauthorized' };
  }

  // Update booking status to completed
  await supabase
    .from('bookings')
    .update({ status: 'completed' })
    .eq('id', booking.id);

  // Fetch payment held for this booking
  const { data: payment } = await supabase
    .from('payments')
    .select('*')
    .eq('booking_id', booking.id)
    .eq('status', 'held')
    .single();

  if (payment && booking.profiles?.stripe_account_id) {
    const totalAmount = Number(payment.amount);
    const platformFee = Number(payment.platform_fee) || totalAmount * PLATFORM_FEE_PERCENTAGE;
    const netPayout = Math.max(totalAmount - platformFee, 0);

    try {
      // Release funds via Stripe Transfer to Model Connected Account
      const transfer = await stripe.transfers.create({
        amount: Math.round(netPayout * 100),
        currency: 'usd',
        destination: booking.profiles.stripe_account_id,
        description: `Payout for completed booking ${booking.id}`,
        metadata: { booking_id: booking.id },
      });

      // Update payment record to released
      await supabase
        .from('payments')
        .update({
          status: 'released',
          stripe_transfer_id: transfer.id,
          platform_fee: platformFee,
        })
        .eq('id', payment.id);
    } catch (err: any) {
      console.error('Stripe transfer error:', err.message);
    }
  }

  revalidatePath('/client/dashboard');
  revalidatePath('/model/dashboard');
  return { success: 'Booking marked as completed and funds released to model!' };
}

/** 5. Admin Refund Payment Action */
export async function adminRefundPaymentAction(data: AdminRefundInput) {
  const parsed = adminRefundSchema.safeParse(data);
  if (!parsed.success) return { error: 'Invalid booking ID' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  // Check admin authorization
  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (adminProfile?.role !== 'admin') {
    return { error: 'Admin access required' };
  }

  const { data: payment } = await supabase
    .from('payments')
    .select('*')
    .eq('booking_id', parsed.data.bookingId)
    .eq('status', 'held')
    .single();

  if (!payment) {
    return { error: 'No held payment found for this booking' };
  }

  try {
    if (payment.stripe_payment_intent_id) {
      await stripe.refunds.create({
        payment_intent: payment.stripe_payment_intent_id,
        reason: 'requested_by_customer',
      });
    }

    // Update payment record to refunded
    await supabase
      .from('payments')
      .update({ status: 'refunded' })
      .eq('id', payment.id);

    // Update booking status to cancelled
    await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', parsed.data.bookingId);

    revalidatePath('/admin/dashboard');
    return { success: 'Payment refunded and booking cancelled successfully.' };
  } catch (err: any) {
    return { error: err.message || 'Failed to refund payment via Stripe' };
  }
}
