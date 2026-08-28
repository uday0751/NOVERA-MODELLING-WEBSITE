import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { ApplicantActionButtons } from '@/components/client/applicant-action-buttons';

export default async function CastingApplicationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: castingCallId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: clientProfile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('user_id', user.id)
    .single();

  if (!clientProfile || clientProfile.role !== 'client') redirect('/login');

  // Fetch casting call details
  const { data: castingCall, error: callError } = await supabase
    .from('casting_calls')
    .select('*')
    .eq('id', castingCallId)
    .single();

  if (callError || !castingCall || castingCall.client_id !== clientProfile.id) {
    return (
      <div className="p-8 text-center space-y-4 text-black">
        <h1 className="text-xl font-bold text-red-600">Casting Call Not Found</h1>
        <p className="text-sm text-gray-500">You are not authorized to view applicants for this casting call.</p>
        <Link href="/client/dashboard" className="text-xs font-bold underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  // Fetch all applications for this casting call with model details, rates, and media
  const { data: applications } = await supabase
    .from('casting_applications')
    .select(`
      id,
      status,
      created_at,
      profiles:model_id (
        id,
        full_name,
        email,
        phone,
        model_details (
          height,
          bust,
          waist,
          hips,
          categories
        ),
        model_rates (
          hourly_rate,
          currency
        ),
        model_media (
          url,
          category
        )
      )
    `)
    .eq('casting_call_id', castingCallId)
    .order('created_at', { ascending: false });

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-6 text-black">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">Applicants for "{castingCall.title}"</h1>
          <p className="text-sm text-gray-600">
            Category: {castingCall.category} | Location: {castingCall.location} | Date: {castingCall.date} | Budget: ${castingCall.budget}
          </p>
        </div>
        <Link href="/client/dashboard" className="border px-3 py-1.5 text-xs rounded bg-black text-white font-bold">
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="border p-4 rounded space-y-4 bg-white">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Model Applicants ({applications?.length || 0})</h2>
          <span className="text-xs text-gray-500">
            Accepting an applicant auto-creates a booking contract
          </span>
        </div>

        {(!applications || applications.length === 0) ? (
          <p className="text-sm text-gray-500 py-8 text-center border rounded">
            No models have applied to this casting call yet.
          </p>
        ) : (
          <div className="space-y-4">
            {applications.map((app: any) => {
              const model = Array.isArray(app.profiles) ? app.profiles[0] : app.profiles;
              const details = Array.isArray(model?.model_details) ? model?.model_details[0] : model?.model_details;
              const rates = Array.isArray(model?.model_rates) ? model?.model_rates[0] : model?.model_rates;
              const media = model?.model_media || [];
              const headshot = media.find((m: any) => m.category === 'headshot')?.url || media[0]?.url;

              return (
                <div key={app.id} className="border p-4 rounded bg-gray-50 space-y-3 text-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex space-x-3">
                      {headshot ? (
                        <div className="relative w-16 h-20 border rounded overflow-hidden flex-shrink-0 bg-gray-200">
                          <Image src={headshot} alt={model?.full_name || 'Model'} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-16 h-20 border rounded flex items-center justify-center bg-gray-200 text-xs font-bold">
                          No Photo
                        </div>
                      )}

                      <div>
                        <Link href={`/client/models/${model?.id}`} className="font-bold text-base hover:underline" target="_blank">
                          {model?.full_name} ↗
                        </Link>
                        <p className="text-xs text-gray-600">{model?.email} | Phone: {model?.phone || 'N/A'}</p>
                        {rates && (
                          <p className="text-xs font-semibold text-green-700">
                            Rate: ${rates.hourly_rate} / hr
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-bold uppercase rounded border ${
                        app.status === 'accepted' ? 'bg-green-100 text-green-800 border-green-300' :
                        app.status === 'shortlisted' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                        app.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-300' : 'bg-gray-100'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  </div>

                  {/* Physical Measurements */}
                  {details && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs border p-2 rounded bg-white">
                      <div><span className="text-gray-500">Height:</span> {details.height} cm</div>
                      <div><span className="text-gray-500">Bust/Waist/Hips:</span> {details.bust}/{details.waist}/{details.hips}</div>
                      <div><span className="text-gray-500">Categories:</span> {details.categories?.join(', ') || 'N/A'}</div>
                      <div><span className="text-gray-500 font-bold">Applied:</span> {new Date(app.created_at).toLocaleDateString()}</div>
                    </div>
                  )}

                  <div className="pt-1 flex justify-between items-center border-t">
                    <ApplicantActionButtons applicationId={app.id} currentStatus={app.status} />
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
