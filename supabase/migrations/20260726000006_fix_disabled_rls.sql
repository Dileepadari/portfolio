-- CRITICAL FIX: row level security was disabled entirely on `projects` and
-- `contact_messages` — a pre-existing condition (not something any prior
-- migration in this repo touched; RLS enable/disable is a separate switch
-- from the policies themselves, and these two tables' policies existed but
-- were never being enforced at all). This was discovered during final
-- verification: the anon key could read every contact form submission and
-- write arbitrary changes to any project.

-- projects is missing its public-read policy entirely — at some point it
-- was reduced to just one leftover dashboard-generated policy ("Enable
-- insert for authenticated users only", role dashboard_user, irrelevant to
-- this app). With RLS disabled that didn't matter; turning RLS on without
-- restoring public read would take down every visitor-facing project page.
create policy "Projects viewable by everyone"
  on public.projects for select
  using (true);

-- contact_messages already has the correct policy (public insert only,
-- admin-only read/update/delete via the gateway) — just wasn't enforced.

alter table public.projects enable row level security;
alter table public.contact_messages enable row level security;
