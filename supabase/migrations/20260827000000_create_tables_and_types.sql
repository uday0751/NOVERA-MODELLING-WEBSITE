-- Migration: 20260827000000_create_tables_and_types.sql
-- Description: Core schema definition for Alvore Modeling Agency Platform

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-------------------------------------------------------
-- 1. PROFILES TABLE
-------------------------------------------------------
create table if not exists public.profiles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null unique references auth.users(id) on delete cascade,
    role text not null check (role in ('model', 'client', 'admin')),
    full_name text not null,
    email text not null,
    phone text,
    status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'suspended')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Index for user lookup
create index if not exists idx_profiles_user_id on public.profiles(user_id);
create index if not exists idx_profiles_role_status on public.profiles(role, status);

-------------------------------------------------------
-- 2. MODEL DETAILS TABLE
-------------------------------------------------------
create table if not exists public.model_details (
    profile_id uuid primary key references public.profiles(id) on delete cascade,
    height numeric(5,2), -- in cm or inches
    weight numeric(5,2), -- in kg or lbs
    bust numeric(5,2),
    waist numeric(5,2),
    hips numeric(5,2),
    shoe_size numeric(4,1),
    hair_color text,
    eye_color text,
    ethnicity text,
    languages text[] default '{}',
    categories text[] default '{}', -- fashion, commercial, fitness, kids, runway, promo
    tattoos boolean not null default false,
    piercings boolean not null default false,
    bio text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-------------------------------------------------------
-- 3. MODEL MEDIA TABLE
-------------------------------------------------------
create table if not exists public.model_media (
    id uuid primary key default gen_random_uuid(),
    model_id uuid not null references public.profiles(id) on delete cascade,
    url text not null,
    type text not null check (type in ('photo', 'video')),
    category text not null check (category in ('headshot', 'full_body', 'profile', 'editorial', 'reel')),
    sort_order integer not null default 0,
    created_at timestamptz not null default now()
);

create index if not exists idx_model_media_model_id on public.model_media(model_id);

-------------------------------------------------------
-- 4. MODEL RATES TABLE
-------------------------------------------------------
create table if not exists public.model_rates (
    model_id uuid primary key references public.profiles(id) on delete cascade,
    hourly_rate numeric(10,2),
    half_day_rate numeric(10,2),
    full_day_rate numeric(10,2),
    currency text not null default 'USD',
    updated_at timestamptz not null default now()
);

-------------------------------------------------------
-- 5. MODEL AVAILABILITY TABLE
-------------------------------------------------------
create table if not exists public.model_availability (
    id uuid primary key default gen_random_uuid(),
    model_id uuid not null references public.profiles(id) on delete cascade,
    date date not null,
    is_available boolean not null default true,
    created_at timestamptz not null default now(),
    unique(model_id, date)
);

create index if not exists idx_model_availability_model_date on public.model_availability(model_id, date);

-------------------------------------------------------
-- 6. CLIENTS TABLE
-------------------------------------------------------
create table if not exists public.clients (
    profile_id uuid primary key references public.profiles(id) on delete cascade,
    company_name text not null,
    industry text,
    verified boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-------------------------------------------------------
-- 7. BOOKINGS TABLE
-------------------------------------------------------
create table if not exists public.bookings (
    id uuid primary key default gen_random_uuid(),
    model_id uuid not null references public.profiles(id) on delete cascade,
    client_id uuid not null references public.profiles(id) on delete cascade,
    status text not null default 'requested' check (status in ('requested', 'accepted', 'declined', 'completed', 'cancelled')),
    date date not null,
    location text not null,
    project_type text,
    brief text,
    budget numeric(10,2),
    usage_rights text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_bookings_model_id on public.bookings(model_id);
create index if not exists idx_bookings_client_id on public.bookings(client_id);
create index if not exists idx_bookings_status on public.bookings(status);

-------------------------------------------------------
-- 8. MESSAGES TABLE
-------------------------------------------------------
create table if not exists public.messages (
    id uuid primary key default gen_random_uuid(),
    booking_id uuid not null references public.bookings(id) on delete cascade,
    sender_id uuid not null references public.profiles(id) on delete cascade,
    content text not null,
    read boolean not null default false,
    created_at timestamptz not null default now()
);

create index if not exists idx_messages_booking_id on public.messages(booking_id);

-------------------------------------------------------
-- 9. REVIEWS TABLE
-------------------------------------------------------
create table if not exists public.reviews (
    id uuid primary key default gen_random_uuid(),
    booking_id uuid not null references public.bookings(id) on delete cascade,
    reviewer_id uuid not null references public.profiles(id) on delete cascade,
    reviewee_id uuid not null references public.profiles(id) on delete cascade,
    rating integer not null check (rating >= 1 and rating <= 5),
    comment text,
    created_at timestamptz not null default now(),
    unique(booking_id, reviewer_id)
);

create index if not exists idx_reviews_reviewee_id on public.reviews(reviewee_id);

-------------------------------------------------------
-- 10. CASTING CALLS TABLE
-------------------------------------------------------
create table if not exists public.casting_calls (
    id uuid primary key default gen_random_uuid(),
    client_id uuid not null references public.profiles(id) on delete cascade,
    title text not null,
    description text not null,
    category text,
    location text,
    date date,
    budget numeric(10,2),
    status text not null default 'open' check (status in ('open', 'closed')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_casting_calls_client_id on public.casting_calls(client_id);
create index if not exists idx_casting_calls_status on public.casting_calls(status);

-------------------------------------------------------
-- 11. CASTING APPLICATIONS TABLE
-------------------------------------------------------
create table if not exists public.casting_applications (
    id uuid primary key default gen_random_uuid(),
    casting_call_id uuid not null references public.casting_calls(id) on delete cascade,
    model_id uuid not null references public.profiles(id) on delete cascade,
    status text not null default 'applied' check (status in ('applied', 'shortlisted', 'rejected', 'accepted')),
    applied_at timestamptz not null default now(),
    unique(casting_call_id, model_id)
);

create index if not exists idx_casting_apps_call_id on public.casting_applications(casting_call_id);
create index if not exists idx_casting_apps_model_id on public.casting_applications(model_id);

-------------------------------------------------------
-- TRIGGERS & FUNCTIONS
-------------------------------------------------------

-- 1. Function to handle new user signup and create profile
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id, role, full_name, email, status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'model'),
    coalesce(new.raw_user_meta_data->>'full_name', coalesce(new.email, 'New User')),
    new.email,
    'pending'
  );
  return new;
end;
$$;

-- Trigger to execute on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. Function to enforce review insertion only for completed bookings
create or replace function public.enforce_completed_booking_for_review()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_booking_status text;
  v_model_id uuid;
  v_client_id uuid;
begin
  select status, model_id, client_id 
  into v_booking_status, v_model_id, v_client_id
  from public.bookings
  where id = new.booking_id;

  if v_booking_status is null or v_booking_status != 'completed' then
    raise exception 'Reviews can only be created for bookings with status = completed.';
  end if;

  -- Ensure reviewer is either the model or client involved in the booking
  if new.reviewer_id != v_model_id and new.reviewer_id != v_client_id then
    raise exception 'Reviewer must be a participant in the linked completed booking.';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_check_review_booking on public.reviews;
create trigger trg_check_review_booking
  before insert on public.reviews
  for each row execute function public.enforce_completed_booking_for_review();

-- 3. Function to restrict profile.status modification to admins only
create or replace function public.protect_profile_status_update()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_caller_role text;
begin
  if old.status is distinct from new.status then
    select role into v_caller_role
    from public.profiles
    where user_id = auth.uid();

    if v_caller_role is null or v_caller_role != 'admin' then
      raise exception 'Only administrators can update profile status.';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_protect_profile_status on public.profiles;
create trigger trg_protect_profile_status
  before update on public.profiles
  for each row execute function public.protect_profile_status_update();
