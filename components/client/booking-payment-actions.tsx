'use client';

import { useState } from 'react';
import {
  createBookingCheckoutSessionAction,
  completeBookingAndReleasePayoutAction,
} from '@/app/payments/actions';

interface BookingPaymentActionsProps {
  bookingId: string;
  status: string;
  paymentHeld: boolean;
}

export function BookingPaymentActions({
  bookingId,
  status,
  paymentHeld,
}: BookingPaymentActionsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayNow = async () => {
    setLoading(true);
    setError(null);
    const res = await createBookingCheckoutSessionAction({ bookingId });
    setLoading(false);

    if (res?.error) {
      setError(res.error);
    } else if (res?.url) {
      window.location.href = res.url;
    }
  };

  const handleCompleteBooking = async () => {
    if (!confirm('Are you sure you want to mark this booking as completed and release payment payouts to the model?')) {
      return;
    }

    setLoading(true);
    setError(null);
    const res = await completeBookingAndReleasePayoutAction({ bookingId });
    setLoading(false);

    if (res?.error) {
      setError(res.error);
    }
  };

  return (
    <div className="space-y-1">
      {status === 'accepted' && !paymentHeld && (
        <button
          onClick={handlePayNow}
          disabled={loading}
          className="border bg-green-600 text-white px-3 py-1 text-xs font-bold rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : '💳 Pay Now (Hold Funds)'}
        </button>
      )}

      {status === 'accepted' && paymentHeld && (
        <button
          onClick={handleCompleteBooking}
          disabled={loading}
          className="border bg-blue-600 text-white px-3 py-1 text-xs font-bold rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Releasing Payout...' : '🏆 Mark Completed & Release Payout'}
        </button>
      )}

      {error && <p className="text-[11px] text-red-600 font-semibold">{error}</p>}
    </div>
  );
}
