-- Stage 2: replace supabase.auth-based admin gating with a self-hosted
-- username/password admin system. All admin writes now go through the
-- `admin` Edge Function (service-role key, bypasses RLS) instead of RLS
-- policies keyed on auth.uid()/is_admin(). Public reads of actual portfolio
-- content are unaffected. Along the way, fixes two bugs found while
-- reviewing these policies: contact_messages had no public INSERT policy
-- at all (the contact form's anonymous submissions were likely silently
-- failing), and courses was writable by ANY authenticated user, not just
-- the admin.

-- ============================================================================
-- 1. admin_users: multiple admin accounts, hashed passwords. No RLS policies
--    at all — only the service-role key (used inside the Edge Function)
--    can ever touch this table.
-- ============================================================================

create table public.admin_users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password_hash text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  last_login_at timestamptz
);

alter table public.admin_users enable row level security;

-- ============================================================================
-- 2. Drop the supabase.auth signup bootstrap trigger — obsolete now that
--    Auth.tsx is a login-only form against admin_users, not auth.users.
-- ============================================================================

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- ============================================================================
-- 3. Revoke RLS write access that depended on auth.uid()/is_admin() for the
--    "portfolio content" tables — all writes now go through the Edge
--    Function's service-role client, which bypasses RLS regardless of these
--    policies. Public SELECT policies are untouched.
-- ============================================================================

drop policy if exists "Personal info editable by admin" on public.personal_info;
drop policy if exists "Education editable by admin" on public.education;
drop policy if exists "Experience editable by admin" on public.experience;
drop policy if exists "Projects editable by admin" on public.projects;
drop policy if exists "Skills editable by admin" on public.skills;
drop policy if exists "Achievements editable by admin" on public.achievements;

-- courses was actually gated by "any authenticated user", not admin — fix.
drop policy if exists "Allow authenticated users to modify courses" on public.courses;

-- ============================================================================
-- 4. blog_posts: drafts are no longer exposed to the anon role at all (the
--    is_admin(auth.uid()) clause is now meaningless — nobody authenticates
--    via supabase.auth). The admin editor's draft list now reads through
--    the Edge Function's service-role client instead.
-- ============================================================================

drop policy if exists "Blog posts editable by admin" on public.blog_posts;
drop policy if exists "Blog posts viewable by everyone" on public.blog_posts;
create policy "Published blog posts viewable by everyone"
  on public.blog_posts for select
  using (published = true);

-- ============================================================================
-- 5. tasks / schedules: this is a private task/schedule manager (Schedule.tsx
--    now requires admin login just to view the page, per Stage 1), not
--    public portfolio content. Lock down direct reads too, not just the UI —
--    all access (including the admin's own) goes through the Edge Function.
-- ============================================================================

drop policy if exists "Tasks editable by admin" on public.tasks;
drop policy if exists "Tasks viewable by everyone" on public.tasks;

drop policy if exists "Schedules editable by admin" on public.schedules;
drop policy if exists "Public schedules viewable by everyone" on public.schedules;
create policy "Public schedules viewable by everyone"
  on public.schedules for select
  using (is_public = true);

-- ============================================================================
-- 6. contact_messages: fix the missing public INSERT policy (the contact
--    form's anonymous submissions had no policy allowing them at all) and
--    move admin read/update/delete to the Edge Function instead of RLS.
-- ============================================================================

drop policy if exists "Contact messages editable by admin" on public.contact_messages;
create policy "Anyone can submit a contact message"
  on public.contact_messages for insert
  with check (true);

-- ============================================================================
-- 7. is_admin() is now unused by any policy — drop it.
-- ============================================================================

drop function if exists public.is_admin(uuid);
