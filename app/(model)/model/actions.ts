'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import {
  step1BasicInfoSchema,
  step2PhysicalStatsSchema,
  step3CategoriesSchema,
  step5RatesSchema,
  Step1BasicInfoInput,
  Step2PhysicalStatsInput,
  Step3CategoriesInput,
  Step5RatesInput,
} from '@/lib/validations/onboarding';

export async function saveStep1Action(data: Step1BasicInfoInput) {
  const parsed = step1BasicInfoSchema.safeParse(data);
  if (!parsed.success) {
    return { error: 'Invalid basic information input' };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { error } = await supabase
    .from('profiles')
    .update({
      phone: parsed.data.phone,
      // store location or extra info in profile/metadata
    })
    .eq('user_id', user.id);

  if (error) return { error: error.message };
  return { success: true };
}

export async function saveStep2Action(data: Step2PhysicalStatsInput) {
  const parsed = step2PhysicalStatsSchema.safeParse(data);
  if (!parsed.success) {
    return { error: 'Invalid physical stats input' };
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

  const { error } = await supabase
    .from('model_details')
    .upsert({
      profile_id: profile.id,
      height: parsed.data.height,
      weight: parsed.data.weight,
      bust: parsed.data.bust,
      waist: parsed.data.waist,
      hips: parsed.data.hips,
      shoe_size: parsed.data.shoeSize,
      hair_color: parsed.data.hairColor,
      eye_color: parsed.data.eyeColor,
      ethnicity: parsed.data.ethnicity,
      tattoos: parsed.data.tattoos,
      piercings: parsed.data.piercings,
      bio: parsed.data.bio,
      updated_at: new Date().toISOString(),
    });

  if (error) return { error: error.message };
  return { success: true };
}

export async function saveStep3Action(data: Step3CategoriesInput) {
  const parsed = step3CategoriesSchema.safeParse(data);
  if (!parsed.success) {
    return { error: 'Invalid categories selection' };
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

  const { error } = await supabase
    .from('model_details')
    .upsert({
      profile_id: profile.id,
      categories: parsed.data.categories,
      languages: parsed.data.languages,
      updated_at: new Date().toISOString(),
    });

  if (error) return { error: error.message };
  return { success: true };
}

export async function uploadMediaAction(formData: FormData) {
  const file = formData.get('file') as File | null;
  const category = formData.get('category') as string | null; // headshot, full_body, profile, editorial, reel
  const type = formData.get('type') as 'photo' | 'video' | null;

  if (!file || !category || !type) {
    return { error: 'Missing file, category, or media type' };
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

  const fileExt = file.name.split('.').pop();
  const fileName = `${profile.id}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('model-media')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) {
    return { error: uploadError.message };
  }

  const { data: { publicUrl } } = supabase.storage
    .from('model-media')
    .getPublicUrl(fileName);

  const { error: dbError } = await supabase.from('model_media').insert({
    model_id: profile.id,
    url: publicUrl,
    type,
    category,
    sort_order: 0,
  });

  if (dbError) {
    return { error: dbError.message };
  }

  revalidatePath('/model/onboarding');
  revalidatePath('/model/dashboard');
  return { success: true, url: publicUrl };
}

export async function deleteMediaAction(mediaId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { error } = await supabase
    .from('model_media')
    .delete()
    .eq('id', mediaId);

  if (error) return { error: error.message };

  revalidatePath('/model/onboarding');
  revalidatePath('/model/dashboard');
  return { success: true };
}

export async function saveStep5Action(data: Step5RatesInput) {
  const parsed = step5RatesSchema.safeParse(data);
  if (!parsed.success) {
    return { error: 'Invalid rate card input' };
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

  const { error } = await supabase.from('model_rates').upsert({
    model_id: profile.id,
    hourly_rate: parsed.data.hourlyRate,
    half_day_rate: parsed.data.halfDayRate,
    full_day_rate: parsed.data.fullDayRate,
    currency: parsed.data.currency,
    updated_at: new Date().toISOString(),
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function submitOnboardingAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { error } = await supabase
    .from('profiles')
    .update({ status: 'pending' })
    .eq('user_id', user.id);

  if (error) return { error: error.message };

  revalidatePath('/model/dashboard');
  return { success: true };
}

export async function toggleAvailabilityAction(dateString: string, isAvailable: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!profile) return { error: 'Profile not found' };

  const { error } = await supabase
    .from('model_availability')
    .upsert({
      model_id: profile.id,
      date: dateString,
      is_available: isAvailable,
    });

  if (error) return { error: error.message };

  revalidatePath('/model/dashboard');
  return { success: true };
}

export async function respondToBookingAction(bookingId: string, status: 'accepted' | 'declined') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { error } = await supabase
    .from('bookings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', bookingId);

  if (error) return { error: error.message };

  revalidatePath('/model/dashboard');
  return { success: true };
}
