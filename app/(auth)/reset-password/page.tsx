'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { resetPasswordSchema, ResetPasswordInput } from '@/lib/validations/auth';
import { resetPasswordAction } from '@/app/(auth)/actions';

export default function ResetPasswordPage() {
  const [serverMessage, setServerMessage] = useState<{ error?: string; success?: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    setServerMessage(null);
    const res = await resetPasswordAction(data);
    if (res) {
      setServerMessage(res);
    }
  };

  return (
    <main className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>

      {serverMessage?.error && (
        <div className="p-3 mb-4 border border-red-500 text-red-700 rounded">
          {serverMessage.error}
        </div>
      )}

      {serverMessage?.success && (
        <div className="p-3 mb-4 border border-green-500 text-green-700 rounded">
          {serverMessage.success}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="password" className="block font-medium">New Password</label>
          <input
            id="password"
            type="password"
            className="w-full border p-2 rounded"
            {...register('password')}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block font-medium">Confirm New Password</label>
          <input
            id="confirmPassword"
            type="password"
            className="w-full border p-2 rounded"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full border bg-black text-white p-2 rounded disabled:opacity-50"
        >
          {isSubmitting ? 'Updating Password...' : 'Update Password'}
        </button>
      </form>

      <p className="mt-4 text-sm">
        <Link href="/login" className="underline">Back to Sign In</Link>
      </p>
    </main>
  );
}
