import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { OnboardingWizard } from '@/components/model/onboarding/onboarding-wizard';

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!profile) {
    redirect('/login');
  }

  // Fetch existing details, media, rates
  const { data: details } = await supabase
    .from('model_details')
    .select('*')
    .eq('profile_id', profile.id)
    .maybeSingle();

  const { data: media } = await supabase
    .from('model_media')
    .select('*')
    .eq('model_id', profile.id);

  const { data: rates } = await supabase
    .from('model_rates')
    .select('*')
    .eq('model_id', profile.id)
    .maybeSingle();

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <OnboardingWizard
        profile={profile}
        details={details}
        media={media || []}
        rates={rates}
      />
    </main>
  );
}
