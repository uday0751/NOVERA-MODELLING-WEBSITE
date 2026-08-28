import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ReportActionButtons } from '@/components/admin/report-action-buttons';

export default async function AdminReportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (adminProfile?.role !== 'admin') redirect('/login');

  // Fetch all user reports with reporter and reported user details
  const { data: reports } = await supabase
    .from('reports')
    .select(`
      id,
      reason,
      status,
      booking_id,
      created_at,
      reporter:reporter_id (
        id,
        full_name,
        role
      ),
      reported_user:reported_user_id (
        id,
        full_name,
        role,
        status
      )
    `)
    .order('created_at', { ascending: false });

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-6 text-black">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">User Reports Moderation</h1>
          <p className="text-sm text-gray-600">Review reported users, view conversation threads, issue warnings, or suspend offending accounts.</p>
        </div>
        <Link href="/admin/dashboard" className="border px-3 py-1.5 text-xs rounded bg-black text-white font-bold">
          &larr; Back to Admin Overview
        </Link>
      </div>

      <div className="border p-4 rounded space-y-4 bg-white">
        <h2 className="text-lg font-bold">Submitted Reports ({reports?.length || 0})</h2>

        {(!reports || reports.length === 0) ? (
          <p className="text-sm text-gray-500">No user reports submitted yet.</p>
        ) : (
          <div className="space-y-4">
            {reports.map((r: any) => {
              const reporter = Array.isArray(r.reporter) ? r.reporter[0] : r.reporter;
              const reportedUser = Array.isArray(r.reported_user) ? r.reported_user[0] : r.reported_user;

              return (
                <div key={r.id} className="border p-4 rounded bg-gray-50 space-y-3 text-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-red-700 uppercase text-xs">
                          Reported User: {reportedUser?.full_name || 'N/A'} ({reportedUser?.role})
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${
                          reportedUser?.status === 'suspended' ? 'bg-red-100 text-red-800' : 'bg-gray-100'
                        }`}>
                          Account: {reportedUser?.status || 'active'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Reporter: {reporter?.full_name || 'N/A'} ({reporter?.role}) | Submitted: {new Date(r.created_at).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      {r.booking_id && (
                        <Link
                          href={`/messages/${r.booking_id}`}
                          className="border px-2.5 py-1 text-xs rounded bg-black text-white font-bold"
                          target="_blank"
                        >
                          💬 View Thread
                        </Link>
                      )}
                      <span className="px-2 py-1 text-xs font-bold uppercase border rounded bg-white">
                        Report: {r.status}
                      </span>
                    </div>
                  </div>

                  <div className="border p-3 rounded bg-white text-xs font-mono">
                    <span className="font-bold text-gray-500 block mb-1">REASON:</span>
                    <p className="text-gray-800 whitespace-pre-wrap">{r.reason}</p>
                  </div>

                  <div className="pt-1">
                    <ReportActionButtons
                      reportId={r.id}
                      reportedUserId={reportedUser?.id}
                      currentStatus={r.status}
                    />
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
