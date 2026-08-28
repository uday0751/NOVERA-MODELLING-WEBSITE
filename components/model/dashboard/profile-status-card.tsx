'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createStripeConnectOnboardingLinkAction, syncStripeConnectStatusAction } from '@/app/payments/actions';

interface ProfileStatusProps {
  profile: any;
  hasDetails: boolean;
  hasMedia: boolean;
  hasRates: boolean;
}

export function ProfileStatusCard({ profile, hasDetails, hasMedia, hasRates }: ProfileStatusProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stepsCompleted = [
    Boolean(profile.phone),
    hasDetails,
    hasMedia,
    hasRates,
  ].filter(Boolean).length;

  const completionPercent = Math.round((stepsCompleted / 4) * 100);
  const isStripeConnected = Boolean(profile.stripe_onboarding_completed);

  const handleConnectStripe = async () => {
    setLoading(true);
    setError(null);
    const res = await createStripeConnectOnboardingLinkAction();
    setLoading(false);

    if (res?.error) {
      setError(res.error);
    } else if (res?.url) {
      window.location.href = res.url;
    }
  };

  const handleSyncStripe = async () => {
    setLoading(true);
    await syncStripeConnectStatusAction();
    setLoading(false);
  };

  return (
    <div className="border p-4 rounded space-y-4 bg-gray-50 text-black">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Profile Status</h2>
          <p className="text-sm text-gray-600">
            Account Status:{' '}
            <span className="font-semibold capitalize text-black">{profile.status}</span>
          </p>
        </div>
        <Link
          href="/model/onboarding"
          className="border px-3 py-1 text-xs rounded bg-white hover:bg-gray-100 font-medium"
        >
          Open Onboarding Wizard
        </Link>
      </div>

      <div>
        <div className="flex justify-between text-xs font-semibold mb-1">
          <span>Profile Completion</span>
          <span>{completionPercent}%</span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
          <div
            className="bg-black h-full transition-all duration-300"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>

      {/* Stripe Connect Payment Onboarding Status */}
      <div className="border p-3 rounded bg-white space-y-2">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-sm">Stripe Connect Payments</h3>
            <p className="text-xs text-gray-600">
              Payment Status:{' '}
              {isStripeConnected ? (
                <span className="font-bold text-green-700">✓ Connected & Ready for Payouts</span>
              ) : (
                <span className="font-bold text-amber-700">⚠️ Not Connected</span>
              )}
            </p>
          </div>

          <div className="flex space-x-2">
            {!isStripeConnected && (
              <button
                onClick={handleConnectStripe}
                disabled={loading}
                className="border bg-black text-white px-3 py-1.5 text-xs font-bold rounded disabled:opacity-50 hover:bg-gray-800"
              >
                {loading ? 'Connecting...' : 'Set Up Stripe Connect'}
              </button>
            )}

            <button
              onClick={handleSyncStripe}
              disabled={loading}
              className="border px-2.5 py-1.5 text-xs font-medium rounded bg-gray-50 hover:bg-gray-100"
              title="Refresh status from Stripe"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-600 font-semibold">{error}</p>
        )}
      </div>
    </div>
  );
}
