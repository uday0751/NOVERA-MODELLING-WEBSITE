import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { SignOutButton } from '@/components/sign-out-button';
import { ProfileStatusCard } from '@/components/model/dashboard/profile-status-card';
import { IdentityVerificationCard } from '@/components/identity/identity-verification-card';
import { StatsEditor } from '@/components/model/dashboard/stats-editor';
import { MediaManager } from '@/components/model/dashboard/media-manager';
import { RatesEditor } from '@/components/model/dashboard/rates-editor';
import { AvailabilityCalendar } from '@/components/model/dashboard/availability-calendar';
import { IncomingBookingsList } from '@/components/model/dashboard/incoming-bookings-list';
import { AppliedCastingsList } from '@/components/model/dashboard/applied-castings-list';

export default async function ModelDashboardPage() {
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

  // Fetch details, media, rates, availability, bookings, casting applications
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

  const { data: availability } = await supabase
    .from('model_availability')
    .select('*')
    .eq('model_id', profile.id);

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('model_id', profile.id)
    .order('created_at', { ascending: false });

  const { data: applications } = await supabase
    .from('casting_applications')
    .select('*, casting_calls(title, category, location, budget)')
    .eq('model_id', profile.id)
    .order('applied_at', { ascending: false });

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-6 text-black">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">Model Dashboard</h1>
          <p className="text-sm text-gray-600">Welcome, {profile.full_name}</p>
        </div>
        <SignOutButton />
      </div>

      <ProfileStatusCard
        profile={profile}
        hasDetails={Boolean(details)}
        hasMedia={Boolean(media && media.length > 0)}
        hasRates={Boolean(rates)}
      />

      <IdentityVerificationCard
        role="model"
        isVerified={Boolean(profile.identity_verified)}
        verifiedAt={profile.identity_verified_at}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsEditor details={details} />
        <RatesEditor rates={rates} />
      </div>

      <MediaManager media={media || []} />

      <AvailabilityCalendar initialAvailability={availability || []} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <IncomingBookingsList
          bookings={bookings || []}
          identityVerified={Boolean(profile.identity_verified)}
        />
        <AppliedCastingsList applications={applications || []} />
      </div>
    </main>
  );
}
