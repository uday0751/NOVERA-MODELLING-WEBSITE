'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step5RatesSchema, Step5RatesInput } from '@/lib/validations/onboarding';
import { saveStep5Action } from '@/app/(model)/model/actions';

interface Step5Props {
  defaultValues?: Partial<Step5RatesInput>;
  onNext: () => void;
  onPrev: () => void;
}

export function Step5Rates({ defaultValues, onNext, onPrev }: Step5Props) {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Step5RatesInput>({
    resolver: zodResolver(step5RatesSchema),
    defaultValues: {
      currency: 'USD',
      ...defaultValues,
    },
  });

  const onSubmit = async (data: Step5RatesInput) => {
    setError(null);
    const res = await saveStep5Action(data);
    if (res?.error) {
      setError(res.error);
    } else {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-xl font-bold">Step 5: Rate Card</h2>

      {error && <div className="p-2 border border-red-500 text-red-700 rounded">{error}</div>}

      <div>
        <label htmlFor="currency" className="block font-medium">Currency</label>
        <select id="currency" className="w-full border p-2 rounded" {...register('currency')}>
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="GBP">GBP (£)</option>
          <option value="CAD">CAD ($)</option>
          <option value="AUD">AUD ($)</option>
        </select>
      </div>

      <div>
        <label htmlFor="hourlyRate" className="block font-medium">Hourly Rate</label>
        <input
          id="hourlyRate"
          type="number"
          step="0.01"
          className="w-full border p-2 rounded"
          {...register('hourlyRate', { valueAsNumber: true })}
        />
        {errors.hourlyRate && <p className="text-red-500 text-sm mt-1">{errors.hourlyRate.message}</p>}
      </div>

      <div>
        <label htmlFor="halfDayRate" className="block font-medium">Half-Day Rate (4 Hours)</label>
        <input
          id="halfDayRate"
          type="number"
          step="0.01"
          className="w-full border p-2 rounded"
          {...register('halfDayRate', { valueAsNumber: true })}
        />
        {errors.halfDayRate && <p className="text-red-500 text-sm mt-1">{errors.halfDayRate.message}</p>}
      </div>

      <div>
        <label htmlFor="fullDayRate" className="block font-medium">Full-Day Rate (8 Hours)</label>
        <input
          id="fullDayRate"
          type="number"
          step="0.01"
          className="w-full border p-2 rounded"
          {...register('fullDayRate', { valueAsNumber: true })}
        />
        {errors.fullDayRate && <p className="text-red-500 text-sm mt-1">{errors.fullDayRate.message}</p>}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="border px-4 py-2 rounded"
        >
          Previous
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="border bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Review Profile'}
        </button>
      </div>
    </form>
  );
}
