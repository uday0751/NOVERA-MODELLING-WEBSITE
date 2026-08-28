'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { CATEGORY_OPTIONS } from '@/lib/validations/onboarding';

export function ModelSearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [minHeight, setMinHeight] = useState(searchParams.get('minHeight') || '');
  const [maxHeight, setMaxHeight] = useState(searchParams.get('maxHeight') || '');
  const [maxRate, setMaxRate] = useState(searchParams.get('maxRate') || '');
  const [availableDate, setAvailableDate] = useState(searchParams.get('availableDate') || '');

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (location) params.set('location', location);
    if (minHeight) params.set('minHeight', minHeight);
    if (maxHeight) params.set('maxHeight', maxHeight);
    if (maxRate) params.set('maxRate', maxRate);
    if (availableDate) params.set('availableDate', availableDate);

    router.push(`/client/models?${params.toString()}`);
  };

  const handleReset = () => {
    setCategory('');
    setLocation('');
    setMinHeight('');
    setMaxHeight('');
    setMaxRate('');
    setAvailableDate('');
    router.push('/client/models');
  };

  return (
    <form onSubmit={handleFilter} className="border p-4 rounded bg-gray-50 space-y-3 text-sm">
      <h2 className="font-bold text-base">Filter Models</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div>
          <label htmlFor="filterCategory" className="block text-xs font-medium">Category</label>
          <select
            id="filterCategory"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border p-2 rounded text-sm bg-white"
          >
            <option value="">All Categories</option>
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat} className="capitalize">
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filterLocation" className="block text-xs font-medium">Location</label>
          <input
            id="filterLocation"
            type="text"
            placeholder="e.g. New York"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border p-2 rounded text-sm bg-white"
          />
        </div>

        <div>
          <label htmlFor="filterDate" className="block text-xs font-medium">Available Date</label>
          <input
            id="filterDate"
            type="date"
            value={availableDate}
            onChange={(e) => setAvailableDate(e.target.value)}
            className="w-full border p-2 rounded text-sm bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-medium">Height Range (cm)</label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={minHeight}
              onChange={(e) => setMinHeight(e.target.value)}
              className="w-1/2 border p-2 rounded text-sm bg-white"
            />
            <input
              type="number"
              placeholder="Max"
              value={maxHeight}
              onChange={(e) => setMaxHeight(e.target.value)}
              className="w-1/2 border p-2 rounded text-sm bg-white"
            />
          </div>
        </div>

        <div>
          <label htmlFor="filterMaxRate" className="block text-xs font-medium">Max Hourly Rate ($)</label>
          <input
            id="filterMaxRate"
            type="number"
            placeholder="e.g. 150"
            value={maxRate}
            onChange={(e) => setMaxRate(e.target.value)}
            className="w-full border p-2 rounded text-sm bg-white"
          />
        </div>
      </div>

      <div className="flex space-x-2 pt-2">
        <button type="submit" className="border bg-black text-white px-4 py-1.5 rounded text-xs">
          Apply Filters
        </button>
        <button type="button" onClick={handleReset} className="border bg-white px-4 py-1.5 rounded text-xs hover:bg-gray-100">
          Reset Filters
        </button>
      </div>
    </form>
  );
}
