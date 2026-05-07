-- Profile and team settings support.
-- Run this once in the Supabase SQL editor after the original schema.

alter table public.profiles
add column if not exists focus text;

drop policy if exists "Owners can add members" on public.workspace_members;
drop policy if exists "Owners can remove members" on public.workspace_members;

create policy "Owners can add members"
  on public.workspace_members for insert
  with check (public.has_workspace_role(workspace_id, array['Owner']));

create policy "Owners can remove members"
  on public.workspace_members for delete
  using (public.has_workspace_role(workspace_id, array['Owner']));
