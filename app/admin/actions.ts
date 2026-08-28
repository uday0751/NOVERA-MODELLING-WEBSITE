'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import {
  updateModelStatusSchema,
  toggleClientVerificationSchema,
  resolveReportSchema,
  UpdateModelStatusInput,
  ToggleClientVerificationInput,
  ResolveReportInput,
} from '@/lib/validations/admin';

/** Helper to verify admin authorization */
async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized', supabase: null, user: null };

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('user_id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    return { error: 'Admin access required', supabase: null, user: null };
  }

  return { error: null, supabase, user };
}

/** 1. Model Approval / Rejection / Suspension Action */
export async function updateModelStatusAction(data: UpdateModelStatusInput) {
  const parsed = updateModelStatusSchema.safeParse(data);
  if (!parsed.success) return { error: 'Invalid input' };

  const { error: authError, supabase } = await verifyAdmin();
  if (authError || !supabase) return { error: authError };

  const { error } = await supabase
    .from('profiles')
    .update({ status: parsed.data.status })
    .eq('id', parsed.data.profileId);

  if (error) return { error: error.message };

  revalidatePath('/admin/models');
  revalidatePath('/admin/dashboard');
  return { success: `Model status updated to ${parsed.data.status}` };
}

/** 2. Toggle Client Verification Status Action */
export async function toggleClientVerificationAction(data: ToggleClientVerificationInput) {
  const parsed = toggleClientVerificationSchema.safeParse(data);
  if (!parsed.success) return { error: 'Invalid input' };

  const { error: authError, supabase } = await verifyAdmin();
  if (authError || !supabase) return { error: authError };

  const { error } = await supabase
    .from('clients')
    .update({ verified: parsed.data.verified })
    .eq('profile_id', parsed.data.clientId);

  if (error) return { error: error.message };

  revalidatePath('/admin/clients');
  revalidatePath('/admin/dashboard');
  return { success: `Client verification updated to ${parsed.data.verified ? 'Verified' : 'Unverified'}` };
}

/** 3. Resolve User Report Action */
export async function resolveReportAction(data: ResolveReportInput) {
  const parsed = resolveReportSchema.safeParse(data);
  if (!parsed.success) return { error: 'Invalid report details' };

  const { error: authError, supabase } = await verifyAdmin();
  if (authError || !supabase) return { error: authError };

  if (parsed.data.action === 'suspend_user') {
    // Suspend reported user account
    await supabase
      .from('profiles')
      .update({ status: 'suspended' })
      .eq('id', parsed.data.reportedUserId);

    // Update report status
    await supabase
      .from('reports')
      .update({ status: 'actioned' })
      .eq('id', parsed.data.reportId);
  } else if (parsed.data.action === 'dismiss') {
    await supabase
      .from('reports')
      .update({ status: 'dismissed' })
      .eq('id', parsed.data.reportId);
  } else {
    await supabase
      .from('reports')
      .update({ status: 'actioned' })
      .eq('id', parsed.data.reportId);
  }

  revalidatePath('/admin/reports');
  revalidatePath('/admin/dashboard');
  return { success: 'Report status updated successfully' };
}
