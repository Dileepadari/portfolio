-- Project detail pages: theme-aware imagery, a stored README, and the
-- structured fields the showcase renders.
--
-- Every column here is nullable and every section on the detail page is
-- conditional on its column being filled, so an existing project keeps working
-- and shows exactly the sections it has content for.

-- --------------------------------------------------------------------------
-- Identity
-- --------------------------------------------------------------------------

-- The detail page is addressed by slug, not id: /projects/lifebook reads better
-- than a UUID and survives the row being recreated.
alter table public.projects add column if not exists slug text;

-- Backfill from the title: lowercase, non-alphanumerics to hyphens, collapsed,
-- trimmed. Collisions get a numeric suffix so the unique index can be enforced.
with slugged as (
  select
    id,
    trim(both '-' from regexp_replace(lower(title), '[^a-z0-9]+', '-', 'g')) as base,
    row_number() over (
      partition by trim(both '-' from regexp_replace(lower(title), '[^a-z0-9]+', '-', 'g'))
      order by order_index, created_at
    ) as n
  from public.projects
  where slug is null
)
update public.projects p
set slug = case when s.n = 1 then s.base else s.base || '-' || s.n end
from slugged s
where p.id = s.id;

create unique index if not exists projects_slug_key on public.projects (slug);

-- --------------------------------------------------------------------------
-- Theme-aware imagery
-- --------------------------------------------------------------------------
-- Each image is a pair. The `_light` column is what a light-theme viewer sees;
-- when it is null the dark one is used for both, so a project with a single
-- theme-neutral screenshot needs no extra work.

alter table public.projects add column if not exists image_url_light text;
alter table public.projects add column if not exists hero_url text;
alter table public.projects add column if not exists hero_url_light text;
alter table public.projects add column if not exists images_light text[];

-- --------------------------------------------------------------------------
-- Showcase content
-- --------------------------------------------------------------------------

-- Reader-facing.
alter table public.projects add column if not exists tagline text;
alter table public.projects add column if not exists overview text;
alter table public.projects add column if not exists problem text;
-- [{ "title": "...", "description": "...", "icon": "zap" }]
alter table public.projects add column if not exists features jsonb;
-- [{ "label": "Tests", "value": "176" }]
alter table public.projects add column if not exists metrics jsonb;

-- Developer-facing.
-- [{ "name": "React 18", "role": "Frontend" }]
alter table public.projects add column if not exists tech_stack jsonb;
alter table public.projects add column if not exists architecture text;
alter table public.projects add column if not exists getting_started text;
alter table public.projects add column if not exists readme text;
alter table public.projects add column if not exists docs_url text;
alter table public.projects add column if not exists demo_url text;
alter table public.projects add column if not exists project_role text;
alter table public.projects add column if not exists timeline text;
alter table public.projects add column if not exists status text;

comment on column public.projects.readme is
  'Markdown, authored in the admin UI. Not synced from GitHub: this is the
   curated version, and it has to work for contributed and private repos too.';

-- --------------------------------------------------------------------------
-- Uploadable personal assets
-- --------------------------------------------------------------------------
-- The resume was a build-time import of src/assets/portfolio.pdf, so replacing
-- it meant a commit and a deploy. It is a column now, with the bundled file as
-- the fallback when the column is empty.

alter table public.personal_info add column if not exists resume_url text;
