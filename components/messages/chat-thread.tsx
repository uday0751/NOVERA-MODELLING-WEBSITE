'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { sendMessageAction } from '@/app/messages/actions';
import { ReportModal } from './report-modal';

export interface MessageItem {
  id: string;
  booking_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export interface ChatThreadProps {
  bookingId: string;
  currentProfileId: string;
  recipientProfileId: string;
  recipientName: string;
  initialMessages: MessageItem[];
  isSuspended: boolean;
  recipientIsSuspended: boolean;
}

export function ChatThread({
  bookingId,
  currentProfileId,
  recipientProfileId,
  recipientName,
  initialMessages,
  isSuspended,
  recipientIsSuspended,
}: ChatThreadProps) {
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);
  const [inputContent, setInputContent] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();

  useEffect(() => {
    // Scroll to bottom when messages update
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Set up Supabase Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`booking-messages-${bookingId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `booking_id=eq.${bookingId}`,
        },
        (payload) => {
          const newMsg = payload.new as MessageItem;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [bookingId, supabase]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim()) return;

    if (isSuspended) {
      setErrorMsg('Your account is suspended. You cannot send messages.');
      return;
    }
    if (recipientIsSuspended) {
      setErrorMsg('Cannot send message because recipient account is suspended.');
      return;
    }

    setIsSending(true);
    setErrorMsg(null);

    const res = await sendMessageAction({
      bookingId,
      content: inputContent.trim(),
    });

    setIsSending(false);

    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      setInputContent('');
    }
  };

  return (
    <div className="border rounded-lg bg-white text-black p-4 space-y-4 max-w-3xl mx-auto my-6 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3">
        <div>
          <h2 className="font-bold text-lg">Conversation with {recipientName}</h2>
          <p className="text-xs text-gray-500">Booking Thread ID: {bookingId}</p>
        </div>
        <ReportModal
          bookingId={bookingId}
          reportedUserId={recipientProfileId}
          reportedUserName={recipientName}
        />
      </div>

      {/* Account Status Alerts */}
      {isSuspended && (
        <div className="p-3 border border-red-500 bg-red-50 text-red-700 text-xs rounded font-semibold">
          ⚠️ Your account is currently suspended. Messaging is disabled.
        </div>
      )}
      {recipientIsSuspended && (
        <div className="p-3 border border-amber-500 bg-amber-50 text-amber-700 text-xs rounded font-semibold">
          ⚠️ Recipient account is suspended. Messaging is disabled.
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="border p-4 rounded h-96 overflow-y-auto space-y-3 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-8">
            No messages yet. Send a message to start the conversation!
          </p>
        ) : (
          messages.map((msg) => {
            const isMine = msg.sender_id === currentProfileId;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-md p-3 rounded-lg text-sm ${
                    isMine
                      ? 'bg-black text-white rounded-br-none'
                      : 'bg-white text-black border border-gray-200 rounded-bl-none shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <span
                    className={`block text-[10px] mt-1 ${
                      isMine ? 'text-gray-400 text-right' : 'text-gray-400'
                    }`}
                  >
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      {errorMsg && (
        <p className="text-red-500 text-xs font-semibold">{errorMsg}</p>
      )}

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={inputContent}
          onChange={(e) => setInputContent(e.target.value)}
          disabled={isSuspended || recipientIsSuspended || isSending}
          placeholder={
            isSuspended || recipientIsSuspended
              ? 'Messaging disabled'
              : 'Type a message...'
          }
          className="flex-1 border p-2 text-sm rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={isSuspended || recipientIsSuspended || isSending || !inputContent.trim()}
          className="border bg-black text-white px-5 py-2 text-xs font-bold rounded disabled:opacity-50 hover:bg-gray-800"
        >
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
