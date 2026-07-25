# Developer Guide

Setup, environment configuration, and deployment instructions for maintaining or redeploying this site. For a feature overview, see [README.md](./README.md).

## Prerequisites

- Node.js **>= 20.19** (the repo pins this in `package.json#engines` — `@tailwindcss/oxide`'s native binary requires it). Use [nvm](https://github.com/nvm-sh/nvm): `nvm install 22 && nvm use 22`.
- A [Supabase](https://supabase.com) project (Postgres + Edge Functions).
- The [Supabase CLI](https://supabase.com/docs/guides/cli) (`npx supabase ...` works without a global install).
- An Oracle Cloud (or any HTTP-reachable) object storage endpoint if you want image uploads to work — see [Oracle storage contract](#oracle-storage-contract) below. Not required to run the site; uploads will just fail until configured.

## 1. Clone and install

```sh
git clone https://github.com/Dileepadari/portfolio.git
cd portfolio
npm install
```

## 2. Environment variables

Copy `.env.example` to `.env` and fill in your Supabase project's values (Project Settings → API in the Supabase dashboard):

```sh
cp .env.example .env
```

```env
VITE_SUPABASE_URL="https://<your-project-ref>.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="<your anon/publishable key>"
VITE_SUPABASE_PROJECT_ID="<your-project-ref>"
```

These are the only client-side secrets — everything else (service-role key, JWT signing secret, Oracle upload key) lives server-side in the Edge Function and is never sent to the browser.

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

Set its secrets (never pass these as CLI arguments — use `secrets set` so they're not written to shell history):

```sh
npx supabase secrets set ADMIN_JWT_SECRET="$(openssl rand -hex 32)"

# Oracle object storage — see the contract below. Skip these if you don't
# need image uploads yet; the rest of the site works without them.
npx supabase secrets set ORACLE_UPLOAD_BASE_URL="https://your-upload-host"
npx supabase secrets set ORACLE_PUBLIC_BASE_URL="https://your-public-read-host"
npx supabase secrets set ORACLE_UPLOAD_API_KEY="your-upload-api-key"
npx supabase secrets set ORACLE_APP_NAME="portfolio"
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically into every Edge Function by Supabase — don't set those yourself.

`supabase/config.toml` sets `verify_jwt = false` for this function deliberately: it implements its own JWT scheme (checked against `admin_users`), so Supabase's platform-level "must have a Supabase-issued JWT" gate has to be off, or no request would ever reach the function's own auth check.

## 5. Create your first admin user

Multiple admins are supported — this can be run again later for additional accounts.

```sh
SUPABASE_URL="https://<your-project-ref>.supabase.co" \
SUPABASE_SERVICE_ROLE_KEY="<service-role key, from Project Settings → API>" \
ADMIN_BOOTSTRAP_USERNAME="youruser" \
ADMIN_BOOTSTRAP_PASSWORD="a strong password, 8+ chars" \
npm run create-admin
```

Env vars only, deliberately — the script refuses to read a username/password from `argv` so a password never ends up echoed in a shell history or process listing. Sign in at `/auth`.

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

Any HTTP storage service that implements the same contract works as a drop-in replacement — swap the three `ORACLE_*` secrets.

## Deployment

The frontend is a static Vite build with no server-side rendering, so it deploys to any static host:

```sh
npm run build   # outputs to dist/
```

Point Vercel, Netlify, Cloudflare Pages, or similar at this repo with build command `npm run build` and output directory `dist`, and set the three `VITE_*` environment variables from step 2 in that platform's dashboard. The Supabase Edge Function and database migrations are deployed independently via the Supabase CLI steps above — they aren't part of the static build.
