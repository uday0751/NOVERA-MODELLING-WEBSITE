'use client';

import { useState } from 'react';
import { uploadMediaAction, deleteMediaAction } from '@/app/(model)/model/actions';

interface MediaItem {
  id: string;
  url: string;
  type: string;
  category: string;
}

interface MediaManagerProps {
  media: MediaItem[];
}

export function MediaManager({ media = [] }: MediaManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('editorial');
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', selectedCategory);
    formData.append('type', file.type.startsWith('video/') ? 'video' : 'photo');

    const res = await uploadMediaAction(formData);
    setUploading(false);

    if (res?.error) {
      setError(res.error);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteMediaAction(id);
  };

  return (
    <div className="border p-4 rounded space-y-4">
      <h2 className="text-xl font-bold">Media Portfolio</h2>

      {error && <div className="p-2 border border-red-500 text-red-700 text-sm rounded">{error}</div>}

      <div className="border p-3 rounded flex items-center space-x-3 text-sm">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-1.5 rounded"
        >
          <option value="headshot">Headshot</option>
          <option value="full_body">Full Body</option>
          <option value="profile">Profile</option>
          <option value="editorial">Editorial</option>
          <option value="reel">Reel Video</option>
        </select>

        <input
          type="file"
          accept={selectedCategory === 'reel' ? 'video/*' : 'image/*'}
          onChange={handleUpload}
          disabled={uploading}
        />
        {uploading && <span className="text-xs text-gray-500">Uploading...</span>}
      </div>

      {media.length === 0 ? (
        <p className="text-sm text-gray-500">No media uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {media.map((item) => (
            <div key={item.id} className="relative border p-1 rounded">
              {item.type === 'video' ? (
                <video src={item.url} className="w-full h-32 object-cover" controls />
              ) : (
                <img src={item.url} alt={item.category} className="w-full h-32 object-cover" />
              )}
              <span className="absolute bottom-1 left-1 bg-black text-white text-[10px] px-1 rounded capitalize">
                {item.category}
              </span>
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
