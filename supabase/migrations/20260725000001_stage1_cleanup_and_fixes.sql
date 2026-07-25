-- Stage 1: dead-table cleanup, rename misleading column, fix anonymous
-- blog like/comment scoping (was unscoped / partially broken).

-- ============================================================================
-- 1. Drop tables confirmed unused by the frontend (Timeline feature deleted,
--    quick-actions/templates/dependencies features never built).
-- ============================================================================

drop function if exists public.create_quick_task(uuid, jsonb);
drop function if exists public.generate_recurring_events(uuid, jsonb, timestamptz);

drop table if exists public.task_dependencies cascade;
drop table if exists public.task_templates cascade;
drop table if exists public.schedule_templates cascade;
drop table if exists public.quick_actions cascade;
drop table if exists public.notifications cascade;
drop table if exists public.timeline_events cascade;

-- ============================================================================
-- 2. projects.is_private was semantically backwards (it actually means
--    "not owned by me / contributed to", not an access-control flag).
-- ============================================================================

alter table public.projects rename column is_private to is_contributed;

-- ============================================================================
-- 3. blog_likes: replace the auth.uid()/user_ip dual-column scheme (which
--    silently failed its own CHECK constraint for anonymous inserts, since
--    the client sent user_id: null without ever setting user_ip) with a
--    single client-generated visitor_id, so like/unlike is scoped per
--    browser instead of being global across every visitor.
-- ============================================================================

alter table public.blog_likes add column visitor_id text;

update public.blog_likes set visitor_id = coalesce(user_id::text, 'legacy-' || id::text)
where visitor_id is null;

alter table public.blog_likes alter column visitor_id set not null;

-- Must drop the old policy before dropping the column it references.
drop policy if exists "Users can unlike their own likes" on public.blog_likes;
alter table public.blog_likes drop constraint if exists check_user_or_ip;
alter table public.blog_likes drop column if exists user_ip;
alter table public.blog_likes add constraint blog_likes_post_visitor_unique unique (blog_post_id, visitor_id);

create policy "Visitors can unlike their own likes"
  on public.blog_likes for delete
  using (visitor_id = (current_setting('request.headers', true)::json ->> 'x-visitor-id'));
-- The client sends its locally-generated visitor UUID as an `x-visitor-id`
-- request header (see src/lib/visitor.ts / integrations/supabase/client.ts);
-- PostgREST exposes all request headers to RLS via request.headers even for
-- unauthenticated anon-key requests, so this really does scope delete to the
-- caller's own like rather than trusting the client not to pass someone
-- else's blog_post_id/visitor_id pair.

-- ============================================================================
-- 4. blog_comments: add the same visitor_id concept so anonymous commenters
--    can delete their own comments (previously impossible — ownership was
--    keyed on auth.uid() = user_id, which anonymous commenters never have).
-- ============================================================================

alter table public.blog_comments add column if not exists visitor_id text;

drop policy if exists "Users can delete their own comments" on public.blog_comments;
drop policy if exists "Users can update their own comments" on public.blog_comments;
-- (No public UPDATE policy: nothing in the app lets a visitor edit a posted
-- comment today, so there's no reason to open that surface up. Admin
-- moderation — approving/deleting any comment regardless of ownership — is
-- handled by the centralized admin-data Edge Function introduced in Stage 2,
-- which uses the service-role key and bypasses RLS entirely.)

create policy "Visitors can delete their own comments"
  on public.blog_comments for delete
  using (visitor_id = (current_setting('request.headers', true)::json ->> 'x-visitor-id'));
-- Same request-header mechanism as blog_likes above.
