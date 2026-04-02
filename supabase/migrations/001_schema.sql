-- Little Adrspach Climbing Guide Schema

-- Walls
create table public.walls (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order int not null default 0,
  description text
);

-- Routes
create table public.routes (
  id uuid primary key default gen_random_uuid(),
  wall_id uuid not null references public.walls(id) on delete cascade,
  number text not null,
  name text not null,
  grade_yds text,
  grade_french text,
  height_ft int,
  protection text,
  first_ascent text,
  description text,
  sort_order int not null default 0
);

create index idx_routes_wall_id on public.routes(wall_id);
create index idx_routes_sort_order on public.routes(sort_order);

-- Wall images
create table public.wall_images (
  id uuid primary key default gen_random_uuid(),
  wall_id uuid not null references public.walls(id) on delete cascade,
  image_url text not null,
  image_type text not null default 'topo',
  sort_order int not null default 0
);

-- Profiles (extends auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

-- Ticks
create table public.ticks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  route_id uuid not null references public.routes(id) on delete cascade,
  ticked_at date not null default current_date,
  style text,
  notes text,
  created_at timestamptz not null default now(),
  unique(user_id, route_id, ticked_at)
);

create index idx_ticks_user_id on public.ticks(user_id);
create index idx_ticks_route_id on public.ticks(route_id);

-- Comments
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  route_id uuid not null references public.routes(id) on delete cascade,
  body text not null,
  rating int check (rating >= 1 and rating <= 5),
  created_at timestamptz not null default now()
);

create index idx_comments_route_id on public.comments(route_id);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', new.email));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS Policies
alter table public.walls enable row level security;
alter table public.routes enable row level security;
alter table public.wall_images enable row level security;
alter table public.profiles enable row level security;
alter table public.ticks enable row level security;
alter table public.comments enable row level security;

-- Public read for walls, routes, wall_images
create policy "walls_read" on public.walls for select using (true);
create policy "routes_read" on public.routes for select using (true);
create policy "wall_images_read" on public.wall_images for select using (true);

-- Profiles: public read, owner update
create policy "profiles_read" on public.profiles for select using (true);
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);

-- Ticks: public read, owner CRUD
create policy "ticks_read" on public.ticks for select using (true);
create policy "ticks_insert" on public.ticks for insert with check (auth.uid() = user_id);
create policy "ticks_update" on public.ticks for update using (auth.uid() = user_id);
create policy "ticks_delete" on public.ticks for delete using (auth.uid() = user_id);

-- Comments: public read, owner CUD
create policy "comments_read" on public.comments for select using (true);
create policy "comments_insert" on public.comments for insert with check (auth.uid() = user_id);
create policy "comments_update" on public.comments for update using (auth.uid() = user_id);
create policy "comments_delete" on public.comments for delete using (auth.uid() = user_id);
