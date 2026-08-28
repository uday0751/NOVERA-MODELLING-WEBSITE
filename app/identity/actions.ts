'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';

/** 1. Create Stripe Identity Verification Session */
export async function createIdentityVerificationSessionAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, full_name, email, stripe_verification_session_id')
    .eq('user_id', user.id)
    .single();

  if (!profile) return { error: 'Profile not found' };

  try {
    const domain = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const redirectUrl = profile.role === 'model' ? `${domain}/model/dashboard` : `${domain}/client/dashboard`;

    const verificationSession = await stripe.identity.verificationSessions.create({
      type: 'document',
      metadata: {
        profile_id: profile.id,
        user_id: user.id,
        role: profile.role,
      },
      options: {
        document: {
          require_matching_selfie: true,
        },
      },
      return_url: `${redirectUrl}?identity_verification=complete`,
    });

    await supabase
      .from('profiles')
      .update({ stripe_verification_session_id: verificationSession.id })
      .eq('id', profile.id);

    return { url: verificationSession.url };
  } catch (err: any) {
    return { error: err.message || 'Failed to create Stripe Identity verification session' };
  }
}

/** 2. Sync Identity Verification Status from Stripe */
export async function syncIdentityVerificationStatusAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, stripe_verification_session_id, identity_verified')
    .eq('user_id', user.id)
    .single();

  if (!profile) return { error: 'Profile not found' };

  if (profile.identity_verified) {
    return { verified: true };
  }

  if (!profile.stripe_verification_session_id) {
    return { verified: false };
  }

  try {
    const session = await stripe.identity.verificationSessions.retrieve(
      profile.stripe_verification_session_id
    );

    const isVerified = session.status === 'verified';

    if (isVerified && !profile.identity_verified) {
      await supabase
        .from('profiles')
        .update({
          identity_verified: true,
          identity_verified_at: new Date().toISOString(),
        })
        .eq('id', profile.id);
    }

    const redirectUrl = profile.role === 'model' ? '/model/dashboard' : '/client/dashboard';
    revalidatePath(redirectUrl);
    return { verified: isVerified };
  } catch (err: any) {
    return { error: err.message };
  }
}
