'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createReviewSchema, CreateReviewInput } from '@/lib/validations/review';
import { submitReviewAction } from '@/app/reviews/actions';

interface ReviewFormProps {
  bookingId: string;
  revieweeId: string;
  revieweeName: string;
}

export function ReviewForm({ bookingId, revieweeId, revieweeName }: ReviewFormProps) {
  const [serverMsg, setServerMsg] = useState<{ error?: string; success?: string } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateReviewInput>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      bookingId,
      revieweeId,
      rating: 5,
      comment: '',
    },
  });

  const selectedRating = watch('rating');

  const onSubmit = async (data: CreateReviewInput) => {
    setServerMsg(null);
    const res = await submitReviewAction(data);

    if (res?.error) {
      setServerMsg({ error: res.error });
    } else if (res?.success) {
      setServerMsg({ success: res.success });
      reset();
    }
  };

  return (
    <div className="border p-4 rounded bg-white text-black space-y-3 shadow-xs">
      <h3 className="font-bold text-sm">Leave a Review for {revieweeName}</h3>

      {serverMsg?.error && (
        <div className="p-2 border border-red-500 bg-red-50 text-red-700 text-xs rounded font-semibold">
          {serverMsg.error}
        </div>
      )}

      {serverMsg?.success && (
        <div className="p-2 border border-green-500 bg-green-50 text-green-700 text-xs rounded font-semibold">
          {serverMsg.success}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 text-xs">
        <div>
          <label className="block font-semibold mb-1">Star Rating (1 - 5) *</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setValue('rating', star)}
                className={`w-8 h-8 rounded border font-bold text-sm ${
                  star <= selectedRating ? 'bg-amber-400 text-black border-amber-500' : 'bg-gray-100 text-gray-400'
                }`}
              >
                ★ {star}
              </button>
            ))}
          </div>
          {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating.message}</p>}
        </div>

        <div>
          <label htmlFor="comment" className="block font-semibold mb-1">
            Review Comment *
          </label>
          <textarea
            id="comment"
            rows={3}
            placeholder="Share your experience working together..."
            className="w-full border p-2 rounded text-xs"
            {...register('comment')}
          />
          {errors.comment && <p className="text-red-500 text-xs mt-1">{errors.comment.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="border bg-black text-white px-4 py-2 text-xs font-bold uppercase rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}
