import Link from 'next/link';
import { TrustBadges } from '@/components/trust-badges';

interface ModelCardProps {
  id: string;
  name: string;
  photoUrl?: string | null;
  categories?: string[];
  startingRate?: number | null;
  currency?: string;
  location?: string | null;
  status?: string;
  averageRating?: number | null;
  reviewCount?: number;
  completedBookingsCount?: number;
  stripeOnboardingCompleted?: boolean;
}

export function ModelCard({
  id,
  name,
  photoUrl,
  categories = [],
  startingRate,
  currency = 'USD',
  location,
  status,
  averageRating,
  reviewCount = 0,
  completedBookingsCount,
  stripeOnboardingCompleted,
}: ModelCardProps) {
  return (
    <div className="border p-4 rounded space-y-3 bg-white text-black flex flex-col justify-between shadow-xs">
      <div className="space-y-2">
        <div className="w-full h-48 bg-gray-100 rounded overflow-hidden flex items-center justify-center border relative">
          {photoUrl ? (
            <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs text-gray-400">No Photo</span>
          )}
        </div>

        {/* Trust Badges */}
        <TrustBadges
          status={status}
          completedBookingsCount={completedBookingsCount}
          stripeOnboardingCompleted={stripeOnboardingCompleted}
        />

        <div>
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-base">{name}</h3>
            {typeof averageRating === 'number' && averageRating > 0 && (
              <span className="text-xs font-bold text-amber-600">
                ★ {averageRating.toFixed(1)} ({reviewCount})
              </span>
            )}
          </div>
          {location && <p className="text-xs text-gray-500">{location}</p>}
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {categories.map((c) => (
              <span key={c} className="text-[10px] border px-1.5 py-0.5 rounded capitalize bg-gray-50">
                {c}
              </span>
            ))}
          </div>
        )}

        {startingRate && (
          <p className="text-xs font-semibold">
            From {currency === 'USD' ? '$' : currency} {startingRate} / hr
          </p>
        )}
      </div>

      <Link
        href={`/client/models/${id}`}
        className="w-full border text-center py-1.5 text-xs font-bold uppercase rounded bg-black text-white block mt-2 hover:bg-gray-800"
      >
        View Full Profile
      </Link>
    </div>
  );
}
