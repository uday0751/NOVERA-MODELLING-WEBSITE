import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ClientVerificationButton } from '@/components/admin/client-verification-button';

export default async function AdminClientsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (adminProfile?.role !== 'admin') redirect('/login');

  // Fetch all client profiles with company details
  const { data: clients } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      email,
      phone,
      created_at,
      clients (
        company_name,
        industry,
        verified
      )
    `)
    .eq('role', 'client')
    .order('created_at', { ascending: false });

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-6 text-black">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">Client Verification & Directory</h1>
          <p className="text-sm text-gray-600">Verify client company credentials to display verified badges across bookings and casting calls.</p>
        </div>
        <Link href="/admin/dashboard" className="border px-3 py-1.5 text-xs rounded bg-black text-white font-bold">
          &larr; Back to Admin Overview
        </Link>
      </div>

      <div className="border p-4 rounded space-y-3 bg-white">
        <h2 className="text-lg font-bold">Registered Clients ({clients?.length || 0})</h2>

        {(!clients || clients.length === 0) ? (
          <p className="text-sm text-gray-500">No client profiles registered yet.</p>
        ) : (
          <div className="space-y-3">
            {clients.map((c: any) => {
              const clientDetails = Array.isArray(c.clients) ? c.clients[0] : c.clients;
              const isVerified = Boolean(clientDetails?.verified);

              return (
                <div key={c.id} className="border p-4 rounded flex justify-between items-center text-sm">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-bold text-base">{c.full_name}</p>
                      {isVerified ? (
                        <span className="border border-blue-500 bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded">
                          ✓ Verified Client
                        </span>
                      ) : (
                        <span className="border text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded">
                          Unverified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600">
                      Company: {clientDetails?.company_name || 'Individual'} | Industry: {clientDetails?.industry || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500">Email: {c.email} | Phone: {c.phone || 'N/A'}</p>
                  </div>

                  <ClientVerificationButton clientId={c.id} isVerified={isVerified} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
