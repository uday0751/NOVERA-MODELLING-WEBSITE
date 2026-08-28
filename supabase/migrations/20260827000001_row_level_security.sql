-- Migration: 20260827000001_row_level_security.sql
-- Description: Row Level Security (RLS) policies for Alvore Modeling Agency Platform

-------------------------------------------------------
-- HELPER FUNCTIONS FOR RLS
-------------------------------------------------------

-- Get profile ID for current auth user
create or replace function public.get_current_profile_id()
returns uuid
language sql
security definer
stable
as $$
  select id from public.profiles where user_id = auth.uid();
$$;

-- Check if current auth user is admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid() and role = 'admin'
  );
$$;

-- Check if current profile has approved status
create or replace function public.is_model_approved(p_model_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = p_model_id and role = 'model' and status = 'approved'
  );
$$;

-------------------------------------------------------
-- ENABLE RLS ON ALL TABLES
-------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.model_details enable row level security;
alter table public.model_media enable row level security;
alter table public.model_rates enable row level security;
alter table public.model_availability enable row level security;
alter table public.clients enable row level security;
alter table public.bookings enable row level security;
alter table public.messages enable row level security;
alter table public.reviews enable row level security;
alter table public.casting_calls enable row level security;
alter table public.casting_applications enable row level security;

-------------------------------------------------------
-- 1. PROFILES POLICIES
-------------------------------------------------------

-- Users can read their own profile
create policy "Users can view own profile"
on public.profiles for select
using (user_id = auth.uid() or public.is_admin());

-- Approved model/client profiles are viewable by authenticated users
create policy "Authenticated users can view approved profiles"
on public.profiles for select
using (status = 'approved' and auth.role() = 'authenticated');

-- Users can insert their own profile during signup
create policy "Users can insert own profile"
on public.profiles for insert
with check (user_id = auth.uid());

-- Users can update their own profile (status changes restricted by trigger)
create policy "Users can update own profile"
on public.profiles for update
using (user_id = auth.uid() or public.is_admin());

-------------------------------------------------------
-- 2. MODEL DETAILS POLICIES
-------------------------------------------------------

-- Models can view & edit their own details; Clients can only see model data if model profile status = approved; Admins can see all
create policy "Read model_details policy"
on public.model_details for select
using (
    profile_id = public.get_current_profile_id()
    or public.is_model_approved(profile_id)
    or public.is_admin()
);

create policy "Models can insert own details"
on public.model_details for insert
with check (profile_id = public.get_current_profile_id() or public.is_admin());

create policy "Models can update own details"
on public.model_details for update
using (profile_id = public.get_current_profile_id() or public.is_admin());

create policy "Models can delete own details"
on public.model_details for delete
using (profile_id = public.get_current_profile_id() or public.is_admin());

-------------------------------------------------------
-- 3. MODEL MEDIA POLICIES
-------------------------------------------------------

create policy "Read model_media policy"
on public.model_media for select
using (
    model_id = public.get_current_profile_id()
    or public.is_model_approved(model_id)
    or public.is_admin()
);

create policy "Models can insert own media"
on public.model_media for insert
with check (model_id = public.get_current_profile_id() or public.is_admin());

create policy "Models can update own media"
on public.model_media for update
using (model_id = public.get_current_profile_id() or public.is_admin());

create policy "Models can delete own media"
on public.model_media for delete
using (model_id = public.get_current_profile_id() or public.is_admin());

-------------------------------------------------------
-- 4. MODEL RATES POLICIES
-------------------------------------------------------

create policy "Read model_rates policy"
on public.model_rates for select
using (
    model_id = public.get_current_profile_id()
    or public.is_model_approved(model_id)
    or public.is_admin()
);

create policy "Models can insert own rates"
on public.model_rates for insert
with check (model_id = public.get_current_profile_id() or public.is_admin());

create policy "Models can update own rates"
on public.model_rates for update
using (model_id = public.get_current_profile_id() or public.is_admin());

create policy "Models can delete own rates"
on public.model_rates for delete
using (model_id = public.get_current_profile_id() or public.is_admin());

-------------------------------------------------------
-- 5. MODEL AVAILABILITY POLICIES
-------------------------------------------------------

create policy "Read model_availability policy"
on public.model_availability for select
using (
    model_id = public.get_current_profile_id()
    or public.is_model_approved(model_id)
    or public.is_admin()
);

create policy "Models can insert own availability"
on public.model_availability for insert
with check (model_id = public.get_current_profile_id() or public.is_admin());

create policy "Models can update own availability"
on public.model_availability for update
using (model_id = public.get_current_profile_id() or public.is_admin());

create policy "Models can delete own availability"
on public.model_availability for delete
using (model_id = public.get_current_profile_id() or public.is_admin());

