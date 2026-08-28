'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import {
  sendMessageSchema,
  submitReportSchema,
  SendMessageInput,
  SubmitReportInput,
} from '@/lib/validations/messages';

export async function sendMessageAction(data: SendMessageInput) {
  const parsed = sendMessageSchema.safeParse(data);
  if (!parsed.success) {
    return { error: 'Invalid message input' };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  // Fetch current user profile
  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('id, status')
    .eq('user_id', user.id)
    .single();

  if (!currentProfile) return { error: 'Profile not found' };

  // Fetch booking details to identify participants
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('id, model_id, client_id')
    .eq('id', parsed.data.bookingId)
    .single();

  if (bookingError || !booking) {
    return { error: 'Booking not found' };
  }

  // Ensure current user is a participant in this booking
  const isModel = booking.model_id === currentProfile.id;
  const isClient = booking.client_id === currentProfile.id;

  if (!isModel && !isClient) {
    return { error: 'You are not a participant in this booking' };
  }

  const recipientProfileId = isModel ? booking.client_id : booking.model_id;

  // Check sender status for suspension
  if (currentProfile.status === 'suspended') {
    return { error: 'Your account is suspended. You cannot send messages.' };
  }

  // Check recipient status for suspension
  const { data: recipientProfile } = await supabase
    .from('profiles')
    .select('status')
    .eq('id', recipientProfileId)
    .single();

  if (recipientProfile?.status === 'suspended') {
    return { error: 'Cannot send message because the recipient account is suspended.' };
  }

  // Insert message
  const { data: newMessage, error: messageError } = await supabase
    .from('messages')
    .insert({
      booking_id: booking.id,
      sender_id: currentProfile.id,
      content: parsed.data.content,
    })
    .select('*')
    .single();

  if (messageError) {
    return { error: messageError.message };
  }

  revalidatePath(`/messages/${booking.id}`);
  return { success: true, message: newMessage };
}

export async function submitReportAction(data: SubmitReportInput) {
  const parsed = submitReportSchema.safeParse(data);
  if (!parsed.success) {
    return { error: 'Invalid report details' };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!currentProfile) return { error: 'Profile not found' };

  const { error } = await supabase.from('reports').insert({
    reporter_id: currentProfile.id,
    reported_user_id: parsed.data.reportedUserId,
    booking_id: parsed.data.bookingId,
    reason: parsed.data.reason,
    status: 'pending',
  });

  if (error) return { error: error.message };

  return { success: 'Report submitted successfully. Agency admins will review it.' };
}
