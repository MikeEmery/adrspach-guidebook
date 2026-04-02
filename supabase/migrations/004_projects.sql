-- Project list (routes users want to try)
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  route_id uuid not null references public.routes(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, route_id)
);

create index idx_projects_user_id on public.projects(user_id);
create index idx_projects_route_id on public.projects(route_id);

-- RLS
alter table public.projects enable row level security;
create policy "projects_read" on public.projects for select using (true);
create policy "projects_insert" on public.projects for insert with check (auth.uid() = user_id);
create policy "projects_delete" on public.projects for delete using (auth.uid() = user_id);
