'use client';

import { useState } from 'react';
import { resolveReportAction } from '@/app/admin/actions';

interface ReportActionButtonsProps {
  reportId: string;
  reportedUserId: string;
  currentStatus: string;
}

export function ReportActionButtons({
  reportId,
  reportedUserId,
  currentStatus,
}: ReportActionButtonsProps) {
  const [loading, setLoading] = useState(false);

  const handleResolve = async (action: 'dismiss' | 'warn' | 'suspend_user' | 'actioned') => {
    setLoading(true);
    await resolveReportAction({
      reportId,
      action,
      reportedUserId,
    });
    setLoading(false);
  };

  if (currentStatus === 'dismissed' || currentStatus === 'actioned') {
    return (
      <span className="text-xs text-gray-500 font-semibold uppercase">
        Resolved ({currentStatus})
      </span>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleResolve('warn')}
        disabled={loading}
        className="border bg-amber-600 text-white px-3 py-1 text-xs font-bold rounded hover:bg-amber-700 disabled:opacity-50"
      >
        Issue Warning
      </button>

      <button
        onClick={() => handleResolve('suspend_user')}
        disabled={loading}
        className="border bg-red-600 text-white px-3 py-1 text-xs font-bold rounded hover:bg-red-700 disabled:opacity-50"
      >
        Suspend Account
      </button>

      <button
        onClick={() => handleResolve('dismiss')}
        disabled={loading}
        className="border bg-gray-200 text-black px-3 py-1 text-xs font-bold rounded hover:bg-gray-300 disabled:opacity-50"
      >
        Dismiss Report
      </button>
    </div>
  );
}
