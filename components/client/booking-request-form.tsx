'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingRequestSchema, BookingRequestInput } from '@/lib/validations/client';
import { createBookingRequestAction } from '@/app/(client)/client/actions';

interface BookingRequestFormProps {
  modelId: string;
  modelName: string;
}

export function BookingRequestForm({ modelId, modelName }: BookingRequestFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [serverMessage, setServerMessage] = useState<{ error?: string; success?: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingRequestInput>({
    resolver: zodResolver(bookingRequestSchema),
  });

  const onSubmit = async (data: BookingRequestInput) => {
    setServerMessage(null);
    const res = await createBookingRequestAction(modelId, data);
    if (res?.error) {
      setServerMessage({ error: res.error });
    } else {
      setServerMessage({ success: `Booking request sent to ${modelName}!` });
      reset();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="border bg-black text-white px-4 py-2 text-sm rounded"
      >
        Request Booking with {modelName}
      </button>
    );
  }

  return (
    <div className="border p-4 rounded bg-gray-50 space-y-4 text-sm">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="font-bold text-base">Request Booking with {modelName}</h3>
        <button onClick={() => setIsOpen(false)} className="text-xs border px-2 py-1 rounded bg-white">
          Close Form
        </button>
      </div>

      {serverMessage?.error && (
        <div className="p-2 border border-red-500 text-red-700 rounded">{serverMessage.error}</div>
      )}

      {serverMessage?.success && (
        <div className="p-2 border border-green-500 text-green-700 rounded">{serverMessage.success}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label htmlFor="date" className="block font-medium text-xs mb-1">Booking Date</label>
          <input id="date" type="date" className="w-full border p-2 rounded bg-white" {...register('date')} />
          {errors.date && <p className="text-red-500 text-xs mt-0.5">{errors.date.message}</p>}
        </div>

        <div>
          <label htmlFor="location" className="block font-medium text-xs mb-1">Location</label>
          <input id="location" type="text" placeholder="e.g. Studio A, Los Angeles" className="w-full border p-2 rounded bg-white" {...register('location')} />
          {errors.location && <p className="text-red-500 text-xs mt-0.5">{errors.location.message}</p>}
        </div>

        <div>
          <label htmlFor="projectType" className="block font-medium text-xs mb-1">Project Type</label>
          <input id="projectType" type="text" placeholder="e.g. Fashion Lookbook" className="w-full border p-2 rounded bg-white" {...register('projectType')} />
          {errors.projectType && <p className="text-red-500 text-xs mt-0.5">{errors.projectType.message}</p>}
        </div>

        <div>
          <label htmlFor="budget" className="block font-medium text-xs mb-1">Budget ($)</label>
          <input id="budget" type="number" step="0.01" placeholder="e.g. 500" className="w-full border p-2 rounded bg-white" {...register('budget', { valueAsNumber: true })} />
          {errors.budget && <p className="text-red-500 text-xs mt-0.5">{errors.budget.message}</p>}
        </div>

        <div>
          <label htmlFor="usageRights" className="block font-medium text-xs mb-1">Usage Rights</label>
          <input id="usageRights" type="text" placeholder="e.g. Social Media & Website, 6 months" className="w-full border p-2 rounded bg-white" {...register('usageRights')} />
          {errors.usageRights && <p className="text-red-500 text-xs mt-0.5">{errors.usageRights.message}</p>}
        </div>

        <div>
          <label htmlFor="brief" className="block font-medium text-xs mb-1">Project Brief & Details</label>
          <textarea id="brief" rows={3} placeholder="Describe the shoot concept, schedule, and expectations..." className="w-full border p-2 rounded bg-white" {...register('brief')} />
          {errors.brief && <p className="text-red-500 text-xs mt-0.5">{errors.brief.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full border bg-black text-white py-2 rounded text-sm disabled:opacity-50"
        >
          {isSubmitting ? 'Sending Request...' : 'Submit Booking Request'}
        </button>
      </form>
    </div>
  );
}
