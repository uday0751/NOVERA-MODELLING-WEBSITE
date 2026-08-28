'use server';


import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  LoginInput,
  RegisterInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from '@/lib/validations/auth';

export async function loginAction(data: LoginInput) {
  const result = loginSchema.safeParse(data);
  if (!result.success) {
    return { error: 'Invalid form input' };
  }

  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (signInError) {
    return { error: signInError.message };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'User not found' };
  }

  // Fetch profile for role and status
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, status')
    .eq('user_id', user.id)
    .single();

  if (profileError || !profile) {
    // If profile is missing, fallback to pending approval or login
    redirect('/pending-approval');
  }

  if (profile.status === 'pending' || profile.status === 'rejected' || profile.status === 'suspended') {
    redirect('/pending-approval');
  }

  switch (profile.role) {
    case 'model':
      redirect('/model/dashboard');
    case 'client':
      redirect('/client/dashboard');
    case 'admin':
      redirect('/admin/dashboard');
    default:
      redirect('/pending-approval');
  }
}

export async function registerAction(data: RegisterInput) {
  const result = registerSchema.safeParse(data);
  if (!result.success) {
    return { error: 'Invalid form input' };
  }

  const supabase = await createClient();

  const { error: signUpError } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      data: {
        full_name: result.data.fullName,
        role: result.data.role,
      },
    },
  });

  if (signUpError) {
    return { error: signUpError.message };
  }

  redirect('/pending-approval?registered=true');
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

export async function forgotPasswordAction(data: ForgotPasswordInput) {
  const result = forgotPasswordSchema.safeParse(data);
  if (!result.success) {
    return { error: 'Invalid email address' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(result.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: 'Password reset link sent to your email.' };
}

export async function resetPasswordAction(data: ResetPasswordInput) {
  const result = resetPasswordSchema.safeParse(data);
  if (!result.success) {
    return { error: 'Invalid password input' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: result.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: 'Password updated successfully. You can now log in.' };
}
