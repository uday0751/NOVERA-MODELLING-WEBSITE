-- Migration: 20260827000003_client_shortlist_and_notifications.sql
-- Description: Tables for client shortlist management and in-app notifications

-------------------------------------------------------
-- 1. CLIENT SHORTLISTS TABLE
-------------------------------------------------------
create table if not exists public.client_shortlists (
    id uuid primary key default gen_random_uuid(),
    client_id uuid not null references public.profiles(id) on delete cascade,
    model_id uuid not null references public.profiles(id) on delete cascade,
    created_at timestamptz not null default now(),
    unique(client_id, model_id)
);

create index if not exists idx_client_shortlists_client_id on public.client_shortlists(client_id);
create index if not exists idx_client_shortlists_model_id on public.client_shortlists(model_id);

-------------------------------------------------------
-- 2. NOTIFICATIONS TABLE
-------------------------------------------------------
create table if not exists public.notifications (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    title text not null,
    message text not null,
    read boolean not null default false,
    created_at timestamptz not null default now()
);

create index if not exists idx_notifications_user_id on public.notifications(user_id);

-------------------------------------------------------
-- ENABLE ROW LEVEL SECURITY
-------------------------------------------------------
alter table public.client_shortlists enable row level security;
alter table public.notifications enable row level security;

-------------------------------------------------------
-- RLS POLICIES FOR CLIENT SHORTLISTS
-------------------------------------------------------
create policy "Clients can view own shortlist"
on public.client_shortlists for select
using (client_id = public.get_current_profile_id() or public.is_admin());

create policy "Clients can insert own shortlist"
on public.client_shortlists for insert
with check (client_id = public.get_current_profile_id() or public.is_admin());

create policy "Clients can delete own shortlist"
on public.client_shortlists for delete
using (client_id = public.get_current_profile_id() or public.is_admin());

-------------------------------------------------------
-- RLS POLICIES FOR NOTIFICATIONS
-------------------------------------------------------
create policy "Users can view own notifications"
on public.notifications for select
using (user_id = public.get_current_profile_id() or public.is_admin());

create policy "System / Authenticated users can insert notifications"
on public.notifications for insert
with check (auth.role() = 'authenticated');

create policy "Users can update own notifications read status"
on public.notifications for update
using (user_id = public.get_current_profile_id() or public.is_admin());
