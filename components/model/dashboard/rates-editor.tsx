'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step5RatesSchema, Step5RatesInput } from '@/lib/validations/onboarding';
import { saveStep5Action } from '@/app/(model)/model/actions';

interface RatesEditorProps {
  rates: any;
}

export function RatesEditor({ rates }: RatesEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Step5RatesInput>({
    resolver: zodResolver(step5RatesSchema),
    defaultValues: {
      hourlyRate: rates?.hourly_rate || 50,
      halfDayRate: rates?.half_day_rate || 200,
      fullDayRate: rates?.full_day_rate || 350,
      currency: rates?.currency || 'USD',
    },
  });

  const onSubmit = async (data: Step5RatesInput) => {
    setMessage(null);
    const res = await saveStep5Action(data);
    if (res?.error) {
      setMessage(`Error: ${res.error}`);
    } else {
      setMessage('Rate card updated successfully!');
      setIsEditing(false);
    }
  };

  return (
    <div className="border p-4 rounded space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Rate Card</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="border px-3 py-1 text-xs rounded hover:bg-gray-100"
        >
          {isEditing ? 'Cancel' : 'Edit Rates'}
        </button>
      </div>

      {message && <div className="p-2 border text-sm rounded">{message}</div>}

      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label htmlFor="currency" className="block text-sm font-medium">Currency</label>
            <select id="currency" className="w-full border p-2 rounded text-sm" {...register('currency')}>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>

          <div>
            <label htmlFor="hourlyRate" className="block text-sm font-medium">Hourly Rate</label>
            <input id="hourlyRate" type="number" step="0.01" className="w-full border p-2 rounded text-sm" {...register('hourlyRate', { valueAsNumber: true })} />
          </div>

          <div>
            <label htmlFor="halfDayRate" className="block text-sm font-medium">Half-Day Rate</label>
            <input id="halfDayRate" type="number" step="0.01" className="w-full border p-2 rounded text-sm" {...register('halfDayRate', { valueAsNumber: true })} />
          </div>

          <div>
            <label htmlFor="fullDayRate" className="block text-sm font-medium">Full-Day Rate</label>
            <input id="fullDayRate" type="number" step="0.01" className="w-full border p-2 rounded text-sm" {...register('fullDayRate', { valueAsNumber: true })} />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="border bg-black text-white px-4 py-2 text-sm rounded disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Rates'}
          </button>
        </form>
      ) : (
        <div className="space-y-1 text-sm">
          <p><span className="font-semibold">Currency:</span> {rates?.currency || 'USD'}</p>
          <p><span className="font-semibold">Hourly Rate:</span> {rates?.hourly_rate ? `${rates.currency || '$'} ${rates.hourly_rate}` : 'Not set'}</p>
          <p><span className="font-semibold">Half-Day Rate:</span> {rates?.half_day_rate ? `${rates.currency || '$'} ${rates.half_day_rate}` : 'Not set'}</p>
          <p><span className="font-semibold">Full-Day Rate:</span> {rates?.full_day_rate ? `${rates.currency || '$'} ${rates.full_day_rate}` : 'Not set'}</p>
        </div>
      )}
    </div>
  );
}
