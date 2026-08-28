'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step2PhysicalStatsSchema, Step2PhysicalStatsInput } from '@/lib/validations/onboarding';
import { saveStep2Action } from '@/app/(model)/model/actions';

interface Step2Props {
  defaultValues?: Partial<Step2PhysicalStatsInput>;
  onNext: () => void;
  onPrev: () => void;
}

export function Step2PhysicalStats({ defaultValues, onNext, onPrev }: Step2Props) {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Step2PhysicalStatsInput>({
    resolver: zodResolver(step2PhysicalStatsSchema),
    defaultValues,
  });

  const onSubmit = async (data: Step2PhysicalStatsInput) => {
    setError(null);
    const res = await saveStep2Action(data);
    if (res?.error) {
      setError(res.error);
    } else {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-xl font-bold">Step 2: Physical Measurements & Features</h2>

      {error && <div className="p-2 border border-red-500 text-red-700 rounded">{error}</div>}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="height" className="block font-medium">Height (cm)</label>
          <input
            id="height"
            type="number"
            className="w-full border p-2 rounded"
            {...register('height', { valueAsNumber: true })}
          />
          {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height.message}</p>}
        </div>

        <div>
          <label htmlFor="weight" className="block font-medium">Weight (kg)</label>
          <input
            id="weight"
            type="number"
            className="w-full border p-2 rounded"
            {...register('weight', { valueAsNumber: true })}
          />
          {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>}
        </div>

        <div>
          <label htmlFor="bust" className="block font-medium">Bust / Chest (in)</label>
          <input
            id="bust"
            type="number"
            className="w-full border p-2 rounded"
            {...register('bust', { valueAsNumber: true })}
          />
        </div>

        <div>
          <label htmlFor="waist" className="block font-medium">Waist (in)</label>
          <input
            id="waist"
            type="number"
            className="w-full border p-2 rounded"
            {...register('waist', { valueAsNumber: true })}
          />
        </div>

        <div>
          <label htmlFor="hips" className="block font-medium">Hips (in)</label>
          <input
            id="hips"
            type="number"
            className="w-full border p-2 rounded"
            {...register('hips', { valueAsNumber: true })}
          />
        </div>

        <div>
          <label htmlFor="shoeSize" className="block font-medium">Shoe Size</label>
          <input
            id="shoeSize"
            type="number"
            step="0.5"
            className="w-full border p-2 rounded"
            {...register('shoeSize', { valueAsNumber: true })}
          />
          {errors.shoeSize && <p className="text-red-500 text-sm mt-1">{errors.shoeSize.message}</p>}
        </div>

        <div>
          <label htmlFor="hairColor" className="block font-medium">Hair Color</label>
          <input
            id="hairColor"
            type="text"
            className="w-full border p-2 rounded"
            {...register('hairColor')}
          />
          {errors.hairColor && <p className="text-red-500 text-sm mt-1">{errors.hairColor.message}</p>}
        </div>

        <div>
          <label htmlFor="eyeColor" className="block font-medium">Eye Color</label>
          <input
            id="eyeColor"
            type="text"
            className="w-full border p-2 rounded"
            {...register('eyeColor')}
          />
          {errors.eyeColor && <p className="text-red-500 text-sm mt-1">{errors.eyeColor.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="ethnicity" className="block font-medium">Ethnicity</label>
        <input
          id="ethnicity"
          type="text"
          className="w-full border p-2 rounded"
          {...register('ethnicity')}
        />
        {errors.ethnicity && <p className="text-red-500 text-sm mt-1">{errors.ethnicity.message}</p>}
      </div>

      <div className="flex space-x-4">
        <label className="flex items-center space-x-2">
          <input type="checkbox" {...register('tattoos')} />
          <span>Has Tattoos</span>
        </label>

        <label className="flex items-center space-x-2">
          <input type="checkbox" {...register('piercings')} />
          <span>Has Piercings</span>
        </label>
      </div>

      <div>
        <label htmlFor="bio" className="block font-medium">Short Bio</label>
        <textarea
          id="bio"
          rows={3}
          className="w-full border p-2 rounded"
          {...register('bio')}
        />
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
          {isSubmitting ? 'Saving...' : 'Next Step'}
        </button>
      </div>
    </form>
  );
}
