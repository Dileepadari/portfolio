# Developer Guide

Setup, environment configuration, and deployment instructions for maintaining or redeploying this site. For a feature overview, see [README.md](./README.md).

## Prerequisites

- Node.js **>= 20.19** (the repo pins this in `package.json#engines` - `@tailwindcss/oxide`'s native binary requires it). Use [nvm](https://github.com/nvm-sh/nvm): `nvm install 22 && nvm use 22`.
- A [Supabase](https://supabase.com) project (Postgres + Edge Functions).
- The [Supabase CLI](https://supabase.com/docs/guides/cli) (`npx supabase ...` works without a global install).
- An Oracle Cloud (or any HTTP-reachable) object storage endpoint if you want image uploads to work - see [Oracle storage contract](#oracle-storage-contract) below. Not required to run the site; uploads will just fail until configured.

## 1. Clone and install

```sh
git clone https://github.com/Dileepadari/portfolio.git
cd portfolio
npm install
```

## 2. Environment variables

Copy `.env.example` to `.env` and fill in your Supabase project's values (Project Settings > API in the Supabase dashboard):

```sh
cp .env.example .env
```

```env
VITE_SUPABASE_URL="https://<your-project-ref>.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="<your anon/publishable key>"
VITE_SUPABASE_PROJECT_ID="<your-project-ref>"
```

These are the only client-side secrets - everything else (service-role key, JWT signing secret, Oracle upload key) lives server-side in the Edge Function and is never sent to the browser.

## 3. Link and migrate the database

```sh
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

This applies every file in `supabase/migrations/` in order. Current migrations, for reference:

| Migration | What it does |
|---|---|
| `20260725000001_stage1_cleanup_and_fixes.sql` | Drops unused tables/functions, fixes RLS gaps, adds visitor-scoped blog engagement |
| `20260725000002_stage2_custom_auth.sql` | Adds `admin_users`, locks direct client writes behind the Edge Function |
| `20260726000001_stage4_full_editability.sql` | Adds `personal_info.highlights`, `languages`, `site_settings` |
| `20260726000002_stage5_task_requests.sql` | Adds the structured `task_requests` table |
| `20260726000004_drop_diag_function.sql`, `20260726000006_fix_disabled_rls.sql`, `20260726000007_drop_diag_functions2.sql` | Production RLS fix + cleanup of temporary diagnostic functions |
| `20260726000008_drop_tasks_schedules.sql` | Removes the internal task/schedule manager tables (superseded by an external tracker) |

Re-run `supabase gen types typescript --linked > src/integrations/supabase/types.ts` after any schema change so the frontend types stay in sync.

## 4. Deploy the `admin` Edge Function

Every authenticated write, every admin-only read, and the image upload proxy go through one Edge Function (`supabase/functions/admin`):

```sh
npx supabase functions deploy admin
```

Set its secrets (never pass these as CLI arguments - use `secrets set` so they're not written to shell history):

```sh
npx supabase secrets set ADMIN_JWT_SECRET="$(openssl rand -hex 32)"

# Oracle object storage - see the contract below. Skip these if you don't
# need image uploads yet; the rest of the site works without them.
npx supabase secrets set ORACLE_UPLOAD_BASE_URL="https://your-upload-host"
npx supabase secrets set ORACLE_PUBLIC_BASE_URL="https://your-public-read-host"
npx supabase secrets set ORACLE_UPLOAD_API_KEY="your-upload-api-key"
npx supabase secrets set ORACLE_APP_NAME="portfolio"
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically into every Edge Function by Supabase - don't set those yourself.

`supabase/config.toml` sets `verify_jwt = false` for this function deliberately: it implements its own JWT scheme (checked against `admin_users`), so Supabase's platform-level "must have a Supabase-issued JWT" gate has to be off, or no request would ever reach the function's own auth check.

## 5. Create your first admin user

Multiple admins are supported - this can be run again later for additional accounts.

```sh
SUPABASE_URL="https://<your-project-ref>.supabase.co" \
SUPABASE_SERVICE_ROLE_KEY="<service-role key, from Project Settings > API>" \
ADMIN_BOOTSTRAP_USERNAME="youruser" \
ADMIN_BOOTSTRAP_PASSWORD="a strong password, 8+ chars" \
npm run create-admin
```

Env vars only, deliberately - the script refuses to read a username/password from `argv` so a password never ends up echoed in a shell history or process listing. Sign in at `/auth`.

## 6. Run it locally

```sh
npm run dev       # http://localhost:8080
npm run lint
npx tsc --noEmit
npm run build
npm run preview
```

CI (`.github/workflows/ci.yml`) runs `lint`, a type-check, and `build` on every push and pull request against `main`.

## Oracle storage contract

The Edge Function proxies uploads so the upload API key never reaches the browser. It expects:

- **Upload**: `POST {ORACLE_UPLOAD_BASE_URL}/upload` with headers `x-upload-key`, `x-file-type` (`images`|`documents`), `x-app-name`, `x-file-name`, and the raw file bytes as the body. Expected response: `{ success: true, url: "..." }`.
- **Public read**: the Edge Function builds the public URL itself from the known convention `{ORACLE_PUBLIC_BASE_URL}/{fileType}/{ORACLE_APP_NAME}/{fileName}` rather than trusting the upload response's `url` field.

Any HTTP storage service that implements the same contract works as a drop-in replacement - swap the three `ORACLE_*` secrets.

## Deployment

The frontend is a static Vite build with no server-side rendering, so it deploys to any static host:

```sh
npm run build   # outputs to dist/
```

Point Vercel, Netlify, Cloudflare Pages, or similar at this repo with build command `npm run build` and output directory `dist`, and set the three `VITE_*` environment variables from step 2 in that platform's dashboard. The Supabase Edge Function and database migrations are deployed independently via the Supabase CLI steps above - they aren't part of the static build.

---

## Data model: the project showcase

`/projects/:slug` renders from one row of `public.projects`. Every showcase
column is nullable and **its section is omitted when it is null**, so an
existing project keeps working and shows exactly what it has.

| Column | Half | Renders as |
|---|---|---|
| `slug` | - | The URL. Unique; backfilled from the title, derived on save when left blank |
| `tagline` | reader | The line under the title |
| `overview` | reader | Markdown section |
| `problem` | reader | Markdown section, "The problem" |
| `features` | reader | `[{title, description?, icon?}]`, a card grid |
| `metrics` | reader | `[{label, value}]`, the headline numbers strip |
| `images` / `images_light` | reader | The gallery, paired by position |
| `hero_url` / `hero_url_light` | reader | The banner |
| `image_url` / `image_url_light` | reader | The card image on `/projects` |
| `tech_stack` | developer | `[{name, role?}]` |
| `architecture` | developer | Markdown section |
| `getting_started` | developer | Markdown section |
| `readme` | developer | Markdown, in full, at the bottom |
| `docs_url` / `demo_url` | developer | Link buttons in the header |
| `project_role` / `timeline` / `status` | reader | Header metadata |

`readme` is **authored, not synced.** It is the curated copy, which is what
makes it work for contributed and private repositories, and it means nothing
here makes a network call to GitHub at render time.

### The dark/light pairing rule

Each `_light` column is optional. `pickThemedSource()` in `src/lib/themedSource.ts`
resolves it: a light viewer prefers `light` and settles for `dark`, a dark
viewer does the reverse, and the fallback is reached only when neither exists.
So a one-sided pair renders that side in both themes rather than falling through
to a placeholder.

Gallery arrays are paired **by index**: `images[n]` and `images_light[n]` are the
same screenshot. A shorter light array is a valid state, not an error; the
entries past its end fall back to their dark twins.

Resolution always goes through `useTheme().resolvedTheme`, never `theme`.
`theme` can be the literal string `"system"`, and the project cards used to
compare it against `"dark"`/`"light"` directly, which meant every visitor who had
never touched the toggle matched neither branch.

## Performance

The landing page is the only route in the entry chunk. Everything else is
`React.lazy`, each with its own skeleton so the layout does not jump when the
chunk lands.

Three things are deliberately deferred and should stay that way:

- **The markdown stack** (`react-markdown` + `rehype-highlight` + highlight.js,
  around 500kB) is behind `LazyMarkdown`. A project with no README, no overview
  and no architecture notes never downloads a markdown parser to discover that.
- **Syntax-highlight auto-detection is restricted to a language subset.**
  `rehype-highlight` otherwise runs *every* registered grammar over every
  untagged code block and scores the results; lowlight registers around 190. A
  README with a handful of untagged blocks was enough to lock the renderer.
- **The README block is `content-visibility: auto`** with an intrinsic size, so
  the browser skips its layout and paint entirely until it is near the viewport.
  It is the longest thing on the page and always at the bottom.

CI fails the build if the entry chunk passes 1.1MB. It is a tripwire against a
new route being imported eagerly, not a budget to spend.

## Tests

`npm test`, 42 tests, jsdom, no network.

`src/test/setup.ts` stubs `matchMedia` and `IntersectionObserver`, which jsdom
does not implement and which `ThemeProvider` and the Projects page read on
mount. A component that throws on mount fails every test for the same
uninformative reason, so both are stubbed globally rather than per test.

| File | Covers |
|---|---|
| `lib/themedSource.test.ts` | The pair-resolution matrix, including one-sided pairs and empty strings |
| `components/ThemedImage.test.tsx` | Theme resolution including `"system"`, lazy vs eager, the broken-URL fallback and that it does not loop |
| `components/ProjectGallery.test.tsx` | Index pairing, short light lists, and the lightbox: open, wrap, keyboard, scroll lock |
| `pages/ProjectDetail.test.tsx` | Section omission: nothing filled, some filled, whitespace-only, empty arrays, and the 404 |
| `hooks/useDocumentMeta.test.tsx` | Per-page title and description, and restoring them on unmount |

The assertion worth keeping if the rest were deleted is
`shows no section headings at all when nothing is filled in`. Nothing crashes
when a heading renders above nothing, so that behaviour would rot silently.

## Migrations

`supabase/migrations/` now begins with `20260724000000_baseline.sql`, which
creates the twelve tables that were previously made through the Lovable/Supabase
dashboard and existed only on the hosted project.

Before it, the chain started by altering `public.projects`, so `supabase start`
failed on the very first migration and **no environment could be built from
source**. The baseline is reconstructed from `src/integrations/supabase/types.ts`
and presents the *pre-stage-1* shape (`is_private` not `is_contributed`,
`blog_likes.user_ip` not `visitor_id`, `tasks`/`schedules` still present) so the
existing migrations replay truthfully on top of it.

Every statement is `if not exists`, so applying it to the hosted project is a
no-op. The `migrations` CI job runs the whole chain from nothing on every push,
which is what stops this regressing.

**The showcase columns are not on the hosted project yet.** Run `npm run db:push`
or apply `20260910000001_project_showcase.sql` before deploying this code, or
`/projects/:slug` will 404 on every project.
