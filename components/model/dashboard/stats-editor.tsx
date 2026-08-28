'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step2PhysicalStatsSchema, Step2PhysicalStatsInput } from '@/lib/validations/onboarding';
import { saveStep2Action } from '@/app/(model)/model/actions';

interface StatsEditorProps {
  details: any;
}

export function StatsEditor({ details }: StatsEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Step2PhysicalStatsInput>({
    resolver: zodResolver(step2PhysicalStatsSchema),
    defaultValues: {
      height: details?.height || 170,
      weight: details?.weight || 60,
      bust: details?.bust || null,
      waist: details?.waist || null,
      hips: details?.hips || null,
      shoeSize: details?.shoe_size || 8,
      hairColor: details?.hair_color || '',
      eyeColor: details?.eye_color || '',
      ethnicity: details?.ethnicity || '',
      tattoos: details?.tattoos || false,
      piercings: details?.piercings || false,
      bio: details?.bio || '',
    },
  });

  const onSubmit = async (data: Step2PhysicalStatsInput) => {
    setMessage(null);
    const res = await saveStep2Action(data);
    if (res?.error) {
      setMessage(`Error: ${res.error}`);
    } else {
      setMessage('Physical stats updated successfully!');
      setIsEditing(false);
    }
  };

  return (
    <div className="border p-4 rounded space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Physical Stats & Features</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="border px-3 py-1 text-xs rounded hover:bg-gray-100"
        >
          {isEditing ? 'Cancel' : 'Edit Stats'}
        </button>
      </div>

      {message && <div className="p-2 border text-sm rounded">{message}</div>}

      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="height" className="block text-sm font-medium">Height (cm)</label>
              <input id="height" type="number" className="w-full border p-2 rounded text-sm" {...register('height', { valueAsNumber: true })} />
            </div>

            <div>
              <label htmlFor="weight" className="block text-sm font-medium">Weight (kg)</label>
              <input id="weight" type="number" className="w-full border p-2 rounded text-sm" {...register('weight', { valueAsNumber: true })} />
            </div>

            <div>
              <label htmlFor="bust" className="block text-sm font-medium">Bust (in)</label>
              <input id="bust" type="number" className="w-full border p-2 rounded text-sm" {...register('bust', { valueAsNumber: true })} />
            </div>

            <div>
              <label htmlFor="waist" className="block text-sm font-medium">Waist (in)</label>
              <input id="waist" type="number" className="w-full border p-2 rounded text-sm" {...register('waist', { valueAsNumber: true })} />
            </div>

            <div>
              <label htmlFor="hips" className="block text-sm font-medium">Hips (in)</label>
              <input id="hips" type="number" className="w-full border p-2 rounded text-sm" {...register('hips', { valueAsNumber: true })} />
            </div>

            <div>
              <label htmlFor="shoeSize" className="block text-sm font-medium">Shoe Size</label>
              <input id="shoeSize" type="number" step="0.5" className="w-full border p-2 rounded text-sm" {...register('shoeSize', { valueAsNumber: true })} />
            </div>

            <div>
              <label htmlFor="hairColor" className="block text-sm font-medium">Hair Color</label>
              <input id="hairColor" type="text" className="w-full border p-2 rounded text-sm" {...register('hairColor')} />
            </div>

            <div>
              <label htmlFor="eyeColor" className="block text-sm font-medium">Eye Color</label>
              <input id="eyeColor" type="text" className="w-full border p-2 rounded text-sm" {...register('eyeColor')} />
            </div>
          </div>

          <div>
            <label htmlFor="ethnicity" className="block text-sm font-medium">Ethnicity</label>
            <input id="ethnicity" type="text" className="w-full border p-2 rounded text-sm" {...register('ethnicity')} />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium">Bio</label>
            <textarea id="bio" rows={2} className="w-full border p-2 rounded text-sm" {...register('bio')} />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="border bg-black text-white px-4 py-2 text-sm rounded disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Stats'}
          </button>
        </form>
      ) : (
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p><span className="font-semibold">Height:</span> {details?.height ? `${details.height} cm` : 'Not set'}</p>
          <p><span className="font-semibold">Weight:</span> {details?.weight ? `${details.weight} kg` : 'Not set'}</p>
          <p><span className="font-semibold">Bust/Waist/Hips:</span> {details?.bust || '-'}/{details?.waist || '-'}/{details?.hips || '-'}</p>
          <p><span className="font-semibold">Shoe Size:</span> {details?.shoe_size || 'Not set'}</p>
          <p><span className="font-semibold">Hair / Eyes:</span> {details?.hair_color || '-'} / {details?.eye_color || '-'}</p>
          <p><span className="font-semibold">Ethnicity:</span> {details?.ethnicity || 'Not set'}</p>
          <p className="col-span-2"><span className="font-semibold">Bio:</span> {details?.bio || 'No bio provided'}</p>
        </div>
      )}
    </div>
  );
}
