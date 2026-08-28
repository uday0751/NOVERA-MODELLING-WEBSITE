import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ShortlistButton } from '@/components/client/shortlist-button';
import { BookingRequestForm } from '@/components/client/booking-request-form';
import { TrustBadges } from '@/components/trust-badges';
import { ReviewsList } from '@/components/reviews/reviews-list';
import { ReviewForm } from '@/components/reviews/review-form';

interface ModelDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ModelDetailPage({ params }: ModelDetailPageProps) {
  const { id: modelId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // Fetch current client's profile ID
  const { data: clientProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  // Fetch model profile
  const { data: modelProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', modelId)
    .eq('role', 'model')
    .single();

  if (!modelProfile) {
    notFound();
  }

  // Fetch model details, media, rates, availability
  const { data: details } = await supabase
    .from('model_details')
    .select('*')
    .eq('profile_id', modelId)
    .maybeSingle();

  const { data: media } = await supabase
    .from('model_media')
    .select('*')
    .eq('model_id', modelId)
    .order('sort_order', { ascending: true });

  const { data: rates } = await supabase
    .from('model_rates')
    .select('*')
    .eq('model_id', modelId)
    .maybeSingle();

  const { data: availability } = await supabase
    .from('model_availability')
    .select('*')
    .eq('model_id', modelId);

  // Fetch completed bookings count for Trust Badges
  const { data: completedBookings } = await supabase
    .from('bookings')
    .select('id')
    .eq('model_id', modelId)
    .eq('status', 'completed');

  const completedBookingsCount = completedBookings?.length || 0;

  // Check completed booking between current user & model for review submission form
  let completedBookingForReview: any = null;
  let isShortlisted = false;

  if (clientProfile) {
    const { data: shortlistEntry } = await supabase
      .from('client_shortlists')
      .select('id')
      .eq('client_id', clientProfile.id)
      .eq('model_id', modelId)
      .maybeSingle();

    isShortlisted = Boolean(shortlistEntry);

    const { data: eligibleBooking } = await supabase
      .from('bookings')
      .select('id')
      .eq('client_id', clientProfile.id)
      .eq('model_id', modelId)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .maybeSingle();

    completedBookingForReview = eligibleBooking;
  }

  // Fetch reviews for this model
  const { data: rawReviews } = await supabase
    .from('reviews')
    .select(`
      id,
      rating,
      comment,
      created_at,
      reviewer:reviewer_id (
        full_name,
        role
      )
    `)
    .eq('reviewee_id', modelId)
    .order('created_at', { ascending: false });

  const formattedReviews = (rawReviews || []).map((r: any) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    created_at: r.created_at,
    reviewer: Array.isArray(r.reviewer) ? r.reviewer[0] : r.reviewer,
  }));

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-6 text-black">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <Link href="/client/models" className="text-xs text-gray-500 hover:underline">
            &larr; Back to Models Search
          </Link>
          <h1 className="text-2xl font-bold mt-1">{modelProfile.full_name}</h1>

          {/* Trust Badges */}
          <div className="mt-2">
            <TrustBadges
              status={modelProfile.status}
              completedBookingsCount={completedBookingsCount}
              stripeOnboardingCompleted={Boolean(modelProfile.stripe_onboarding_completed)}
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <ShortlistButton modelId={modelId} initialIsShortlisted={isShortlisted} />
          <BookingRequestForm modelId={modelId} modelName={modelProfile.full_name} />
        </div>
      </div>

      {/* Portfolio Gallery */}
      <div className="space-y-2 border-b pb-6">
        <h2 className="text-lg font-bold">Portfolio Gallery</h2>
        {(!media || media.length === 0) ? (
          <p className="text-sm text-gray-500">No media uploaded for this model.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {media.map((item: any) => (
              <div key={item.id} className="border rounded overflow-hidden relative bg-gray-100">
                {item.type === 'video' ? (
                  <video src={item.url} className="w-full h-40 object-cover" controls />
                ) : (
                  <img src={item.url} alt={item.category} className="w-full h-40 object-cover" />
                )}
                <span className="absolute bottom-1 left-1 bg-black text-white text-[10px] px-1.5 py-0.5 rounded capitalize">
                  {item.category}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Physical Stats & Features */}
      <div className="border p-4 rounded space-y-3 bg-white">
        <h2 className="text-lg font-bold">Physical Stats & Features</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
          <div><span className="font-semibold text-gray-500">Height:</span> {details?.height ? `${details.height} cm` : 'N/A'}</div>
          <div><span className="font-semibold text-gray-500">Weight:</span> {details?.weight ? `${details.weight} kg` : 'N/A'}</div>
          <div><span className="font-semibold text-gray-500">Bust/Waist/Hips:</span> {details?.bust || '-'}/{details?.waist || '-'}/{details?.hips || '-'}</div>
          <div><span className="font-semibold text-gray-500">Shoe Size:</span> {details?.shoe_size || 'N/A'}</div>
          <div><span className="font-semibold text-gray-500">Hair Color:</span> {details?.hair_color || 'N/A'}</div>
          <div><span className="font-semibold text-gray-500">Eye Color:</span> {details?.eye_color || 'N/A'}</div>
          <div><span className="font-semibold text-gray-500">Ethnicity:</span> {details?.ethnicity || 'N/A'}</div>
          <div><span className="font-semibold text-gray-500">Tattoos / Piercings:</span> {details?.tattoos ? 'Yes' : 'No'} / {details?.piercings ? 'Yes' : 'No'}</div>
        </div>

        {details?.categories && details.categories.length > 0 && (
          <div className="pt-2">
            <span className="font-semibold text-sm">Categories: </span>
            <span className="text-sm capitalize">{details.categories.join(', ')}</span>
          </div>
        )}

        {details?.bio && (
          <div className="pt-2">
            <h3 className="font-semibold text-sm">Bio</h3>
            <p className="text-sm text-gray-700 mt-1">{details.bio}</p>
          </div>
        )}
      </div>

      {/* Rate Card */}
      <div className="border p-4 rounded space-y-2 bg-white">
        <h2 className="text-lg font-bold">Rate Card</h2>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-xs text-gray-500">Hourly Rate</p>
            <p className="font-semibold">{rates?.currency || '$'} {rates?.hourly_rate || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Half-Day Rate (4h)</p>
            <p className="font-semibold">{rates?.currency || '$'} {rates?.half_day_rate || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Full-Day Rate (8h)</p>
            <p className="font-semibold">{rates?.currency || '$'} {rates?.full_day_rate || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Availability Calendar */}
      <div className="border p-4 rounded space-y-2 bg-white">
        <h2 className="text-lg font-bold">Availability Dates</h2>
        {(!availability || availability.length === 0) ? (
          <p className="text-sm text-gray-500">No custom date exceptions marked.</p>
        ) : (
          <ul className="space-y-1 text-sm max-h-40 overflow-y-auto">
            {availability.map((item: any) => (
              <li key={item.id} className="flex justify-between border-b py-1">
                <span>{item.date}</span>
                <span className={item.is_available ? 'text-green-700 font-semibold' : 'text-red-600 font-semibold'}>
                  {item.is_available ? 'Available' : 'Unavailable'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Review Submission Form (Only if client has a completed booking) */}
      {completedBookingForReview && (
        <ReviewForm
          bookingId={completedBookingForReview.id}
          revieweeId={modelId}
          revieweeName={modelProfile.full_name}
        />
      )}

      {/* Reviews List */}
      <ReviewsList reviews={formattedReviews} />
    </main>
  );
}
