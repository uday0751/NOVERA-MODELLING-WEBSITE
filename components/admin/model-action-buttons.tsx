'use client';

import { useState } from 'react';
import { updateModelStatusAction } from '@/app/admin/actions';

interface ModelActionButtonsProps {
  profileId: string;
  currentStatus: string;
}

export function ModelActionButtons({ profileId, currentStatus }: ModelActionButtonsProps) {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('');
  const [showRejectBox, setShowRejectBox] = useState(false);

  const handleUpdate = async (status: 'approved' | 'rejected' | 'suspended') => {
    setLoading(true);
    await updateModelStatusAction({ profileId, status, reason });
    setLoading(false);
    setShowRejectBox(false);
    setReason('');
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {currentStatus !== 'approved' && (
          <button
            onClick={() => handleUpdate('approved')}
            disabled={loading}
            className="border bg-green-700 text-white px-3 py-1 text-xs rounded font-bold hover:bg-green-800 disabled:opacity-50"
          >
            Approve Model
          </button>
        )}

        {currentStatus !== 'rejected' && (
          <button
            onClick={() => setShowRejectBox(!showRejectBox)}
            disabled={loading}
            className="border bg-red-600 text-white px-3 py-1 text-xs rounded font-bold hover:bg-red-700 disabled:opacity-50"
          >
            Reject Model
          </button>
        )}

        {currentStatus === 'approved' && (
          <button
            onClick={() => handleUpdate('suspended')}
            disabled={loading}
            className="border bg-amber-600 text-white px-3 py-1 text-xs rounded font-bold hover:bg-amber-700 disabled:opacity-50"
          >
            Suspend Model
          </button>
        )}
      </div>

      {showRejectBox && (
        <div className="space-y-2 border p-2 rounded bg-gray-50">
          <input
            type="text"
            placeholder="Reason for rejection..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border p-1.5 text-xs rounded"
          />
          <button
            onClick={() => handleUpdate('rejected')}
            disabled={loading}
            className="border bg-red-700 text-white px-3 py-1 text-xs rounded font-bold"
          >
            Confirm Rejection
          </button>
        </div>
      )}
    </div>
  );
}
