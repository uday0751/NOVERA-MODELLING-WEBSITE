'use client';

import { useState } from 'react';
import {
  createIdentityVerificationSessionAction,
  syncIdentityVerificationStatusAction,
} from '@/app/identity/actions';

interface IdentityVerificationCardProps {
  isVerified: boolean;
  verifiedAt?: string | null;
  role: 'model' | 'client';
}

export function IdentityVerificationCard({
  isVerified,
  verifiedAt,
  role,
}: IdentityVerificationCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartVerification = async () => {
    setLoading(true);
    setError(null);
    const res = await createIdentityVerificationSessionAction();
    setLoading(false);

    if (res?.error) {
      setError(res.error);
    } else if (res?.url) {
      window.location.href = res.url;
    }
  };

  const handleSyncStatus = async () => {
    setLoading(true);
    await syncIdentityVerificationStatusAction();
    setLoading(false);
  };

  return (
    <div className="border p-4 rounded bg-white text-black space-y-3 shadow-xs">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-base">Government Identity Verification</h3>
          <p className="text-xs text-gray-600">
            {role === 'model'
              ? 'Models must verify their identity before appearing in public search results or accepting paid bookings.'
              : 'Verified clients display a trust badge to models when submitting booking requests.'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {isVerified ? (
            <span className="border border-green-500 bg-green-50 text-green-700 px-3 py-1 text-xs font-bold rounded">
              ✓ Identity Verified
            </span>
          ) : (
            <button
              onClick={handleStartVerification}
              disabled={loading}
              className="border bg-black text-white px-3.5 py-1.5 text-xs font-bold rounded hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? 'Starting...' : 'Verify ID with Stripe'}
            </button>
          )}

          <button
            onClick={handleSyncStatus}
            disabled={loading}
            className="border px-2.5 py-1.5 text-xs font-medium rounded bg-gray-50 hover:bg-gray-100"
            title="Refresh status from Stripe Identity"
          >
            🔄 Sync
          </button>
        </div>
      </div>

      {isVerified && verifiedAt && (
        <p className="text-[11px] text-gray-500">
          Verified on: {new Date(verifiedAt).toLocaleDateString()}
        </p>
      )}

      {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}
    </div>
  );
}
