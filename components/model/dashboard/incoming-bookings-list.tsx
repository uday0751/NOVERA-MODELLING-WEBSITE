'use client';

import { useState } from 'react';
import Link from 'next/link';
import { respondToBookingAction } from '@/app/(model)/model/actions';

interface BookingItem {
  id: string;
  client_id: string;
  status: string;
  date: string;
  location: string;
  project_type?: string;
  brief?: string;
  budget?: number;
  created_at: string;
}

interface BookingsListProps {
  bookings: BookingItem[];
  identityVerified?: boolean;
}

export function IncomingBookingsList({ bookings = [], identityVerified = false }: BookingsListProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRespond = async (bookingId: string, status: 'accepted' | 'declined') => {
    if (status === 'accepted' && !identityVerified) {
      setErrorMsg('You must complete Government Identity Verification before accepting paid bookings.');
      return;
    }

    setLoadingId(bookingId);
    setErrorMsg(null);
    await respondToBookingAction(bookingId, status);
    setLoadingId(null);
  };

  return (
    <div className="border p-4 rounded space-y-4 bg-white text-black">
      <h2 className="text-xl font-bold">Incoming Booking Requests</h2>

      {errorMsg && (
        <p className="text-xs text-red-600 font-semibold p-2 border border-red-300 bg-red-50 rounded">
          {errorMsg}
        </p>
      )}

      {bookings.length === 0 ? (
        <p className="text-sm text-gray-500">No booking requests received yet.</p>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="border p-3 rounded space-y-2 text-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-base">{b.project_type || 'Modeling Booking'}</p>
                  <p className="text-xs text-gray-600">Date: {b.date} | Location: {b.location}</p>
                  {b.budget && <p className="text-xs font-semibold">Budget: ${b.budget}</p>}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 text-xs font-bold uppercase border rounded capitalize">
                    {b.status}
                  </span>
                  <Link
                    href={`/messages/${b.id}`}
                    className="border px-2.5 py-1 text-xs rounded bg-black text-white hover:bg-gray-800 font-bold"
                  >
                    💬 Messages
                  </Link>
                </div>
              </div>

              {b.brief && <p className="text-xs text-gray-700">Brief: {b.brief}</p>}

              {b.status === 'requested' && (
                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={() => handleRespond(b.id, 'accepted')}
                    disabled={loadingId === b.id}
                    className="border bg-black text-white px-3 py-1 text-xs rounded disabled:opacity-50 hover:bg-gray-800"
                  >
                    Accept Booking
                  </button>
                  <button
                    onClick={() => handleRespond(b.id, 'declined')}
                    disabled={loadingId === b.id}
                    className="border px-3 py-1 text-xs rounded hover:bg-gray-100 disabled:opacity-50"
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
