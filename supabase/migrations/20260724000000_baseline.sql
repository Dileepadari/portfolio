-- Baseline schema.
--
-- **This migration did not exist.** The migration folder began at
-- `20260725000001_stage1_cleanup_and_fixes.sql`, which renames a column on
-- `public.projects` and assumes twelve tables that nothing in this repository
-- ever creates: they were made through the Lovable/Supabase dashboard and only
-- ever existed on the hosted project.
--
-- The consequence was that `supabase start` failed on the first migration with
-- `relation "public.projects" does not exist`. There was no way to stand up a
-- local database, which is why nothing in this repository has ever been tested
-- against one.
--
-- Reconstructed from `src/integrations/supabase/types.ts`, which is generated
-- from the live schema and is therefore the best surviving description of it.
-- Every statement is `if not exists`, so applying this to the hosted project is
-- a no-op and it is safe to run anywhere.
--
-- Timestamped before stage 1 so it sorts first.

create extension if not exists pgcrypto with schema public;

-- The updated_at trigger function. Every table with an updated_at column has a
-- trigger calling this, and later migrations attach it to new tables, so it has
-- to exist before them.
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.achievements (
  certificate_url text,
  created_at timestamptz default now() not null,
  date_achieved text,
  description text,
  id uuid primary key default gen_random_uuid(),
  order_index integer default 0,
  title text not null,
  updated_at timestamptz default now() not null
);

create table if not exists public.blog_comments (
  author_email text,
  author_name text not null,
  blog_post_id uuid not null,
  content text not null,
  created_at timestamptz default now() not null,
  id uuid primary key default gen_random_uuid(),
  is_approved boolean default false,
  parent_comment_id uuid,
  updated_at timestamptz default now() not null,
  user_id uuid
  -- visitor_id is added by stage 1.
);

create table if not exists public.blog_likes (
  blog_post_id uuid not null,
  created_at timestamptz default now() not null,
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  -- Pre-stage-1 shape. Stage 1 adds visitor_id, backfills it, drops user_ip
  -- and adds the unique constraint, so those columns must be in that state
  -- here for the chain to replay.
  user_ip text
);

create table if not exists public.blog_posts (
  content text not null,
  created_at timestamptz default now() not null,
  excerpt text,
  external_link text,
  id uuid primary key default gen_random_uuid(),
  image_url text,
  images text[],
  order_index integer default 0,
  published boolean default false,
  slug text not null,
  tags text[],
  title text not null,
  updated_at timestamptz default now() not null
);

create table if not exists public.contact_messages (
  created_at timestamptz default now() not null,
  email text not null,
  id uuid primary key default gen_random_uuid(),
  message text not null,
  name text not null,
  status text,
  subject text not null,
  updated_at timestamptz default now() not null
);

create table if not exists public.courses (
  certificate_url text,
  completion_date text,
  created_at timestamptz default now() not null,
  description text,
  id uuid primary key default gen_random_uuid(),
  institution text,
  is_favorite boolean default false,
  name text not null,
  order_index integer default 0,
  updated_at timestamptz default now() not null
);

create table if not exists public.education (
  coursework text[],
  created_at timestamptz default now() not null,
  degree text not null,
  description text,
  duration text not null,
  gpa text,
  id uuid primary key default gen_random_uuid(),
  institution text not null,
  location text,
  order_index integer default 0,
  updated_at timestamptz default now() not null
);

create table if not exists public.experience (
  company text not null,
  created_at timestamptz default now() not null,
  description text[],
  duration text not null,
  id uuid primary key default gen_random_uuid(),
  location text,
  order_index integer default 0,
  technologies text[],
  title text not null,
  updated_at timestamptz default now() not null
);

create table if not exists public.personal_info (
  avatar_url text,
  bio text not null,
  codeforces text,
  created_at timestamptz default now() not null,
  email text,
  github text,
  id uuid primary key default gen_random_uuid(),
  instagram text,
  linkedin text,
  location text,
  medium text,
  name text not null,
  phone text,
  title text not null,
  twitter text,
  updated_at timestamptz default now() not null,
  website text,
  youtube text
);

create table if not exists public.profiles (
  avatar_url text,
  created_at timestamptz default now() not null,
  email text,
  full_name text,
  id uuid primary key default gen_random_uuid(),
  is_admin boolean default false,
  updated_at timestamptz default now() not null,
  user_id uuid not null
);

