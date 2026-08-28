import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { AdminRefundButton } from '@/components/admin/admin-refund-button';

export default async function AdminBookingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (adminProfile?.role !== 'admin') redirect('/login');

  // Fetch all bookings with model, client, and payment records
  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      id,
      status,
      date,
      location,
      project_type,
      budget,
      created_at,
      model:model_id (
        full_name,
        email
      ),
      client:client_id (
        full_name,
        email
      ),
      payments (
        id,
        amount,
        platform_fee,
        status,
        stripe_payment_intent_id
      )
    `)
    .order('created_at', { ascending: false });

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-6 text-black">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">Bookings & Disputes Management</h1>
          <p className="text-sm text-gray-600">Overview of all booking contracts, payment escrow statuses, and manual Stripe dispute refunds.</p>
        </div>
        <Link href="/admin/dashboard" className="border px-3 py-1.5 text-xs rounded bg-black text-white font-bold">
          &larr; Back to Admin Overview
        </Link>
      </div>

      <div className="border p-4 rounded space-y-4 bg-white">
        <h2 className="text-lg font-bold">All Booking Contracts ({bookings?.length || 0})</h2>

        {(!bookings || bookings.length === 0) ? (
          <p className="text-sm text-gray-500">No bookings created yet.</p>
        ) : (
          <div className="space-y-3">
            {bookings.map((b: any) => {
              const model = Array.isArray(b.model) ? b.model[0] : b.model;
              const client = Array.isArray(b.client) ? b.client[0] : b.client;
              const payment = Array.isArray(b.payments) ? b.payments[0] : b.payments;

              return (
                <div key={b.id} className="border p-4 rounded space-y-2 text-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-base">{b.project_type || 'Modeling Booking'}</h3>
                      <p className="text-xs text-gray-600">
                        Client: <span className="font-semibold text-black">{client?.full_name || 'N/A'}</span> ({client?.email})
                      </p>
                      <p className="text-xs text-gray-600">
                        Model: <span className="font-semibold text-black">{model?.full_name || 'N/A'}</span> ({model?.email})
                      </p>
                      <p className="text-xs text-gray-500">
                        Date: {b.date} | Location: {b.location} | Budget: ${b.budget || 'N/A'}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs font-bold uppercase border rounded capitalize">
                        Status: {b.status}
                      </span>

                      {payment && (
                        <span className={`px-2 py-1 text-xs font-bold uppercase border rounded ${
                          payment.status === 'held' ? 'bg-blue-50 text-blue-700 border-blue-300' :
                          payment.status === 'released' ? 'bg-green-50 text-green-700 border-green-300' :
                          'bg-red-50 text-red-700 border-red-300'
                        }`}>
                          Payment: {payment.status} (${payment.amount})
                        </span>
                      )}

                      <Link
                        href={`/messages/${b.id}`}
                        className="border px-2.5 py-1 text-xs rounded bg-black text-white font-bold"
                        target="_blank"
                      >
                        💬 Messages
                      </Link>
                    </div>
                  </div>

                  <div className="pt-2">
                    <AdminRefundButton bookingId={b.id} paymentStatus={payment?.status} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