-------------------------------------------------------
-- 6. CLIENTS POLICIES
-------------------------------------------------------

create policy "Read clients policy"
on public.clients for select
using (
    profile_id = public.get_current_profile_id()
    or auth.role() = 'authenticated'
    or public.is_admin()
);

create policy "Clients can insert own client profile"
on public.clients for insert
with check (profile_id = public.get_current_profile_id() or public.is_admin());

create policy "Clients can update own client profile"
on public.clients for update
using (profile_id = public.get_current_profile_id() or public.is_admin());

-------------------------------------------------------
-- 7. BOOKINGS POLICIES
-------------------------------------------------------

-- Bookings visible to model or client involved, or admin
create policy "Participants can view bookings"
on public.bookings for select
using (
    model_id = public.get_current_profile_id()
    or client_id = public.get_current_profile_id()
    or public.is_admin()
);

-- Clients can create bookings
create policy "Clients can insert bookings"
on public.bookings for insert
with check (
    client_id = public.get_current_profile_id()
    or public.is_admin()
);

-- Participants can update bookings (status updates, details)
create policy "Participants can update bookings"
on public.bookings for update
using (
    model_id = public.get_current_profile_id()
    or client_id = public.get_current_profile_id()
    or public.is_admin()
);

-------------------------------------------------------
-- 8. MESSAGES POLICIES
-------------------------------------------------------

-- Messages only visible to participants of the linked booking
create policy "Booking participants can view messages"
on public.messages for select
using (
    exists (
        select 1 from public.bookings b
        where b.id = messages.booking_id
          and (b.model_id = public.get_current_profile_id() 
               or b.client_id = public.get_current_profile_id())
    )
    or public.is_admin()
);

-- Booking participants can send messages
create policy "Booking participants can insert messages"
on public.messages for insert
with check (
    sender_id = public.get_current_profile_id()
    and exists (
        select 1 from public.bookings b
        where b.id = messages.booking_id
          and (b.model_id = public.get_current_profile_id() 
               or b.client_id = public.get_current_profile_id())
    )
);

-------------------------------------------------------
-- 9. REVIEWS POLICIES
-------------------------------------------------------

-- Anyone authenticated can view reviews
create policy "Authenticated users can view reviews"
on public.reviews for select
using (auth.role() = 'authenticated');

-- Reviews can only be created by a user who has a booking with status = completed involving them
create policy "Participants of completed bookings can insert reviews"
on public.reviews for insert
with check (
    reviewer_id = public.get_current_profile_id()
    and exists (
        select 1 from public.bookings b
        where b.id = reviews.booking_id
          and b.status = 'completed'
          and (b.model_id = public.get_current_profile_id() 
               or b.client_id = public.get_current_profile_id())
    )
);

-------------------------------------------------------
-- 10. CASTING CALLS POLICIES
-------------------------------------------------------

-- Open casting calls are visible to authenticated models/clients/admins
create policy "Read casting_calls policy"
on public.casting_calls for select
using (
    client_id = public.get_current_profile_id()
    or status = 'open'
    or public.is_admin()
);

-- Clients can create casting calls
create policy "Clients can insert casting calls"
on public.casting_calls for insert
with check (client_id = public.get_current_profile_id() or public.is_admin());

-- Clients can update their own casting calls
create policy "Clients can update own casting calls"
on public.casting_calls for update
using (client_id = public.get_current_profile_id() or public.is_admin());

-- Clients can delete their own casting calls
create policy "Clients can delete own casting calls"
on public.casting_calls for delete
using (client_id = public.get_current_profile_id() or public.is_admin());

-------------------------------------------------------
-- 11. CASTING APPLICATIONS POLICIES
-------------------------------------------------------

-- Models can see their own applications; Clients can see applications for their casting calls; Admins see all
create policy "Read casting_applications policy"
on public.casting_applications for select
using (
    model_id = public.get_current_profile_id()
    or exists (
        select 1 from public.casting_calls cc
        where cc.id = casting_applications.casting_call_id
          and cc.client_id = public.get_current_profile_id()
    )
    or public.is_admin()
);

-- Models can apply to open casting calls
create policy "Models can insert casting applications"
on public.casting_applications for insert
with check (
    model_id = public.get_current_profile_id()
    and exists (
        select 1 from public.casting_calls cc
        where cc.id = casting_applications.casting_call_id
          and cc.status = 'open'
    )
);

-- Clients can update application status (e.g. shortlisted/rejected/accepted) for their casting calls; Models can withdraw
create policy "Update casting_applications policy"
on public.casting_applications for update
using (
    model_id = public.get_current_profile_id()
    or exists (
        select 1 from public.casting_calls cc
        where cc.id = casting_applications.casting_call_id
          and cc.client_id = public.get_current_profile_id()
    )
    or public.is_admin()
);
