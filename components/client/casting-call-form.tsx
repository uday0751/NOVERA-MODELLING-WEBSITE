'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { castingCallSchema, CastingCallInput } from '@/lib/validations/client';
import { createCastingCallAction } from '@/app/(client)/client/actions';

export function CastingCallForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [serverMessage, setServerMessage] = useState<{ error?: string; success?: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CastingCallInput>({
    resolver: zodResolver(castingCallSchema),
  });

  const onSubmit = async (data: CastingCallInput) => {
    setServerMessage(null);
    const res = await createCastingCallAction(data);
    if (res?.error) {
      setServerMessage({ error: res.error });
    } else {
      setServerMessage({ success: 'Casting call posted successfully!' });
      reset();
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="border px-3 py-1.5 text-xs rounded bg-black text-white"
      >
        + Create New Casting Call
      </button>
    );
  }

  return (
    <div className="border p-4 rounded bg-gray-50 space-y-4 text-sm">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="font-bold text-base">Post a New Casting Call</h3>
        <button onClick={() => setIsOpen(false)} className="text-xs border px-2 py-1 rounded bg-white">
          Cancel
        </button>
      </div>

      {serverMessage?.error && (
        <div className="p-2 border border-red-500 text-red-700 rounded">{serverMessage.error}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label htmlFor="title" className="block font-medium text-xs mb-1">Casting Title</label>
          <input id="title" type="text" placeholder="e.g. Summer Campaign Commercial Models Needed" className="w-full border p-2 rounded bg-white" {...register('title')} />
          {errors.title && <p className="text-red-500 text-xs mt-0.5">{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="category" className="block font-medium text-xs mb-1">Category</label>
          <input id="category" type="text" placeholder="e.g. Commercial, Fashion" className="w-full border p-2 rounded bg-white" {...register('category')} />
        </div>

        <div>
          <label htmlFor="location" className="block font-medium text-xs mb-1">Location</label>
          <input id="location" type="text" placeholder="e.g. New York, NY" className="w-full border p-2 rounded bg-white" {...register('location')} />
        </div>

        <div>
          <label htmlFor="budget" className="block font-medium text-xs mb-1">Budget ($)</label>
          <input id="budget" type="number" step="0.01" placeholder="e.g. 1200" className="w-full border p-2 rounded bg-white" {...register('budget', { valueAsNumber: true })} />
        </div>

        <div>
          <label htmlFor="description" className="block font-medium text-xs mb-1">Description</label>
          <textarea id="description" rows={3} placeholder="Provide project details, requirements, shooting dates..." className="w-full border p-2 rounded bg-white" {...register('description')} />
          {errors.description && <p className="text-red-500 text-xs mt-0.5">{errors.description.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full border bg-black text-white py-2 rounded text-sm disabled:opacity-50"
        >
          {isSubmitting ? 'Posting...' : 'Post Casting Call'}
        </button>
      </form>
    </div>
  );
}
