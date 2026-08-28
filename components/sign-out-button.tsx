'use client';

import { useTransition } from 'react';
import { signOutAction } from '@/app/(auth)/actions';

export function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        startTransition(async () => {
          await signOutAction();
        });
      }}
      disabled={isPending}
      className="border px-4 py-2 rounded text-sm hover:bg-gray-100 disabled:opacity-50"
    >
      {isPending ? 'Signing out...' : 'Sign Out'}
    </button>
  );
}
