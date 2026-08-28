'use client';

import { useState } from 'react';
import { toggleClientVerificationAction } from '@/app/admin/actions';

interface ClientVerificationButtonProps {
  clientId: string;
  isVerified: boolean;
}

export function ClientVerificationButton({ clientId, isVerified }: ClientVerificationButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    await toggleClientVerificationAction({
      clientId,
      verified: !isVerified,
    });
    setLoading(false);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`border px-3 py-1 text-xs rounded font-bold transition-colors ${
        isVerified
          ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      } disabled:opacity-50`}
    >
      {loading ? 'Updating...' : isVerified ? 'Revoke Verified Badge' : '✓ Mark as Verified Client'}
    </button>
  );
}
