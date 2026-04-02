-- Create storage bucket for wall images
insert into storage.buckets (id, name, public)
values ('wall-images', 'wall-images', true);

-- Anyone can view images
create policy "wall_images_public_read"
on storage.objects for select
using (bucket_id = 'wall-images');

-- Authenticated users can upload (admin check happens in app)
create policy "wall_images_auth_insert"
on storage.objects for insert
with check (bucket_id = 'wall-images' and auth.role() = 'authenticated');

-- Authenticated users can delete their uploads
create policy "wall_images_auth_delete"
on storage.objects for delete
using (bucket_id = 'wall-images' and auth.role() = 'authenticated');

-- Allow authenticated users to insert/delete wall_images table rows (admin check in app)
create policy "wall_images_insert" on public.wall_images for insert
with check (auth.role() = 'authenticated');

create policy "wall_images_delete" on public.wall_images for delete
using (auth.role() = 'authenticated');

create policy "wall_images_update" on public.wall_images for update
using (auth.role() = 'authenticated');
