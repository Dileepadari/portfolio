# Dileep Adari — Portfolio

Personal portfolio site for [dileepadari.dev](https://dileepadari.dev): a full-stack, fully self-editable portfolio with its own admin CMS, custom authentication, and image hosting — no third-party CMS or SaaS auth provider involved.

For local setup, environment variables, database migrations, and deployment steps, see **[DEVDOC.md](./DEVDOC.md)**.

## Features

- **Every piece of content is editable from the site itself** — personal info & highlights, experience, education, skills, achievements, courses, languages, projects, blog posts, and site-wide settings (footer, sign-in copy, admin quick links) all have inline admin edit forms. No separate CMS.
- **Self-hosted multi-admin authentication** — a hand-rolled username/password + JWT scheme (bcrypt-hashed passwords in a Postgres table, HS256 JWTs signed in a Supabase Edge Function) instead of Supabase Auth, so the app isn't tied to any one auth provider.
- **Centralized admin gateway** — every authenticated write (and every admin-only read, like blog drafts or the contact inbox) goes through a single Supabase Edge Function that checks the JWT and uses the service-role key server-side; Row Level Security locks out direct client writes entirely.
- **Image uploads to your own storage** — a reusable upload field wired through the same Edge Function to a self-hosted Oracle Cloud object storage endpoint, with configurable base URLs and app/file-type routing.
- **Blog with anonymous engagement** — likes and comments scoped per-anonymous-visitor (a client-generated id, not an account), with admin moderation.
- **Contact & task-request inbox** — visitors can send a message or submit a structured task request; the admin inbox has full detail views and a status flow (pending → sent to a separate task tracker / declined) instead of spinning up internal task/calendar features.
- **Theming** — light/dark/system mode plus five selectable accent color palettes, applied via CSS custom properties so the whole UI (including the 404 page) follows whichever palette is active.
- Responsive, animated UI built on Tailwind CSS v4 and shadcn/ui.

## Tech stack

- **Frontend**: React 19, TypeScript, Vite, React Router
- **Styling**: Tailwind CSS v4, shadcn/ui (Radix primitives)
- **Backend**: Supabase (PostgreSQL, Row Level Security, Edge Functions/Deno)
- **Storage**: Self-hosted Oracle Cloud object storage (proxied through the Edge Function)
- **CI**: GitHub Actions — lint, type-check, and build on every push/PR (`.github/workflows/ci.yml`)

## Project structure

```
src/
├── components/       # Reusable UI components (incl. shadcn/ui primitives)
├── hooks/             # Data hooks (usePortfolioData, useManagement, useAuth, useAdmin)
├── integrations/      # Supabase client + generated database types
├── layouts/            # App shell / layout
├── lib/                # adminApi client, image upload helper, color palettes, visitor id
├── pages/              # Route-level pages (Profile, Projects, Blog, Contact, Settings, Auth, ...)
└── providers/          # Theme provider

supabase/
├── functions/admin/    # The single authenticated gateway (login, data CRUD, upload proxy)
└── migrations/         # Schema migrations, applied in filename order

scripts/
└── create-admin.mjs    # Provisions/updates an admin_users row (env-vars only, never CLI args)
```

## Development

```sh
npm install
npm run dev          # start the dev server
npm run lint          # ESLint
npx tsc --noEmit      # type-check
npm run build         # production build
npm run preview       # preview the production build locally
```

See [DEVDOC.md](./DEVDOC.md) for the full setup (Supabase project, environment variables, migrations, Edge Function secrets, admin provisioning) and deployment instructions.
