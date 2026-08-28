'use client';

import { useState } from 'react';
import { updateCastingApplicationStatusAction } from '@/app/casting-calls/actions';

interface ApplicantActionButtonsProps {
  applicationId: string;
  currentStatus: string;
}

export function ApplicantActionButtons({ applicationId, currentStatus }: ApplicantActionButtonsProps) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleUpdate = async (status: 'shortlisted' | 'accepted' | 'rejected') => {
    setLoading(true);
    setMsg(null);
    const res = await updateCastingApplicationStatusAction({
      applicationId,
      status,
    });
    setLoading(false);

    if (res?.error) {
      setMsg(res.error);
    } else if (res?.success) {
      setMsg(res.success);
    }
  };

  return (
    <div className="space-y-1">
      <div className="flex flex-wrap gap-2">
        {currentStatus !== 'shortlisted' && (
          <button
            onClick={() => handleUpdate('shortlisted')}
            disabled={loading}
            className="border bg-blue-600 text-white px-3 py-1 text-xs rounded font-bold hover:bg-blue-700 disabled:opacity-50"
          >
            Shortlist
          </button>
        )}

        {currentStatus !== 'accepted' && (
          <button
            onClick={() => handleUpdate('accepted')}
            disabled={loading}
            className="border bg-green-700 text-white px-3 py-1 text-xs rounded font-bold hover:bg-green-800 disabled:opacity-50"
          >
            ✓ Accept & Auto-Book
          </button>
        )}

        {currentStatus !== 'rejected' && (
          <button
            onClick={() => handleUpdate('rejected')}
            disabled={loading}
            className="border bg-gray-200 text-black px-3 py-1 text-xs rounded font-bold hover:bg-gray-300 disabled:opacity-50"
          >
            Reject
          </button>
        )}
      </div>

      {msg && <p className="text-[11px] font-bold text-green-700">{msg}</p>}
    </div>
  );
}
