'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createReviewSchema, CreateReviewInput } from '@/lib/validations/review';

export async function submitReviewAction(data: CreateReviewInput) {
  const parsed = createReviewSchema.safeParse(data);
  if (!parsed.success) return { error: 'Invalid review input details' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!currentProfile) return { error: 'Profile not found' };

  // Fetch booking to verify status is completed and user is participant
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', parsed.data.bookingId)
    .single();

  if (bookingError || !booking) {
    return { error: 'Booking not found' };
  }

  if (booking.status !== 'completed') {
    return { error: 'Reviews can only be submitted after a booking is completed.' };
  }

  const isParticipant =
    booking.model_id === currentProfile.id || booking.client_id === currentProfile.id;

  if (!isParticipant) {
    return { error: 'You are not a participant in this booking' };
  }

  // Prevent duplicate reviews for the same booking by the same reviewer
  const { data: existingReview } = await supabase
    .from('reviews')
    .select('id')
    .eq('booking_id', booking.id)
    .eq('reviewer_id', currentProfile.id)
    .single();

  if (existingReview) {
    return { error: 'You have already submitted a review for this booking.' };
  }

  const { error: insertError } = await supabase
    .from('reviews')
    .insert({
      booking_id: booking.id,
      reviewer_id: currentProfile.id,
      reviewee_id: parsed.data.revieweeId,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
    });

  if (insertError) {
    return { error: insertError.message };
  }

  revalidatePath(`/client/models/${parsed.data.revieweeId}`);
  revalidatePath('/client/dashboard');
  revalidatePath('/model/dashboard');

  return { success: 'Review submitted successfully!' };
}
