import { createClient } from '@/lib/supabase/server';
import { ModelSearchFilters } from '@/components/client/model-search-filters';
import { ModelCard } from '@/components/client/model-card';

interface ModelsPageProps {
  searchParams: Promise<{
    category?: string;
    location?: string;
    minHeight?: string;
    maxHeight?: string;
    maxRate?: string;
    availableDate?: string;
  }>;
}

export default async function ClientModelsPage({ searchParams }: ModelsPageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  // Query approved models with details, media, rates, reviews, and completed bookings
  let query = supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      phone,
      status,
      stripe_onboarding_completed,
      model_details (
        height,
        weight,
        categories,
        languages,
        hair_color,
        eye_color
      ),
      model_media (
        url,
        category
      ),
      model_rates (
        hourly_rate,
        currency
      ),
      reviews:reviews!reviewee_id (
        rating
      ),
      bookings:bookings!model_id (
        id,
        status
      )
    `)
    .eq('role', 'model')
    .eq('status', 'approved');

  const { data: rawModels, error } = await query;

  if (error) {
    console.error('Error querying models:', error);
  }

  // Perform in-memory filtering for demo flexibility
  let models = (rawModels || []).map((m: any) => {
    const details = Array.isArray(m.model_details) ? m.model_details[0] : m.model_details;
    const rates = Array.isArray(m.model_rates) ? m.model_rates[0] : m.model_rates;
    const media = m.model_media || [];
    const headshot = media.find((item: any) => item.category === 'headshot')?.url || media[0]?.url || null;

    const reviews = m.reviews || [];
    const reviewCount = reviews.length;
    const avgRating =
      reviewCount > 0
        ? reviews.reduce((acc: number, r: any) => acc + (r.rating || 5), 0) / reviewCount
        : null;

    const bookings = m.bookings || [];
    const completedCount = bookings.filter((b: any) => b.status === 'completed').length;

    return {
      id: m.id,
      name: m.full_name,
      location: m.phone ? 'Available' : 'Remote',
      height: details?.height || null,
      categories: details?.categories || [],
      startingRate: rates?.hourly_rate || null,
      currency: rates?.currency || 'USD',
      photoUrl: headshot,
      status: m.status,
      averageRating: avgRating,
      reviewCount,
      completedBookingsCount: completedCount,
      stripeOnboardingCompleted: Boolean(m.stripe_onboarding_completed),
    };
  });

  // Filter by category
  if (params.category) {
    models = models.filter((m) =>
      m.categories.some((c: string) => c.toLowerCase() === params.category?.toLowerCase())
    );
  }

  // Filter by location
  if (params.location) {
    const locLower = params.location.toLowerCase();
    models = models.filter((m) => m.location?.toLowerCase().includes(locLower));
  }

  // Filter by height range
  if (params.minHeight) {
    const minH = parseFloat(params.minHeight);
    models = models.filter((m) => m.height && m.height >= minH);
  }
  if (params.maxHeight) {
    const maxH = parseFloat(params.maxHeight);
    models = models.filter((m) => m.height && m.height <= maxH);
  }

  // Filter by max rate
  if (params.maxRate) {
    const maxR = parseFloat(params.maxRate);
    models = models.filter((m) => m.startingRate && m.startingRate <= maxR);
  }

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-6 text-black">
      <div>
        <h1 className="text-2xl font-bold">Browse Models</h1>
        <p className="text-sm text-gray-600">Discover and hire approved professional models for your projects.</p>
      </div>

      <ModelSearchFilters />

      <div>
        <h2 className="text-sm font-semibold mb-3">
          Showing {models.length} {models.length === 1 ? 'model' : 'models'}
        </h2>

        {models.length === 0 ? (
          <div className="border p-8 rounded text-center text-gray-500">
            No models match your selected filter criteria. Try expanding your search parameters.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {models.map((model) => (
              <ModelCard
                key={model.id}
                id={model.id}
                name={model.name}
                photoUrl={model.photoUrl}
                categories={model.categories}
                startingRate={model.startingRate}
                currency={model.currency}
                location={model.location}
                status={model.status}
                averageRating={model.averageRating}
                reviewCount={model.reviewCount}
                completedBookingsCount={model.completedBookingsCount}
                stripeOnboardingCompleted={model.stripeOnboardingCompleted}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
