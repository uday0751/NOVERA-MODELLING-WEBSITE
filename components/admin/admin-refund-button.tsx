'use client';

import { useState } from 'react';
import { adminRefundPaymentAction } from '@/app/payments/actions';

interface AdminRefundButtonProps {
  bookingId: string;
  paymentStatus?: string;
}

export function AdminRefundButton({ bookingId, paymentStatus }: AdminRefundButtonProps) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  if (paymentStatus !== 'held') {
    return null;
  }

  const handleRefund = async () => {
    if (!confirm('Are you sure you want to issue a full Stripe refund for this booking? This action will cancel the booking.')) {
      return;
    }

    setLoading(true);
    setMsg(null);
    const res = await adminRefundPaymentAction({ bookingId });
    setLoading(false);

    if (res?.error) {
      setMsg(res.error);
    } else {
      setMsg('Refund issued');
    }
  };

  return (
    <div className="space-y-1">
      <button
        onClick={handleRefund}
        disabled={loading}
        className="border bg-red-700 text-white px-3 py-1 text-xs font-bold rounded hover:bg-red-800 disabled:opacity-50"
      >
        {loading ? 'Refunding...' : '💸 Trigger Stripe Refund'}
      </button>

      {msg && <p className="text-[11px] font-bold text-red-600">{msg}</p>}
    </div>
  );
}
