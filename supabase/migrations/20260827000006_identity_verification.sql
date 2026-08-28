-- Migration: 20260827000006_identity_verification.sql
-- Description: Add identity verification columns to profiles table

-------------------------------------------------------
-- ADD IDENTITY VERIFICATION COLUMNS TO PROFILES
-------------------------------------------------------
alter table public.profiles
add column if not exists identity_verified boolean default false,
add column if not exists identity_verified_at timestamptz,
add column if not exists stripe_verification_session_id text;

create index if not exists idx_profiles_identity_verified on public.profiles(identity_verified);
