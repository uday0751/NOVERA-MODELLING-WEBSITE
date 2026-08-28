import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { SignOutButton } from '@/components/sign-out-button';

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('user_id', user.id)
    .single();

  if (profile?.role !== 'admin') redirect('/login');

  // Quick summary counts
  const { count: pendingModelsCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'model')
    .eq('status', 'pending');

  const { count: unverifiedClientsCount } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('verified', false);

  const { count: pendingReportsCount } = await supabase
    .from('reports')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  const { count: totalBookingsCount } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true });

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-6 text-black">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">Agency Admin Portal</h1>
          <p className="text-sm text-gray-600">Welcome, {profile.full_name || 'Admin'}</p>
        </div>
        <SignOutButton />
      </div>

      {/* Admin Navigation Deck */}
      <nav className="flex flex-wrap gap-2 text-xs font-bold uppercase border-b pb-4">
        <Link href="/admin/dashboard" className="border px-4 py-2 rounded bg-black text-white">
          Overview
        </Link>
        <Link href="/admin/models" className="border px-4 py-2 rounded bg-white hover:bg-gray-100">
          Model Approval Queue ({pendingModelsCount || 0})
        </Link>
        <Link href="/admin/clients" className="border px-4 py-2 rounded bg-white hover:bg-gray-100">
          Client Verification ({unverifiedClientsCount || 0})
        </Link>
        <Link href="/admin/reports" className="border px-4 py-2 rounded bg-white hover:bg-gray-100">
          Reports & Moderation ({pendingReportsCount || 0})
        </Link>
        <Link href="/admin/bookings" className="border px-4 py-2 rounded bg-white hover:bg-gray-100">
          Bookings & Disputes ({totalBookingsCount || 0})
        </Link>
        <Link href="/admin/analytics" className="border px-4 py-2 rounded bg-white hover:bg-gray-100">
          Analytics Dashboard
        </Link>
      </nav>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        <div className="border p-4 rounded bg-white space-y-2">
          <span className="text-xs font-semibold text-gray-500">PENDING MODELS</span>
          <p className="text-3xl font-extrabold">{pendingModelsCount || 0}</p>
          <Link href="/admin/models" className="text-xs underline block font-bold">
            Review Approval Queue &rarr;
          </Link>
        </div>

        <div className="border p-4 rounded bg-white space-y-2">
          <span className="text-xs font-semibold text-gray-500">UNVERIFIED CLIENTS</span>
          <p className="text-3xl font-extrabold">{unverifiedClientsCount || 0}</p>
          <Link href="/admin/clients" className="text-xs underline block font-bold">
            Manage Client Badges &rarr;
          </Link>
        </div>

        <div className="border p-4 rounded bg-white space-y-2">
          <span className="text-xs font-semibold text-gray-500">OPEN REPORTS</span>
          <p className="text-3xl font-extrabold text-red-600">{pendingReportsCount || 0}</p>
          <Link href="/admin/reports" className="text-xs underline block font-bold">
            Moderate User Reports &rarr;
          </Link>
        </div>

        <div className="border p-4 rounded bg-white space-y-2">
          <span className="text-xs font-semibold text-gray-500">TOTAL BOOKINGS</span>
          <p className="text-3xl font-extrabold">{totalBookingsCount || 0}</p>
          <Link href="/admin/bookings" className="text-xs underline block font-bold">
            View Bookings & Refunds &rarr;
          </Link>
        </div>
      </div>
    </main>
  );
}