create table if not exists public.projects (
  category text,
  created_at timestamptz default now() not null,
  description text not null,
  featured boolean default false not null,
  forks integer,
  github_url text,
  id uuid primary key default gen_random_uuid(),
  image_url text,
  images text[],
  is_private boolean default false,
  language text,
  language_color text,
  live_url text,
  order_index integer default 0 not null,
  stars integer,
  tags text[],
  title text not null,
  updated_at timestamptz default now() not null
);

create table if not exists public.skills (
  category text not null,
  created_at timestamptz default now() not null,
  icon_url text,
  id uuid primary key default gen_random_uuid(),
  order_index integer default 0,
  proficiency integer,
  skill_name text not null,
  updated_at timestamptz default now() not null
);


-- Attach it to every table that carries updated_at.
drop trigger if exists update_achievements_updated_at on public.achievements;
create trigger update_achievements_updated_at
  before update on public.achievements
  for each row execute function public.update_updated_at_column();
drop trigger if exists update_blog_comments_updated_at on public.blog_comments;
create trigger update_blog_comments_updated_at
  before update on public.blog_comments
  for each row execute function public.update_updated_at_column();
drop trigger if exists update_blog_posts_updated_at on public.blog_posts;
create trigger update_blog_posts_updated_at
  before update on public.blog_posts
  for each row execute function public.update_updated_at_column();
drop trigger if exists update_contact_messages_updated_at on public.contact_messages;
create trigger update_contact_messages_updated_at
  before update on public.contact_messages
  for each row execute function public.update_updated_at_column();
drop trigger if exists update_courses_updated_at on public.courses;
create trigger update_courses_updated_at
  before update on public.courses
  for each row execute function public.update_updated_at_column();
drop trigger if exists update_education_updated_at on public.education;
create trigger update_education_updated_at
  before update on public.education
  for each row execute function public.update_updated_at_column();
drop trigger if exists update_experience_updated_at on public.experience;
create trigger update_experience_updated_at
  before update on public.experience
  for each row execute function public.update_updated_at_column();
drop trigger if exists update_personal_info_updated_at on public.personal_info;
create trigger update_personal_info_updated_at
  before update on public.personal_info
  for each row execute function public.update_updated_at_column();
drop trigger if exists update_profiles_updated_at on public.profiles;
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at_column();
drop trigger if exists update_projects_updated_at on public.projects;
create trigger update_projects_updated_at
  before update on public.projects
  for each row execute function public.update_updated_at_column();
drop trigger if exists update_skills_updated_at on public.skills;
create trigger update_skills_updated_at
  before update on public.skills
  for each row execute function public.update_updated_at_column();

-- --------------------------------------------------------------------------
-- Tables that existed then and do not now
-- --------------------------------------------------------------------------
-- `tasks` and `schedules` backed the built-in task manager. Stage 2 alters
-- their policies and `20260726000008` drops them, so they have to exist here
-- for the chain to replay even though nothing uses them at HEAD. Minimal
-- shapes: only the columns the intervening migrations actually touch.

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now() not null
);

create table if not exists public.schedules (
  id uuid primary key default gen_random_uuid(),
  -- Stage 2 writes a policy over this column before the table is dropped.
  is_public boolean default false,
  created_at timestamptz default now() not null
);

alter table public.tasks     enable row level security;
alter table public.schedules enable row level security;

-- --------------------------------------------------------------------------
-- Keys and indexes the application relies on
-- --------------------------------------------------------------------------

create unique index if not exists blog_posts_slug_key on public.blog_posts (slug);

create index if not exists blog_comments_post_idx on public.blog_comments (blog_post_id);
create index if not exists projects_order_idx on public.projects (order_index);

-- --------------------------------------------------------------------------
-- Row level security
-- --------------------------------------------------------------------------
-- Every write goes through the `admin` edge function on the service role, so
-- the anon key needs read access to the public content and nothing else. The
-- later migrations refine these; this only establishes that RLS is on, because
-- a table created without it is readable *and writable* by anon.

alter table public.achievements     enable row level security;
alter table public.blog_comments    enable row level security;
alter table public.blog_likes       enable row level security;
alter table public.blog_posts       enable row level security;
alter table public.contact_messages enable row level security;
alter table public.courses          enable row level security;
alter table public.education        enable row level security;
alter table public.experience       enable row level security;
alter table public.personal_info    enable row level security;
alter table public.profiles         enable row level security;
alter table public.projects         enable row level security;
alter table public.skills           enable row level security;
