'use client';

import { useState, useTransition } from 'react';
import { toggleShortlistAction } from '@/app/(client)/client/actions';

interface ShortlistButtonProps {
  modelId: string;
  initialIsShortlisted: boolean;
}

export function ShortlistButton({ modelId, initialIsShortlisted }: ShortlistButtonProps) {
  const [isShortlisted, setIsShortlisted] = useState(initialIsShortlisted);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      const res = await toggleShortlistAction(modelId);
      if (res && typeof res.isShortlisted === 'boolean') {
        setIsShortlisted(res.isShortlisted);
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`border px-4 py-2 text-sm rounded ${
        isShortlisted ? 'bg-red-600 text-white border-red-600' : 'bg-white text-black hover:bg-gray-50'
      } disabled:opacity-50`}
    >
      {isPending
        ? 'Updating...'
        : isShortlisted
        ? '❤️ Saved to Shortlist'
        : '🤍 Save to Shortlist'}
    </button>
  );
}
