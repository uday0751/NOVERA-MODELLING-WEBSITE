'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { submitReportSchema, SubmitReportInput } from '@/lib/validations/messages';
import { submitReportAction } from '@/app/messages/actions';

interface ReportModalProps {
  bookingId: string;
  reportedUserId: string;
  reportedUserName: string;
}

export function ReportModal({ bookingId, reportedUserId, reportedUserName }: ReportModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [serverMessage, setServerMessage] = useState<{ error?: string; success?: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubmitReportInput>({
    resolver: zodResolver(submitReportSchema),
    defaultValues: {
      bookingId,
      reportedUserId,
    },
  });

  const onSubmit = async (data: SubmitReportInput) => {
    setServerMessage(null);
    const res = await submitReportAction(data);
    if (res?.error) {
      setServerMessage({ error: res.error });
    } else {
      setServerMessage({ success: 'Report submitted successfully.' });
      reset();
      setTimeout(() => {
        setIsOpen(false);
        setServerMessage(null);
      }, 1500);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="border border-red-500 text-red-600 px-3 py-1 text-xs rounded hover:bg-red-50"
      >
        🚩 Report User
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white text-black p-6 rounded-lg max-w-md w-full space-y-4 border">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="font-bold text-base">Report {reportedUserName}</h3>
          <button onClick={() => setIsOpen(false)} className="text-xs border px-2 py-1 rounded">
            Cancel
          </button>
        </div>

        {serverMessage?.error && (
          <div className="p-2 border border-red-500 text-red-700 text-xs rounded">
            {serverMessage.error}
          </div>
        )}

        {serverMessage?.success && (
          <div className="p-2 border border-green-500 text-green-700 text-xs rounded">
            {serverMessage.success}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 text-sm">
          <div>
            <label htmlFor="reason" className="block text-xs font-medium mb-1">
              Reason for Report
            </label>
            <textarea
              id="reason"
              rows={4}
              placeholder="Describe the issue, inappropriate behavior, or breach of contract..."
              className="w-full border p-2 rounded text-sm"
              {...register('reason')}
            />
            {errors.reason && (
              <p className="text-red-500 text-xs mt-1">{errors.reason.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full border bg-red-600 text-white py-2 rounded text-xs font-bold disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting Report...' : 'Submit Report to Agency Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}
