-- Migration: 20260827000005_payments_and_stripe_connect.sql
-- Description: Add Stripe Connect columns to profiles and create payments table

-------------------------------------------------------
-- 1. ADD STRIPE COLUMNS TO PROFILES
-------------------------------------------------------
alter table public.profiles
add column if not exists stripe_account_id text,
add column if not exists stripe_onboarding_completed boolean default false;

-------------------------------------------------------
-- 2. PAYMENTS TABLE
-------------------------------------------------------
create table if not exists public.payments (
    id uuid primary key default gen_random_uuid(),
    booking_id uuid not null references public.bookings(id) on delete cascade,
    amount numeric(10, 2) not null check (amount >= 0),
    platform_fee numeric(10, 2) not null default 0 check (platform_fee >= 0),
    status text not null check (status in ('held', 'released', 'refunded')),
    stripe_payment_intent_id text,
    stripe_transfer_id text,
    created_at timestamptz not null default now()
);

create index if not exists idx_payments_booking_id on public.payments(booking_id);
create index if not exists idx_payments_status on public.payments(status);

-------------------------------------------------------
-- ENABLE ROW LEVEL SECURITY
-------------------------------------------------------
alter table public.payments enable row level security;

-------------------------------------------------------
-- RLS POLICIES FOR PAYMENTS
-------------------------------------------------------
-- Models, Clients, and Admins can view payments associated with their bookings
create policy "Booking participants can view payments"
on public.payments for select
using (
    exists (
        select 1 from public.bookings b
        where b.id = payments.booking_id
        and (
            b.model_id = public.get_current_profile_id()
            or b.client_id = public.get_current_profile_id()
        )
    )
    or public.is_admin()
);

-- Payments can be created or updated by admins or service role
create policy "Service role and admins manage payments"
on public.payments for all
using (
    public.is_admin()
    or auth.role() = 'service_role'
);
