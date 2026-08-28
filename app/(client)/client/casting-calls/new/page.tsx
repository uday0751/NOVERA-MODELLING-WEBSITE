'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCastingCallSchema, CreateCastingCallInput } from '@/lib/validations/casting';
import { createCastingCallAction } from '@/app/casting-calls/actions';

export default function NewCastingCallPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateCastingCallInput>({
    resolver: zodResolver(createCastingCallSchema),
    defaultValues: {
      category: 'fashion',
    },
  });

  const onSubmit = async (data: CreateCastingCallInput) => {
    setServerError(null);
    const res = await createCastingCallAction(data);

    if (res?.error) {
      setServerError(res.error);
    } else {
      router.push('/client/dashboard');
    }
  };

  return (
    <main className="p-6 max-w-2xl mx-auto space-y-6 text-black">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">Post a New Casting Call</h1>
          <p className="text-sm text-gray-600">Broadcast project notices to professional models across the agency network.</p>
        </div>
        <Link href="/client/dashboard" className="border px-3 py-1.5 text-xs rounded bg-black text-white font-bold">
          &larr; Back to Dashboard
        </Link>
      </div>

      {serverError && (
        <div className="p-3 border border-red-500 bg-red-50 text-red-700 text-xs rounded font-semibold">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border p-6 rounded bg-white shadow-xs text-sm">
        <div>
          <label htmlFor="title" className="block text-xs font-bold mb-1">
            Casting Call Title *
          </label>
          <input
            id="title"
            type="text"
            placeholder="e.g. Summer Runway Campaign 2026"
            className="w-full border p-2 rounded text-sm"
            {...register('title')}
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-xs font-bold mb-1">
              Talent Category *
            </label>
            <select id="category" className="w-full border p-2 rounded text-sm" {...register('category')}>
              <option value="fashion">Fashion / High Fashion</option>
              <option value="commercial">Commercial</option>
              <option value="fitness">Fitness</option>
              <option value="plus-size">Plus-Size</option>
              <option value="runway">Runway</option>
              <option value="promotional">Promotional</option>
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
          </div>

          <div>
            <label htmlFor="budget" className="block text-xs font-bold mb-1">
              Project Budget (USD $) *
            </label>
            <input
              id="budget"
              type="number"
              placeholder="e.g. 1500"
              className="w-full border p-2 rounded text-sm"
              {...register('budget', { valueAsNumber: true })}
            />
            {errors.budget && <p className="text-red-500 text-xs mt-1">{errors.budget.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="location" className="block text-xs font-bold mb-1">
              Shoot Location *
            </label>
            <input
              id="location"
              type="text"
              placeholder="e.g. Los Angeles, CA / Studio B"
              className="w-full border p-2 rounded text-sm"
              {...register('location')}
            />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
          </div>

          <div>
            <label htmlFor="date" className="block text-xs font-bold mb-1">
              Shoot Date *
            </label>
            <input
              id="date"
              type="date"
              className="w-full border p-2 rounded text-sm"
              {...register('date')}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-xs font-bold mb-1">
            Project Description & Requirements *
          </label>
          <textarea
            id="description"
            rows={5}
            placeholder="Describe shoot scope, wardrobe guidelines, usage rights, and specific model requirements..."
            className="w-full border p-2 rounded text-sm"
            {...register('description')}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full border bg-black text-white py-2.5 rounded text-xs font-bold uppercase tracking-wider hover:bg-gray-800 disabled:opacity-50"
        >
          {isSubmitting ? 'Posting Casting Call...' : 'Publish Casting Call'}
        </button>
      </form>
    </main>
  );
}
