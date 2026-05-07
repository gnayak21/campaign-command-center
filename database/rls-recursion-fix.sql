-- Fix for: infinite recursion detected in policy for relation "workspace_members"
-- Run this once in the Supabase SQL editor.

drop policy if exists "Members can read their workspaces" on public.workspaces;
drop policy if exists "Owners can update workspaces" on public.workspaces;
drop policy if exists "Members can read workspace members" on public.workspace_members;
drop policy if exists "Owners can manage members" on public.workspace_members;
drop policy if exists "Owners can add members" on public.workspace_members;
drop policy if exists "Owners can remove members" on public.workspace_members;
drop policy if exists "Members can read campaigns" on public.campaigns;
drop policy if exists "Owners and editors can create campaigns" on public.campaigns;
drop policy if exists "Owners editors reviewers can update campaigns" on public.campaigns;

create or replace function public.is_workspace_member(target_workspace_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = target_workspace_id
    and wm.email = auth.jwt() ->> 'email'
  );
$$;

create or replace function public.has_workspace_role(target_workspace_id uuid, allowed_roles text[])
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = target_workspace_id
    and wm.email = auth.jwt() ->> 'email'
    and wm.role = any(allowed_roles)
  );
$$;

create policy "Members can read their workspaces"
  on public.workspaces for select
  using (public.is_workspace_member(id));

create policy "Owners can update workspaces"
  on public.workspaces for update
  using (public.has_workspace_role(id, array['Owner']));

create policy "Members can read workspace members"
  on public.workspace_members for select
  using (public.is_workspace_member(workspace_id));

create policy "Owners can manage members"
  on public.workspace_members for update
  using (public.has_workspace_role(workspace_id, array['Owner']));

create policy "Owners can add members"
  on public.workspace_members for insert
  with check (public.has_workspace_role(workspace_id, array['Owner']));

create policy "Owners can remove members"
  on public.workspace_members for delete
  using (public.has_workspace_role(workspace_id, array['Owner']));

create policy "Members can read campaigns"
  on public.campaigns for select
  using (public.is_workspace_member(workspace_id));

create policy "Owners and editors can create campaigns"
  on public.campaigns for insert
  with check (
    auth.uid() = created_by
    and public.has_workspace_role(workspace_id, array['Owner', 'Editor'])
  );

create policy "Owners editors reviewers can update campaigns"
  on public.campaigns for update
  using (public.has_workspace_role(workspace_id, array['Owner', 'Editor', 'Reviewer']));
