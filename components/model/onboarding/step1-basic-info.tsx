'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step1BasicInfoSchema, Step1BasicInfoInput } from '@/lib/validations/onboarding';
import { saveStep1Action } from '@/app/(model)/model/actions';

interface Step1Props {
  defaultValues?: Partial<Step1BasicInfoInput>;
  onNext: () => void;
}

export function Step1BasicInfo({ defaultValues, onNext }: Step1Props) {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Step1BasicInfoInput>({
    resolver: zodResolver(step1BasicInfoSchema),
    defaultValues,
  });

  const onSubmit = async (data: Step1BasicInfoInput) => {
    setError(null);
    const res = await saveStep1Action(data);
    if (res?.error) {
      setError(res.error);
    } else {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-xl font-bold">Step 1: Basic Information</h2>

      {error && <div className="p-2 border border-red-500 text-red-700 rounded">{error}</div>}

      <div>
        <label htmlFor="phone" className="block font-medium">Phone Number</label>
        <input
          id="phone"
          type="tel"
          className="w-full border p-2 rounded"
          {...register('phone')}
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
      </div>

      <div>
        <label htmlFor="dateOfBirth" className="block font-medium">Date of Birth</label>
        <input
          id="dateOfBirth"
          type="date"
          className="w-full border p-2 rounded"
          {...register('dateOfBirth')}
        />
        {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>}
      </div>

      <div>
        <label htmlFor="location" className="block font-medium">City / Location</label>
        <input
          id="location"
          type="text"
          placeholder="e.g. New York, NY"
          className="w-full border p-2 rounded"
          {...register('location')}
        />
        {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="border bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Next Step'}
        </button>
      </div>
    </form>
  );
}
