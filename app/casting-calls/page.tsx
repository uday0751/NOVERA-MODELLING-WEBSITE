import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ApplyCastingButton } from '@/components/casting/apply-casting-button';

export default async function PublicCastingCallsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let userProfile: any = null;
  let modelApplications: string[] = [];

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('user_id', user.id)
      .single();

    userProfile = profile;

    if (profile?.role === 'model') {
      const { data: apps } = await supabase
        .from('casting_applications')
        .select('casting_call_id')
        .eq('model_id', profile.id);

      modelApplications = (apps || []).map((a) => a.casting_call_id);
    }
  }

  // Fetch all open casting calls with client company details
  const { data: castingCalls } = await supabase
    .from('casting_calls')
    .select(`
      id,
      title,
      description,
      category,
      location,
      date,
      budget,
      status,
      created_at,
      profiles:client_id (
        full_name,
        clients (
          company_name,
          verified
        )
      )
    `)
    .eq('status', 'open')
    .order('created_at', { ascending: false });

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-6 text-black">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">Public Casting Calls Board</h1>
          <p className="text-sm text-gray-600">Open modeling casting notices, campaigns, and runway projects.</p>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          {userProfile?.role === 'client' && (
            <Link href="/client/casting-calls/new" className="border px-3 py-1.5 rounded bg-black text-white font-bold">
              + Post New Casting Call
            </Link>
          )}
          <Link href="/" className="border px-3 py-1.5 rounded bg-white hover:bg-gray-100 font-bold">
            Home
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {(!castingCalls || castingCalls.length === 0) ? (
          <p className="text-sm text-gray-500 border p-8 rounded text-center">
            No open casting calls available right now. Check back soon!
          </p>
        ) : (
          castingCalls.map((call: any) => {
            const clientProfile = Array.isArray(call.profiles) ? call.profiles[0] : call.profiles;
            const clientDetails = Array.isArray(clientProfile?.clients)
              ? clientProfile?.clients[0]
              : clientProfile?.clients;

            const isVerified = Boolean(clientDetails?.verified);
            const hasApplied = modelApplications.includes(call.id);

            return (
              <div key={call.id} className="border p-5 rounded bg-white shadow-xs space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="font-bold text-lg">{call.title}</h2>
                      {isVerified && (
                        <span className="border border-blue-500 bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded">
                          ✓ Verified Client
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600">
                      Posted by: <span className="font-semibold text-black">{clientDetails?.company_name || clientProfile?.full_name || 'Agency Client'}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-extrabold text-green-700">${call.budget}</span>
                    <p className="text-[11px] text-gray-500">Budget</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs border p-2 rounded bg-gray-50">
                  <div><span className="text-gray-500">Category:</span> <span className="font-semibold uppercase">{call.category || 'General'}</span></div>
                  <div><span className="text-gray-500">Location:</span> <span className="font-semibold">{call.location || 'Remote'}</span></div>
                  <div><span className="text-gray-500">Date:</span> <span className="font-semibold">{call.date}</span></div>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">{call.description}</p>

                <div className="pt-2 flex justify-between items-center border-t">
                  <span className="text-[10px] text-gray-400">
                    Posted: {new Date(call.created_at).toLocaleDateString()}
                  </span>

                  <ApplyCastingButton
                    castingCallId={call.id}
                    hasApplied={hasApplied}
                    isModel={userProfile?.role === 'model'}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
