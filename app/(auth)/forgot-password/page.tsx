'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { forgotPasswordSchema, ForgotPasswordInput } from '@/lib/validations/auth';
import { forgotPasswordAction } from '@/app/(auth)/actions';

export default function ForgotPasswordPage() {
  const [serverMessage, setServerMessage] = useState<{ error?: string; success?: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setServerMessage(null);
    const res = await forgotPasswordAction(data);
    if (res) {
      setServerMessage(res);
    }
  };

  return (
    <main className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
      <p className="mb-4 text-sm text-gray-600">
        Enter your email address and we will send you a link to reset your password.
      </p>

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
          <label htmlFor="email" className="block font-medium">Email Address</label>
          <input
            id="email"
            type="email"
            className="w-full border p-2 rounded"
            {...register('email')}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full border bg-black text-white p-2 rounded disabled:opacity-50"
        >
          {isSubmitting ? 'Sending Link...' : 'Send Reset Link'}
        </button>
      </form>

      <p className="mt-4 text-sm">
        Remembered your password? <Link href="/login" className="underline">Back to Sign In</Link>
      </p>
    </main>
  );
}
