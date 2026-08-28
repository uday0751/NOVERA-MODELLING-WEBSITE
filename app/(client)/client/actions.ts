'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import {
  bookingRequestSchema,
  castingCallSchema,
  BookingRequestInput,
  CastingCallInput,
} from '@/lib/validations/client';

export async function toggleShortlistAction(modelId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!profile) return { error: 'Profile not found' };

  // Check if already shortlisted
  const { data: existing } = await supabase
    .from('client_shortlists')
    .select('id')
    .eq('client_id', profile.id)
    .eq('model_id', modelId)
    .maybeSingle();

  if (existing) {
    // Remove from shortlist
    const { error } = await supabase
      .from('client_shortlists')
      .delete()
      .eq('id', existing.id);

    if (error) return { error: error.message };
    revalidatePath('/client/shortlist');
    revalidatePath(`/client/models/${modelId}`);
    return { isShortlisted: false };
  } else {
    // Add to shortlist
    const { error } = await supabase
      .from('client_shortlists')
      .insert({
        client_id: profile.id,
        model_id: modelId,
      });

    if (error) return { error: error.message };
    revalidatePath('/client/shortlist');
    revalidatePath(`/client/models/${modelId}`);
    return { isShortlisted: true };
  }
}

export async function createBookingRequestAction(modelId: string, data: BookingRequestInput) {
  const parsed = bookingRequestSchema.safeParse(data);
  if (!parsed.success) {
    return { error: 'Invalid booking request details' };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { data: clientProfile } = await supabase
    .from('profiles')
    .select('id, full_name')
    .eq('user_id', user.id)
    .single();

  if (!clientProfile) return { error: 'Profile not found' };

  // Insert booking record with status = requested
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      model_id: modelId,
      client_id: clientProfile.id,
      status: 'requested',
      date: parsed.data.date,
      location: parsed.data.location,
      project_type: parsed.data.projectType,
      brief: parsed.data.brief,
      budget: parsed.data.budget,
      usage_rights: parsed.data.usageRights,
    })
    .select('id')
    .single();

  if (bookingError) return { error: bookingError.message };

  // Notify the model by inserting a notification record
  await supabase.from('notifications').insert({
    user_id: modelId,
    title: 'New Booking Request',
    message: `You received a new booking request from ${clientProfile.full_name} for ${parsed.data.projectType} on ${parsed.data.date}.`,
  });

  revalidatePath('/client/dashboard');
  revalidatePath(`/client/models/${modelId}`);
  return { success: true, bookingId: booking.id };
}

export async function createCastingCallAction(data: CastingCallInput) {
  const parsed = castingCallSchema.safeParse(data);
  if (!parsed.success) {
    return { error: 'Invalid casting call details' };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!profile) return { error: 'Profile not found' };

  const { error } = await supabase.from('casting_calls').insert({
    client_id: profile.id,
    title: parsed.data.title,
    description: parsed.data.description,
    category: parsed.data.category || null,
    location: parsed.data.location || null,
    date: parsed.data.date || null,
    budget: parsed.data.budget || null,
    status: 'open',
  });

  if (error) return { error: error.message };

  revalidatePath('/client/dashboard');
  return { success: true };
}
