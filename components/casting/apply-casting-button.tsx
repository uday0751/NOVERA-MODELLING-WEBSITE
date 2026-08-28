'use client';

import { useState } from 'react';
import { applyToCastingCallAction } from '@/app/casting-calls/actions';

interface ApplyCastingButtonProps {
  castingCallId: string;
  hasApplied: boolean;
  isModel: boolean;
}

export function ApplyCastingButton({ castingCallId, hasApplied, isModel }: ApplyCastingButtonProps) {
  const [applied, setApplied] = useState(hasApplied);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isModel) {
    return null;
  }

  if (applied) {
    return (
      <span className="border border-green-500 bg-green-50 text-green-700 px-3 py-1 text-xs font-bold rounded">
        ✓ Applied
      </span>
    );
  }

  const handleApply = async () => {
    setLoading(true);
    setErrorMsg(null);
    const res = await applyToCastingCallAction({ castingCallId });
    setLoading(false);

    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      setApplied(true);
    }
  };

  return (
    <div className="space-y-1">
      <button
        onClick={handleApply}
        disabled={loading}
        className="border bg-black text-white px-4 py-1.5 text-xs font-bold uppercase rounded hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? 'Applying...' : 'Apply with 1-Click'}
      </button>
      {errorMsg && <p className="text-[11px] text-red-600 font-semibold">{errorMsg}</p>}
    </div>
  );
}
