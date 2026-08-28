import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function AdminAnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (adminProfile?.role !== 'admin') redirect('/login');

  // 1. Total models count
  const { count: totalModels } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'model');

  // 2. Total clients count
  const { count: totalClients } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'client');

  // 3. Total bookings this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count: bookingsThisMonth } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfMonth.toISOString());

  // 4. Total GMV (Gross Merchandise Value) from payments table
  const { data: payments } = await supabase
    .from('payments')
    .select('amount, platform_fee, status');

  const totalGMV = (payments || []).reduce((acc, p) => acc + Number(p.amount || 0), 0);
  const totalPlatformFees = (payments || []).reduce((acc, p) => acc + Number(p.platform_fee || 0), 0);

  // 5. Top categories booked
  const { data: bookedModels } = await supabase
    .from('bookings')
    .select(`
      model_id,
      profiles:model_id (
        model_details (
          categories
        )
      )
    `);

  const categoryCounts: Record<string, number> = {};
  (bookedModels || []).forEach((b: any) => {
    const details = Array.isArray(b.profiles?.model_details)
      ? b.profiles?.model_details[0]
      : b.profiles?.model_details;

    const categories: string[] = details?.categories || [];
    categories.forEach((cat) => {
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
  });

  const sortedCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-6 text-black">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">Platform Analytics Dashboard</h1>
          <p className="text-sm text-gray-600">Key performance metrics, Gross Merchandise Value (GMV), and talent category demand.</p>
        </div>
        <Link href="/admin/dashboard" className="border px-3 py-1.5 text-xs rounded bg-black text-white font-bold">
          &larr; Back to Admin Overview
        </Link>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        <div className="border p-4 rounded bg-white space-y-1">
          <span className="text-xs font-semibold text-gray-500 uppercase">Total Talent Models</span>
          <p className="text-3xl font-extrabold">{totalModels || 0}</p>
          <span className="text-[11px] text-gray-400">Registered platform models</span>
        </div>

        <div className="border p-4 rounded bg-white space-y-1">
          <span className="text-xs font-semibold text-gray-500 uppercase">Total Clients & Brands</span>
          <p className="text-3xl font-extrabold">{totalClients || 0}</p>
          <span className="text-[11px] text-gray-400">Registered booking clients</span>
        </div>

        <div className="border p-4 rounded bg-white space-y-1">
          <span className="text-xs font-semibold text-gray-500 uppercase">Bookings This Month</span>
          <p className="text-3xl font-extrabold">{bookingsThisMonth || 0}</p>
          <span className="text-[11px] text-gray-400">Contracts created this month</span>
        </div>

        <div className="border p-4 rounded bg-white space-y-1">
          <span className="text-xs font-semibold text-gray-500 uppercase">Total Platform GMV</span>
          <p className="text-3xl font-extrabold text-green-700">${totalGMV.toLocaleString()}</p>
          <span className="text-[11px] text-gray-400">Estimated fees: ${totalPlatformFees.toLocaleString()}</span>
        </div>
      </div>

      {/* Top Booked Categories Breakdown */}
      <div className="border p-4 rounded space-y-4 bg-white">
        <h2 className="text-lg font-bold">Top Booked Talent Categories</h2>

        {sortedCategories.length === 0 ? (
          <p className="text-sm text-gray-500">No booking category data available yet.</p>
        ) : (
          <div className="space-y-3">
            {sortedCategories.map(([category, count], idx) => (
              <div key={category} className="space-y-1">
                <div className="flex justify-between text-xs font-bold uppercase">
                  <span>{idx + 1}. {category}</span>
                  <span>{count} Bookings</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded overflow-hidden">
                  <div
                    className="bg-black h-full"
                    style={{ width: `${Math.min((count / (bookedModels?.length || 1)) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
