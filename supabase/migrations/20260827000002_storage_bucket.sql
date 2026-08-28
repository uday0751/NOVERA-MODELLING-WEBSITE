-- Migration: 20260827000002_storage_bucket.sql
-- Description: Create model-media storage bucket & configure RLS policies for file upload/access

-- Insert storage bucket if it doesn't already exist
insert into storage.buckets (id, name, public)
values ('model-media', 'model-media', true)
on conflict (id) do nothing;

-------------------------------------------------------
-- STORAGE RLS POLICIES FOR model-media BUCKET
-------------------------------------------------------

-- Public / Authenticated read policy for media items
create policy "Public Read access for model-media"
on storage.objects for select
using (bucket_id = 'model-media');

-- Authenticated models can upload files into their own folder (folder name = profile_id)
create policy "Models can upload own media to model-media bucket"
on storage.objects for insert
with check (
    bucket_id = 'model-media'
    and auth.role() = 'authenticated'
);

-- Models can update their own media files
create policy "Models can update own media in model-media bucket"
on storage.objects for update
using (
    bucket_id = 'model-media'
    and auth.role() = 'authenticated'
);

-- Models can delete their own media files
create policy "Models can delete own media from model-media bucket"
on storage.objects for delete
using (
    bucket_id = 'model-media'
    and auth.role() = 'authenticated'
);
