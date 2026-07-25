-- Stage 4: make the remaining hardcoded content editable - the "About Me"
-- highlight cards, the Languages list, and various site-wide strings
-- (footer, auth page copy, admin quick-links) that only ever lived in JSX.

-- ============================================================================
-- 1. personal_info.highlights - the 4 "About Me" feature cards were
--    hardcoded JSX with no admin control at all. Default preserves exactly
--    what's on the site today so nothing visually changes until edited.
-- ============================================================================

alter table public.personal_info add column if not exists highlights jsonb not null default '[
  {"icon": "Layers", "title": "FullStack Development", "description": "Strong foundation in web development, creating user-friendly and scalable web applications."},
  {"icon": "Palette", "title": "Design Thinking", "description": "Incorporating design principles and user-centric methodologies to create innovative solutions."},
  {"icon": "Monitor", "title": "UI/UX", "description": "Crafting intuitive and visually appealing interfaces, focusing on usability and responsive design."},
  {"icon": "GitBranch", "title": "Exploring Open Source", "description": "Rebuilding open-source projects and exploring new technologies to enhance development skills."}
]'::jsonb;

update public.personal_info set highlights = '[
  {"icon": "Layers", "title": "FullStack Development", "description": "Strong foundation in web development, creating user-friendly and scalable web applications."},
  {"icon": "Palette", "title": "Design Thinking", "description": "Incorporating design principles and user-centric methodologies to create innovative solutions."},
  {"icon": "Monitor", "title": "UI/UX", "description": "Crafting intuitive and visually appealing interfaces, focusing on usability and responsive design."},
  {"icon": "GitBranch", "title": "Exploring Open Source", "description": "Rebuilding open-source projects and exploring new technologies to enhance development skills."}
]'::jsonb
where highlights = '[]'::jsonb;

-- ============================================================================
-- 2. languages - was a hardcoded array in Profile.tsx (Telugu/English/Hindi),
--    now a real table with the same CRUD shape as skills/achievements.
-- ============================================================================

create table public.languages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  level text not null,
  proficiency integer not null default 50,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.languages enable row level security;

create policy "Languages viewable by everyone"
  on public.languages for select
  using (true);
-- No write policy - all writes go through the admin gateway (service role).

create trigger update_languages_updated_at
  before update on public.languages
  for each row execute function public.update_updated_at_column();

insert into public.languages (name, level, proficiency, order_index) values
  ('Telugu', 'Native', 100, 1),
  ('English', 'Fluent', 90, 2),
  ('Hindi', 'Conversational', 75, 3);

-- ============================================================================
-- 3. site_settings - a small key/value table for the strings that were
--    hardcoded across Layout.tsx (footer), Auth.tsx (brand copy), and
--    Navigation.tsx (the admin quick-links dropdown list).
-- ============================================================================

create table public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

create policy "Site settings viewable by everyone"
  on public.site_settings for select
  using (true);
-- No write policy - all writes go through the admin gateway (service role).

create trigger update_site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.update_updated_at_column();

insert into public.site_settings (key, value) values
  ('footer_text', '"Dileepadari"'),
  ('footer_github_url', '"https://github.com/dileepadari/portfolio"'),
  ('auth_title', '"Admin Sign In"'),
  ('auth_description', '"This is Dileep Adari''s portfolio. Only authorized users can access admin features."'),
  ('admin_quick_links', '[{"label": "WorkOs", "url": "https://workos.dileepadari.dev"}]');
