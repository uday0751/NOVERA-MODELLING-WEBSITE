interface TrustBadgesProps {
  status?: string;
  isClientVerified?: boolean;
  completedBookingsCount?: number;
  stripeOnboardingCompleted?: boolean;
  className?: string;
}

export function TrustBadges({
  status,
  isClientVerified,
  completedBookingsCount,
  stripeOnboardingCompleted,
  className = 'flex flex-wrap gap-1.5 text-[10px] font-bold uppercase',
}: TrustBadgesProps) {
  const isApproved = status === 'approved';
  const isNew = typeof completedBookingsCount === 'number' && completedBookingsCount < 3;

  return (
    <div className={className}>
      {/* 1. Verified Badge */}
      {(isApproved || isClientVerified) && (
        <span className="border border-blue-500 bg-blue-50 text-blue-700 px-2 py-0.5 rounded tracking-wide">
          ✓ Verified
        </span>
      )}

      {/* 2. New Talent Badge (< 3 completed bookings) */}
      {isNew && (
        <span className="border border-purple-500 bg-purple-50 text-purple-700 px-2 py-0.5 rounded tracking-wide">
          ★ New Talent
        </span>
      )}

      {/* 3. Stripe Ready Badge */}
      {stripeOnboardingCompleted && (
        <span className="border border-green-500 bg-green-50 text-green-700 px-2 py-0.5 rounded tracking-wide">
          💳 Stripe Ready
        </span>
      )}
    </div>
  );
}
