-- Topo maps: drawing overlays on wall images
create table public.topo_maps (
  id uuid primary key default gen_random_uuid(),
  wall_id uuid not null references public.walls(id) on delete cascade,
  wall_image_id uuid not null references public.wall_images(id) on delete cascade,
  drawing_data jsonb not null default '{"lines":[],"labels":[]}',
  image_width int not null,
  image_height int not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_topo_maps_wall_id on public.topo_maps(wall_id);
create unique index idx_topo_maps_wall_image on public.topo_maps(wall_image_id);

-- RLS
alter table public.topo_maps enable row level security;

create policy "topo_maps_read" on public.topo_maps for select using (true);
create policy "topo_maps_insert" on public.topo_maps for insert
  with check (auth.role() = 'authenticated');
create policy "topo_maps_update" on public.topo_maps for update
  using (auth.role() = 'authenticated');
create policy "topo_maps_delete" on public.topo_maps for delete
  using (auth.role() = 'authenticated');
