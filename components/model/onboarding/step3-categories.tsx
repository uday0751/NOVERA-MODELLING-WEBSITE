'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  step3CategoriesSchema,
  Step3CategoriesInput,
  CATEGORY_OPTIONS,
} from '@/lib/validations/onboarding';
import { saveStep3Action } from '@/app/(model)/model/actions';

interface Step3Props {
  defaultValues?: Partial<Step3CategoriesInput>;
  onNext: () => void;
  onPrev: () => void;
}

export function Step3Categories({ defaultValues, onNext, onPrev }: Step3Props) {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Step3CategoriesInput>({
    resolver: zodResolver(step3CategoriesSchema),
    defaultValues: {
      categories: defaultValues?.categories || [],
      languages: defaultValues?.languages || ['English'],
    },
  });

  const onSubmit = async (data: Step3CategoriesInput) => {
    setError(null);
    const res = await saveStep3Action(data);
    if (res?.error) {
      setError(res.error);
    } else {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-xl font-bold">Step 3: Modeling Categories & Languages</h2>

      {error && <div className="p-2 border border-red-500 text-red-700 rounded">{error}</div>}

      <div>
        <label className="block font-medium mb-2">Modeling Categories (Select all that apply)</label>
        <div className="grid grid-cols-2 gap-2 border p-3 rounded">
          {CATEGORY_OPTIONS.map((cat) => (
            <label key={cat} className="flex items-center space-x-2 capitalize">
              <input
                type="checkbox"
                value={cat}
                {...register('categories')}
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
        {errors.categories && (
          <p className="text-red-500 text-sm mt-1">{errors.categories.message}</p>
        )}
      </div>

      <div>
        <label className="block font-medium mb-2">Languages Spoken</label>
        <div className="grid grid-cols-2 gap-2 border p-3 rounded">
          {['English', 'Spanish', 'French', 'German', 'Italian', 'Mandarin', 'Japanese', 'Arabic'].map((lang) => (
            <label key={lang} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={lang}
                {...register('languages')}
              />
              <span>{lang}</span>
            </label>
          ))}
        </div>
        {errors.languages && (
          <p className="text-red-500 text-sm mt-1">{errors.languages.message}</p>
        )}
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
