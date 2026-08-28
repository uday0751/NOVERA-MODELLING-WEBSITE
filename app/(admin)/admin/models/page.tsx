import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { ModelActionButtons } from '@/components/admin/model-action-buttons';

export default async function AdminModelsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (adminProfile?.role !== 'admin') redirect('/login');

  // Fetch all model profiles with details, rates, and media
  const { data: models } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      email,
      phone,
      status,
      created_at,
      stripe_onboarding_completed,
      model_details (
        height,
        weight,
        bust,
        waist,
        hips,
        shoe_size,
        hair_color,
        eye_color,
        ethnicity,
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
    `)
    .eq('role', 'model')
    .order('created_at', { ascending: false });

  const pendingModels = (models || []).filter((m) => m.status === 'pending');
  const otherModels = (models || []).filter((m) => m.status !== 'pending');

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-6 text-black">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">Model Approval Queue & Management</h1>
          <p className="text-sm text-gray-600">Review submitted model profiles, approve, reject, or suspend talent.</p>
        </div>
        <Link href="/admin/dashboard" className="border px-3 py-1.5 text-xs rounded bg-black text-white font-bold">
          &larr; Back to Admin Overview
        </Link>
      </div>

      {/* Pending Models Queue Section */}
      <div className="border p-4 rounded space-y-4 bg-amber-50/50">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span>⏳ Pending Approval Queue</span>
          <span className="text-xs border px-2 py-0.5 rounded bg-amber-100 text-amber-800">
            {pendingModels.length} Pending
          </span>
        </h2>

        {pendingModels.length === 0 ? (
          <p className="text-sm text-gray-500">No model applications pending review.</p>
        ) : (
          <div className="space-y-4">
            {pendingModels.map((m: any) => {
              const details = Array.isArray(m.model_details) ? m.model_details[0] : m.model_details;
              const rates = Array.isArray(m.model_rates) ? m.model_rates[0] : m.model_rates;
              const media = m.model_media || [];

              return (
                <div key={m.id} className="border p-4 rounded bg-white space-y-3 text-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-base">{m.full_name}</h3>
                      <p className="text-xs text-gray-600">{m.email} | Phone: {m.phone || 'N/A'}</p>
                      <p className="text-xs text-gray-500">Submitted: {new Date(m.created_at).toLocaleDateString()}</p>
                    </div>

                    <ModelActionButtons profileId={m.id} currentStatus={m.status} />
                  </div>

                  {/* Stats & Categories */}
                  {details && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs border p-2 rounded bg-gray-50">
                      <div><span className="text-gray-500">Height:</span> {details.height} cm</div>
                      <div><span className="text-gray-500">Bust/Waist/Hips:</span> {details.bust}/{details.waist}/{details.hips}</div>
                      <div><span className="text-gray-500">Shoe Size:</span> {details.shoe_size}</div>
                      <div><span className="text-gray-500">Hair/Eye:</span> {details.hair_color}/{details.eye_color}</div>
                    </div>
                  )}

                  {rates && (
                    <p className="text-xs font-semibold">
                      Hourly Rate: ${rates.hourly_rate} {rates.currency || 'USD'}
                    </p>
                  )}

                  {/* Portfolio Media Showcase */}
                  {media.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-gray-500">Submitted Media ({media.length}):</span>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {media.map((item: any, idx: number) => (
                          <div key={idx} className="relative w-20 h-24 border rounded overflow-hidden flex-shrink-0 bg-gray-100">
                            <Image
                              src={item.url}
                              alt={item.category || 'Portfolio'}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* All Other Models List */}
      <div className="border p-4 rounded space-y-4 bg-white">
        <h2 className="text-lg font-bold">All Registered Models ({otherModels.length})</h2>

        {otherModels.length === 0 ? (
          <p className="text-sm text-gray-500">No other models registered.</p>
        ) : (
          <div className="space-y-3">
            {otherModels.map((m: any) => (
              <div key={m.id} className="border p-3 rounded flex justify-between items-center text-sm">
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-semibold">{m.full_name}</p>
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${
                      m.status === 'approved' ? 'bg-green-50 text-green-700 border-green-300' :
                      m.status === 'suspended' ? 'bg-red-50 text-red-700 border-red-300' : 'bg-gray-50'
                    }`}>
                      {m.status}
                    </span>
                    {m.stripe_onboarding_completed && (
                      <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-300 px-1.5 py-0.5 rounded font-semibold">
                        Stripe Onboarded
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600">{m.email} | {m.phone || 'No Phone'}</p>
                </div>

                <ModelActionButtons profileId={m.id} currentStatus={m.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
