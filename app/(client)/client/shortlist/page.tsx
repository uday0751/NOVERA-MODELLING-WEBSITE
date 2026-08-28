import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ModelCard } from '@/components/client/model-card';

export default async function ClientShortlistPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!profile) {
    redirect('/login');
  }

  // Fetch shortlisted items with model profiles
  const { data: shortlistEntries } = await supabase
    .from('client_shortlists')
    .select(`
      id,
      model_id,
      created_at,
      profiles:model_id (
        id,
        full_name,
        model_details (
          height,
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
    .order('created_at', { ascending: false });

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

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">My Shortlisted Models</h1>
          <p className="text-sm text-gray-600">Saved model profiles for quick reference and booking.</p>
        </div>
        <Link href="/client/models" className="border px-3 py-1.5 text-xs rounded bg-black text-white">
          Browse More Models
        </Link>
      </div>

      {shortlistedModels.length === 0 ? (
        <div className="border p-8 rounded text-center text-gray-500 space-y-3">
          <p>You haven't saved any models to your shortlist yet.</p>
          <Link href="/client/models" className="inline-block border px-4 py-2 text-xs rounded bg-black text-white">
            Explore Models Gallery
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {shortlistedModels.map((model: any) => (
            <ModelCard
              key={model.id}
              id={model.id}
              name={model.name}
              photoUrl={model.photoUrl}
              categories={model.categories}
              startingRate={model.startingRate}
              currency={model.currency}
            />
          ))}
        </div>
      )}
    </main>
  );
}
