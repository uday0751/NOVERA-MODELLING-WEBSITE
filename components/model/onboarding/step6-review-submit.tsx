'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitOnboardingAction } from '@/app/(model)/model/actions';

interface ReviewData {
  basicInfo?: any;
  physicalStats?: any;
  categories?: any;
  mediaCount?: number;
  rates?: any;
}

interface Step6Props {
  data: ReviewData;
  onPrev: () => void;
}

export function Step6ReviewSubmit({ data, onPrev }: Step6Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    const res = await submitOnboardingAction();
    setIsSubmitting(false);

    if (res?.error) {
      setError(res.error);
    } else {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="text-center space-y-4 py-8">
        <h2 className="text-2xl font-bold text-green-700">Your profile is under review!</h2>
        <p className="text-gray-600">
          Thank you for completing your model onboarding application. An agency administrator will review your submitted profile details and media.
        </p>
        <p className="text-sm text-gray-500">
          You can check your application status on your account dashboard.
        </p>
        <button
          onClick={() => router.push('/pending-approval')}
          className="border bg-black text-white px-6 py-2 rounded mt-4"
        >
          Go to Pending Status Page
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Step 6: Review & Submit</h2>
      <p className="text-sm text-gray-600">
        Please review your submitted information before final submission.
      </p>

      {error && <div className="p-2 border border-red-500 text-red-700 rounded">{error}</div>}

      <div className="border p-4 rounded space-y-3">
        <div>
          <h3 className="font-semibold text-lg">Basic Information</h3>
          <p className="text-sm">Phone: {data.basicInfo?.phone || 'N/A'}</p>
          <p className="text-sm">Location: {data.basicInfo?.location || 'N/A'}</p>
        </div>

        <hr />

        <div>
          <h3 className="font-semibold text-lg">Physical Stats</h3>
          <p className="text-sm">Height: {data.physicalStats?.height || 'N/A'} cm | Weight: {data.physicalStats?.weight || 'N/A'} kg</p>
          <p className="text-sm">Bust/Waist/Hips: {data.physicalStats?.bust || '-'}/{data.physicalStats?.waist || '-'}/{data.physicalStats?.hips || '-'}</p>
          <p className="text-sm">Hair: {data.physicalStats?.hair_color || 'N/A'} | Eyes: {data.physicalStats?.eye_color || 'N/A'}</p>
        </div>

        <hr />

        <div>
          <h3 className="font-semibold text-lg">Categories</h3>
          <p className="text-sm">
            Categories: {data.categories?.categories?.join(', ') || 'None selected'}
          </p>
          <p className="text-sm">
            Languages: {data.categories?.languages?.join(', ') || 'None selected'}
          </p>
        </div>

        <hr />

        <div>
          <h3 className="font-semibold text-lg">Portfolio Media</h3>
          <p className="text-sm">Total items uploaded: {data.mediaCount || 0}</p>
        </div>

        <hr />

        <div>
          <h3 className="font-semibold text-lg">Rate Card</h3>
          <p className="text-sm">
            Hourly: {data.rates?.currency} {data.rates?.hourly_rate || 'N/A'} | Half-Day: {data.rates?.currency} {data.rates?.half_day_rate || 'N/A'} | Full-Day: {data.rates?.currency} {data.rates?.full_day_rate || 'N/A'}
          </p>
        </div>
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
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="border bg-black text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting Application...' : 'Submit Profile for Review'}
        </button>
      </div>
    </div>
  );
}
