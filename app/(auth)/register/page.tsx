'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { registerSchema, RegisterInput } from '@/lib/validations/auth';
import { registerAction } from '@/app/(auth)/actions';

export default function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'model',
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setServerError(null);
    const res = await registerAction(data);
    if (res?.error) {
      setServerError(res.error);
    }
  };

  return (
    <main className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create your Account</h1>

      {serverError && (
        <div className="p-3 mb-4 border border-red-500 text-red-700 rounded">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <fieldset className="border p-3 rounded">
          <legend className="font-medium px-1">Select your account type</legend>
          <div className="space-y-2 mt-1">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="model"
                {...register('role')}
              />
              <span>I want to register as a model</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="client"
                {...register('role')}
              />
              <span>I want to book/hire a model</span>
            </label>
          </div>
          {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
        </fieldset>

        <div>
          <label htmlFor="fullName" className="block font-medium">Full Name</label>
          <input
            id="fullName"
            type="text"
            className="w-full border p-2 rounded"
            {...register('fullName')}
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block font-medium">Email</label>
          <input
            id="email"
            type="email"
            className="w-full border p-2 rounded"
            {...register('email')}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block font-medium">Password</label>
          <input
            id="password"
            type="password"
            className="w-full border p-2 rounded"
            {...register('password')}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block font-medium">Confirm Password</label>
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
          {isSubmitting ? 'Registering...' : 'Sign Up'}
        </button>
      </form>

      <p className="mt-4 text-sm">
        Already have an account? <Link href="/login" className="underline">Sign In</Link>
      </p>
    </main>
  );
}
