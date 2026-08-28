import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { SignOutButton } from '@/components/sign-out-button';
import { ModelCard } from '@/components/client/model-card';
import { BookingPaymentActions } from '@/components/client/booking-payment-actions';

export default async function ClientDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch client profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!profile) {
    redirect('/login');
  }

  // Fetch bookings requested by client with payment status
  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      id,
      status,
      date,
      location,
      project_type,
      budget,
      created_at,
      profiles:model_id (
        full_name
      ),
      payments (
        id,
        status,
        amount
      )
    `)
    .eq('client_id', profile.id)
    .order('created_at', { ascending: false });

  // Fetch shortlisted models
  const { data: shortlistEntries } = await supabase
    .from('client_shortlists')
    .select(`
      id,
      profiles:model_id (
        id,
        full_name,
        model_details (
          categories
        ),
        model_media (
          url,
          category
        ),
        model_rates (
          hourly_rate,
          currency
        )
      )
    `)
    .eq('client_id', profile.id)
    .limit(4);

  const shortlistedModels = (shortlistEntries || []).map((entry: any) => {
    const m = entry.profiles;
    if (!m) return null;
    const details = Array.isArray(m.model_details) ? m.model_details[0] : m.model_details;
    const rates = Array.isArray(m.model_rates) ? m.model_rates[0] : m.model_rates;
    const media = m.model_media || [];
    const headshot = media.find((item: any) => item.category === 'headshot')?.url || media[0]?.url || null;

    return {
      id: m.id,
      name: m.full_name,
      categories: details?.categories || [],
      startingRate: rates?.hourly_rate || null,
      currency: rates?.currency || 'USD',
      photoUrl: headshot,
    };
  }).filter(Boolean);

  // Fetch casting calls posted by client with applications count
  const { data: castingCalls } = await supabase
    .from('casting_calls')
    .select(`
      *,
      casting_applications (
        id
      )
    `)
    .eq('client_id', profile.id)
    .order('created_at', { ascending: false });

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-6 text-black">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">Client Dashboard</h1>
          <p className="text-sm text-gray-600">Welcome, {profile.full_name}</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link href="/client/models" className="border px-3 py-1.5 text-xs rounded bg-black text-white">
            Browse Models
          </Link>
          <Link href="/client/casting-calls/new" className="border px-3 py-1.5 text-xs rounded bg-purple-700 text-white font-bold">
            + Post Casting Call
          </Link>
          <SignOutButton />
        </div>
      </div>

      {/* Booking Requests */}
      <div className="border p-4 rounded space-y-3 bg-white">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">My Booking Requests</h2>
          <span className="text-xs text-gray-500">{bookings?.length || 0} Total</span>
        </div>

        {(!bookings || bookings.length === 0) ? (
          <p className="text-sm text-gray-500">You have not requested any model bookings yet.</p>
        ) : (
          <div className="space-y-3">
            {bookings.map((b: any) => {
              const payment = Array.isArray(b.payments) ? b.payments[0] : b.payments;
              const isPaymentHeld = payment?.status === 'held';
              const isPaymentReleased = payment?.status === 'released';

              return (
                <div key={b.id} className="border p-3 rounded space-y-2 text-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{b.project_type || 'Booking Request'}</p>
                      <p className="text-xs text-gray-600">
                        Model: {b.profiles?.full_name || 'N/A'} | Date: {b.date} | Location: {b.location}
                      </p>
                      {b.budget && <p className="text-xs text-gray-500 font-semibold">Budget: ${b.budget}</p>}
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs font-bold uppercase border rounded capitalize">
                        {b.status}
                      </span>

                      {isPaymentHeld && (
                        <span className="px-2 py-1 text-xs font-bold uppercase border border-blue-500 text-blue-700 bg-blue-50 rounded">
                          Escrow Held
                        </span>
                      )}

                      {isPaymentReleased && (
                        <span className="px-2 py-1 text-xs font-bold uppercase border border-green-500 text-green-700 bg-green-50 rounded">
                          Payout Released
                        </span>
                      )}

                      <Link
                        href={`/messages/${b.id}`}
                        className="border px-2.5 py-1 text-xs rounded bg-black text-white hover:bg-gray-800 font-bold"
                      >
                        💬 Messages
                      </Link>
                    </div>
                  </div>

                  {/* Payment Action Buttons */}
                  <BookingPaymentActions
                    bookingId={b.id}
                    status={b.status}
                    paymentHeld={isPaymentHeld}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Posted Casting Calls */}
      <div className="border p-4 rounded space-y-3 bg-white">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">My Casting Calls</h2>
          <Link href="/client/casting-calls/new" className="text-xs font-bold border px-3 py-1 rounded bg-black text-white">
            + Create New Casting Call
          </Link>
        </div>

        {(!castingCalls || castingCalls.length === 0) ? (
          <p className="text-sm text-gray-500">You haven't posted any casting calls yet.</p>
        ) : (
          <div className="space-y-2">
            {castingCalls.map((call: any) => {
              const appsCount = call.casting_applications?.length || 0;

              return (
                <div key={call.id} className="border p-3 rounded flex justify-between items-center text-sm">
                  <div>
                    <p className="font-semibold">{call.title}</p>
                    <p className="text-xs text-gray-600">
                      Category: {call.category || 'General'} | Location: {call.location || 'Remote'} | Date: {call.date}
                    </p>
                    <p className="text-xs font-semibold text-green-700">Budget: ${call.budget}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/client/casting-calls/${call.id}/applications`}
                      className="border px-3 py-1 text-xs rounded bg-purple-700 text-white font-bold hover:bg-purple-800"
                    >
                      View Applicants ({appsCount})
                    </Link>
                    <span className="px-2 py-1 text-xs font-bold uppercase border rounded capitalize">
                      {call.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Shortlisted Models */}
      <div className="border p-4 rounded space-y-3 bg-white">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Shortlisted Models</h2>
          <Link href="/client/shortlist" className="text-xs underline">
            View All Shortlist ({shortlistedModels.length})
          </Link>
        </div>

        {shortlistedModels.length === 0 ? (
          <p className="text-sm text-gray-500">No models in your shortlist.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {shortlistedModels.map((m: any) => (
              <ModelCard
                key={m.id}
                id={m.id}
                name={m.name}
                photoUrl={m.photoUrl}
                categories={m.categories}
                startingRate={m.startingRate}
                currency={m.currency}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
