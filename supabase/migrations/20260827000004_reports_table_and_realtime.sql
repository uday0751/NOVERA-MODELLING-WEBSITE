-- Migration: 20260827000004_reports_table_and_realtime.sql
-- Description: Create reports table for user reporting and enable Realtime on messages

-------------------------------------------------------
-- 1. REPORTS TABLE
-------------------------------------------------------
create table if not exists public.reports (
    id uuid primary key default gen_random_uuid(),
    reporter_id uuid not null references public.profiles(id) on delete cascade,
    reported_user_id uuid not null references public.profiles(id) on delete cascade,
    booking_id uuid references public.bookings(id) on delete set null,
    reason text not null,
    status text not null default 'pending' check (status in ('pending', 'reviewed', 'dismissed', 'actioned')),
    created_at timestamptz not null default now()
);

create index if not exists idx_reports_reporter_id on public.reports(reporter_id);
create index if not exists idx_reports_reported_user_id on public.reports(reported_user_id);
create index if not exists idx_reports_booking_id on public.reports(booking_id);

-------------------------------------------------------
-- ENABLE ROW LEVEL SECURITY
-------------------------------------------------------
alter table public.reports enable row level security;

-------------------------------------------------------
-- RLS POLICIES FOR REPORTS
-------------------------------------------------------
create policy "Authenticated users can submit reports"
on public.reports for insert
with check (
    reporter_id = public.get_current_profile_id()
    or public.is_admin()
);

create policy "Users can view own submitted reports"
on public.reports for select
using (
    reporter_id = public.get_current_profile_id()
    or public.is_admin()
);

-------------------------------------------------------
-- ENABLE SUPABASE REALTIME ON MESSAGES
-------------------------------------------------------
begin;
  -- Drop publication if exists or add table to supabase_realtime publication
  alter publication supabase_realtime add table public.messages;
commit;
