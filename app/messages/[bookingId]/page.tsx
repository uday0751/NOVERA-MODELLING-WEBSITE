import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ChatThread } from '@/components/messages/chat-thread';

export default async function BookingMessagesPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch current user profile
  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('id, role, full_name, status')
    .eq('user_id', user.id)
    .single();

  if (!currentProfile) {
    redirect('/login');
  }

  // Fetch booking details
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single();

  if (bookingError || !booking) {
    return (
      <div className="p-8 text-center space-y-4">
        <h1 className="text-xl font-bold text-red-600">Booking Not Found</h1>
        <p className="text-sm text-gray-500">The requested conversation thread does not exist.</p>
        <Link href="/" className="text-xs font-bold underline">
          Return Home
        </Link>
      </div>
    );
  }

  // Ensure current user is either the model or client in this booking
  const isModel = booking.model_id === currentProfile.id;
  const isClient = booking.client_id === currentProfile.id;

  if (!isModel && !isClient) {
    return (
      <div className="p-8 text-center space-y-4">
        <h1 className="text-xl font-bold text-red-600">Unauthorized</h1>
        <p className="text-sm text-gray-500">You are not a participant in this booking conversation.</p>
        <Link href="/" className="text-xs font-bold underline">
          Return Home
        </Link>
      </div>
    );
  }

  // Identify recipient profile ID
  const recipientProfileId = isModel ? booking.client_id : booking.model_id;

  // Fetch recipient profile & details
  const { data: recipientProfile } = await supabase
    .from('profiles')
    .select('id, full_name, status')
    .eq('id', recipientProfileId)
    .single();

  const recipientName = recipientProfile?.full_name || 'Booking Participant';

  // Fetch initial message history
  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('booking_id', bookingId)
    .order('created_at', { ascending: true });

  const backLink = currentProfile.role === 'model' ? '/model/dashboard' : '/client/dashboard';

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 text-black">
      <div className="max-w-3xl mx-auto mb-4 flex justify-between items-center">
        <Link href={backLink} className="text-xs font-bold border px-3 py-1.5 rounded bg-white hover:bg-gray-50">
          &larr; Back to Dashboard
        </Link>
        <span className="text-xs text-gray-500 font-mono uppercase">
          Status: {booking.status}
        </span>
      </div>

      <ChatThread
        bookingId={bookingId}
        currentProfileId={currentProfile.id}
        recipientProfileId={recipientProfileId}
        recipientName={recipientName}
        initialMessages={messages || []}
        isSuspended={currentProfile.status === 'suspended'}
        recipientIsSuspended={recipientProfile?.status === 'suspended'}
      />
    </div>
  );
}
