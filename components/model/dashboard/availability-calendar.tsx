'use client';

import { useState } from 'react';
import { toggleAvailabilityAction } from '@/app/(model)/model/actions';

interface AvailabilityItem {
  id: string;
  date: string;
  is_available: boolean;
}

interface AvailabilityCalendarProps {
  initialAvailability: AvailabilityItem[];
}

export function AvailabilityCalendar({ initialAvailability = [] }: AvailabilityCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [availabilityList, setAvailabilityList] = useState<AvailabilityItem[]>(initialAvailability);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    const res = await toggleAvailabilityAction(selectedDate, isAvailable);
    setLoading(false);

    if (!res?.error) {
      setAvailabilityList((prev) => {
        const filtered = prev.filter((a) => a.date !== selectedDate);
        return [...filtered, { id: Date.now().toString(), date: selectedDate, is_available: isAvailable }];
      });
    }
  };

  return (
    <div className="border p-4 rounded space-y-4">
      <h2 className="text-xl font-bold">Availability Calendar</h2>

      <div className="flex items-center space-x-3 text-sm">
        <div>
          <label htmlFor="availabilityDate" className="block text-xs font-semibold mb-1">Select Date</label>
          <input
            id="availabilityDate"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>

        <div>
          <label htmlFor="availabilityStatus" className="block text-xs font-semibold mb-1">Status</label>
          <select
            id="availabilityStatus"
            value={isAvailable ? 'available' : 'unavailable'}
            onChange={(e) => setIsAvailable(e.target.value === 'available')}
            className="border p-2 rounded"
          >
            <option value="available">Available</option>
            <option value="unavailable">Not Available</option>
          </select>
        </div>

        <div className="pt-5">
          <button
            onClick={handleToggle}
            disabled={loading}
            className="border bg-black text-white px-3 py-2 text-sm rounded disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Set Date Status'}
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">Marked Dates</h3>
        {availabilityList.length === 0 ? (
          <p className="text-sm text-gray-500">No custom availability dates set.</p>
        ) : (
          <ul className="space-y-1 text-sm max-h-40 overflow-y-auto">
            {availabilityList.map((item) => (
              <li key={item.id} className="flex justify-between border-b py-1">
                <span>{item.date}</span>
                <span className={item.is_available ? 'text-green-700 font-semibold' : 'text-red-600 font-semibold'}>
                  {item.is_available ? 'Available' : 'Unavailable'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
