-- Campaign Command Center Supabase schema
-- Run this in the Supabase SQL editor after creating your project.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  workspace_type text not null default 'Client workspace',
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null,
  role text not null check (role in ('Owner', 'Editor', 'Reviewer', 'Viewer')),
  focus text not null default 'Team member',
  created_at timestamptz not null default now(),
  unique (workspace_id, email)
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  campaign_name text not null,
  brand text not null,
  product text not null,
  objective text not null,
  audience text not null,
  campaign_owner text,
  campaign_status text not null check (campaign_status in ('Draft', 'Review', 'Approved', 'Launched')),
  budget numeric not null,
  start_date date,
  end_date date,
  landing_page text,
  region text,
  tone text,
  constraints text,
  review_notes text,
  channels text[] not null default '{}',
  created_by uuid not null references auth.users(id) on delete cascade,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.campaigns enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can upsert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Members can read their workspaces"
  on public.workspaces for select
  using (
    exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = workspaces.id
      and wm.email = auth.jwt() ->> 'email'
    )
  );

create policy "Authenticated users can create workspaces"
  on public.workspaces for insert
  with check (auth.uid() = created_by);

create policy "Owners can update workspaces"
  on public.workspaces for update
  using (
    exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = workspaces.id
      and wm.email = auth.jwt() ->> 'email'
      and wm.role = 'Owner'
    )
  );

create policy "Members can read workspace members"
  on public.workspace_members for select
  using (
    exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = workspace_members.workspace_id
      and wm.email = auth.jwt() ->> 'email'
    )
  );

create policy "Workspace creators can add initial members"
  on public.workspace_members for insert
  with check (
    exists (
      select 1 from public.workspaces w
      where w.id = workspace_members.workspace_id
      and w.created_by = auth.uid()
    )
  );

create policy "Owners can manage members"
  on public.workspace_members for update
  using (
    exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = workspace_members.workspace_id
      and wm.email = auth.jwt() ->> 'email'
      and wm.role = 'Owner'
    )
  );

create policy "Members can read campaigns"
  on public.campaigns for select
  using (
    exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = campaigns.workspace_id
      and wm.email = auth.jwt() ->> 'email'
    )
  );

create policy "Owners and editors can create campaigns"
  on public.campaigns for insert
  with check (
    auth.uid() = created_by
    and exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = campaigns.workspace_id
      and wm.email = auth.jwt() ->> 'email'
      and wm.role in ('Owner', 'Editor')
    )
  );

create policy "Owners editors reviewers can update campaigns"
  on public.campaigns for update
  using (
    exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = campaigns.workspace_id
      and wm.email = auth.jwt() ->> 'email'
      and wm.role in ('Owner', 'Editor', 'Reviewer')
    )
  );
