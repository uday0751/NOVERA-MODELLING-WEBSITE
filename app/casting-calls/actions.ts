'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import {
  createCastingCallSchema,
  applyCastingCallSchema,
  updateApplicationStatusSchema,
  CreateCastingCallInput,
  ApplyCastingCallInput,
  UpdateApplicationStatusInput,
} from '@/lib/validations/casting';

/** 1. Client Posts a New Casting Call */
export async function createCastingCallAction(data: CreateCastingCallInput) {
  const parsed = createCastingCallSchema.safeParse(data);
  if (!parsed.success) return { error: 'Invalid casting call details' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('user_id', user.id)
    .single();

  if (!profile || profile.role !== 'client') {
    return { error: 'Only clients can post casting calls' };
  }

  const { data: newCall, error } = await supabase
    .from('casting_calls')
    .insert({
      client_id: profile.id,
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
      location: parsed.data.location,
      date: parsed.data.date,
      budget: parsed.data.budget,
      status: 'open',
    })
    .select('*')
    .single();

  if (error) return { error: error.message };

  revalidatePath('/casting-calls');
  revalidatePath('/client/dashboard');
  return { success: true, castingCall: newCall };
}

/** 2. Model 1-Click Application to Casting Call */
export async function applyToCastingCallAction(data: ApplyCastingCallInput) {
  const parsed = applyCastingCallSchema.safeParse(data);
  if (!parsed.success) return { error: 'Invalid casting call ID' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, status')
    .eq('user_id', user.id)
    .single();

  if (!profile || profile.role !== 'model') {
    return { error: 'Only registered models can apply to casting calls' };
  }

  if (profile.status === 'suspended') {
    return { error: 'Your account is suspended. You cannot apply.' };
  }

  // Check if model has already applied
  const { data: existingApp } = await supabase
    .from('casting_applications')
    .select('id')
    .eq('casting_call_id', parsed.data.castingCallId)
    .eq('model_id', profile.id)
    .single();

  if (existingApp) {
    return { error: 'You have already applied to this casting call' };
  }

  const { error } = await supabase
    .from('casting_applications')
    .insert({
      casting_call_id: parsed.data.castingCallId,
      model_id: profile.id,
      status: 'applied',
    });

  if (error) return { error: error.message };

  revalidatePath('/casting-calls');
  revalidatePath('/model/dashboard');
  return { success: 'Application submitted successfully!' };
}

/** 3. Client Updates Applicant Status & Auto-Creates Booking on Acceptance */
export async function updateCastingApplicationStatusAction(data: UpdateApplicationStatusInput) {
  const parsed = updateApplicationStatusSchema.safeParse(data);
  if (!parsed.success) return { error: 'Invalid input' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { data: clientProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!clientProfile) return { error: 'Unauthorized client profile' };

  // Fetch application details with casting call info
  const { data: app, error: appError } = await supabase
    .from('casting_applications')
    .select('*, casting_calls!inner(*)')
    .eq('id', parsed.data.applicationId)
    .single();

  if (appError || !app) return { error: 'Casting application not found' };

  const castingCall = app.casting_calls as any;
  if (castingCall.client_id !== clientProfile.id) {
    return { error: 'You are not authorized to manage this casting call' };
  }

  // Update application status
  const { error: updateError } = await supabase
    .from('casting_applications')
    .update({ status: parsed.data.status })
    .eq('id', app.id);

  if (updateError) return { error: updateError.message };

  // AUTO-BOOKING CREATION: If client accepts applicant, create booking contract
  if (parsed.data.status === 'accepted') {
    // Check if booking already exists
    const { data: existingBooking } = await supabase
      .from('bookings')
      .select('id')
      .eq('model_id', app.model_id)
      .eq('client_id', clientProfile.id)
      .eq('date', castingCall.date)
      .single();

    if (!existingBooking) {
      await supabase.from('bookings').insert({
        model_id: app.model_id,
        client_id: clientProfile.id,
        status: 'requested',
        date: castingCall.date,
        location: castingCall.location || 'Selected Location',
        project_type: `Casting: ${castingCall.title}`,
        brief: castingCall.description,
        budget: castingCall.budget,
      });
    }
  }

  revalidatePath(`/client/casting-calls/${castingCall.id}/applications`);
  revalidatePath('/client/dashboard');
  revalidatePath('/model/dashboard');

  return {
    success: `Applicant status updated to ${parsed.data.status}.${
      parsed.data.status === 'accepted' ? ' Booking contract automatically created!' : ''
    }`,
  };
}
