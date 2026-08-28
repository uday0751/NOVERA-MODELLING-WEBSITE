'use client';

import { useState } from 'react';
import { uploadMediaAction, deleteMediaAction } from '@/app/(model)/model/actions';

interface MediaItem {
  id: string;
  url: string;
  type: string;
  category: string;
}

interface Step4Props {
  existingMedia: MediaItem[];
  onNext: () => void;
  onPrev: () => void;
}

export function Step4MediaUpload({ existingMedia = [], onNext, onPrev }: Step4Props) {
  const [mediaList, setMediaList] = useState<MediaItem[]>(existingMedia);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { id: 'headshot', label: 'Headshot (Required)' },
    { id: 'full_body', label: 'Full Body (Required)' },
    { id: 'profile', label: 'Profile Shot (Required)' },
    { id: 'editorial', label: 'Editorial / Portfolio (Optional)' },
    { id: 'reel', label: 'Reel Video (Optional)' },
  ];

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, categoryId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', categoryId);
    formData.append('type', file.type.startsWith('video/') ? 'video' : 'photo');

    const res = await uploadMediaAction(formData);
    setUploading(false);

    if (res?.error) {
      setError(res.error);
    } else if (res?.url) {
      setMediaList((prev) => [
        ...prev,
        { id: Date.now().toString(), url: res.url, type: file.type.startsWith('video/') ? 'video' : 'photo', category: categoryId },
      ]);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await deleteMediaAction(id);
    if (!res.error) {
      setMediaList((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const validateAndNext = () => {
    const hasHeadshot = mediaList.some((m) => m.category === 'headshot');
    const hasFullBody = mediaList.some((m) => m.category === 'full_body');
    const hasProfile = mediaList.some((m) => m.category === 'profile');

    if (!hasHeadshot || !hasFullBody || !hasProfile) {
      setError('Please upload at least one Headshot, one Full Body photo, and one Profile photo before proceeding.');
      return;
    }

    onNext();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Step 4: Portfolio Media Uploads</h2>
      <p className="text-sm text-gray-600">
        Upload your portfolio images and videos. Minimum required: Headshot, Full Body, and Profile shot.
      </p>

      {error && <div className="p-2 border border-red-500 text-red-700 rounded">{error}</div>}

      <div className="space-y-4">
        {categories.map((cat) => {
          const uploadedForCategory = mediaList.filter((m) => m.category === cat.id);
          return (
            <div key={cat.id} className="border p-3 rounded">
              <label className="block font-medium mb-1">{cat.label}</label>
              <input
                type="file"
                accept={cat.id === 'reel' ? 'video/*' : 'image/*'}
                onChange={(e) => handleUpload(e, cat.id)}
                disabled={uploading}
                className="mb-2"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {uploadedForCategory.map((item) => (
                  <div key={item.id} className="relative border p-1 rounded">
                    {item.type === 'video' ? (
                      <video src={item.url} className="w-24 h-24 object-cover" controls />
                    ) : (
                      <img src={item.url} alt={cat.id} className="w-24 h-24 object-cover" />
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded-bl"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onPrev}
          className="border px-4 py-2 rounded"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={validateAndNext}
          className="border bg-black text-white px-4 py-2 rounded"
        >
          Next Step
        </button>
      </div>
    </div>
  );
}
