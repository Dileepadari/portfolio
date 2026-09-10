# not_for_you.md

A personal working log. Not documentation, and nothing here is needed to use or
contribute to this site. Everything a newcomer actually needs is in
[README.md](./README.md) and [DEVDOC.md](./DEVDOC.md).

---

## The storage box's signing key was in the source

`supabase/functions/admin/index.ts`, lines 25 and 26:

```ts
const SELFHOST_JWT_SECRET = Deno.env.get("SELFHOST_JWT_SECRET") ?? "979fdfbf...e2b2";
const ORACLE_UPLOAD_API_KEY = Deno.env.get("ORACLE_UPLOAD_API_KEY") ?? "This_is_top_secret_to_upload_to_oracle";
```

Both live, both written as `??` defaults, committed on 2026-08-29 and still at
HEAD eleven days later in a public repository.

`SELFHOST_JWT_SECRET` is the one that matters. It is the `JWT_SECRET` of the
self-hosted Supabase stack on the Oracle VM, and that box is shared: this
project, placement-navigator and workos all upload to it. placement-navigator's
own DEVDOC says as much, and warns that rotating it invalidates every PostgREST
token on the box. A signing key is not a password for one service; possession of
it is equivalent to being the admin of that stack, for everything on it.

A `??` default for a secret is not a convenience. It is publication with extra
steps, and it reads as prudent defensive coding while doing the opposite.

Both fallbacks are gone. `requiredSecret()` throws at module load naming the
variable and the command to set it, so a misconfigured deploy fails loudly at
boot rather than running unauthenticated. Rotation is on the owner's list.

## Nothing could build the database

`supabase start` failed on the first migration:

```
ERROR: relation "public.projects" does not exist
```

Twelve of the sixteen tables were created through the Lovable dashboard and
never written down. The migration folder began at "stage 1", which *alters*
tables it assumes into existence. So the migrations were not a description of
the schema; they were a diff against a state that existed only on the hosted
project and nowhere else.

Which means: no local database, no way to test anything that touches data, no
way to stand up a second environment, and no way for anyone else to run this at
all. It had never been noticed because the one machine that mattered already had
the tables.

I reconstructed a baseline from `src/integrations/supabase/types.ts`, which is
generated from the live schema and is the best surviving description of it. The
fiddly part was that the baseline has to present the schema as it was *before*
stage 1, not as it is now, or the later migrations have nothing to act on:
`is_private` rather than `is_contributed`, `blog_likes.user_ip` rather than
`visitor_id`, no `personal_info.highlights` yet, and `tasks` and `schedules`
still present so that stage 2 can write policies over them and a later migration
can drop them.

There is a CI job that runs the whole chain from an empty database now. Without
it this will silently rot again the first time someone adds a column through the
dashboard.

## Two things that were locking the browser

Both found by trying to screenshot the new page, which is a poor way to discover
a performance bug and better than not discovering it.

**Unbounded syntax-highlight auto-detection.** `rehype-highlight` defaults to
guessing the language of every code block that has no ``` tag, and guessing
means running all ~190 registered grammars over the text and scoring them. A
README with four untagged blocks was enough to freeze the renderer hard enough
that a CDP screenshot timed out after 30 seconds. It is now restricted to a
subset of about twenty languages. Explicitly tagged blocks were never affected,
which is exactly why this is easy to miss: the blog's own posts mostly tag their
blocks.

**The README rendering on load.** Even bounded, rendering the full README plus
four other markdown sections at mount was heavy. The README block now carries
`content-visibility: auto`, so the browser skips its layout and paint until it
is near the viewport. It is the longest thing on the page and always last, so on
most visits it is never rendered at all.

Neither of these was introduced by this work. The blog has had the first one
since markdown was added.

## `theme` is not `resolvedTheme`

The project cards did this:

```ts
if (theme === 'light') return '/adk_dev_logo_dark.png';
if (theme === 'dark') return '/adk_dev_logo_light.png';
return '/adk_dev_logo_color.png'; // system default
```

`theme` can be `"system"`, and the default *is* `"system"`, so every visitor who
had never touched the toggle matched neither branch and got the third logo
regardless of what their OS actually wanted. The comment calls it "system
default" as if that were the intent.

`ThemedImage` resolves through `resolvedTheme`, and there is a test named after
this specific mistake.

## Deciding where READMEs come from

Three options, and the difference matters more than it looks:

- **Fetch from GitHub at render time.** Always current, nothing to maintain, and
  useless for the contributed and private projects, plus a network call on every
  page view.
- **Store in the database.** Full control, works for everything, costs a paste
  when a repo's README changes.
- **Both, with an override.** The most code, and the fallback path is the one
  that would break quietly.

Stored, on the owner's call. The thing that decided it for me afterwards is that
a README written for a repository page and a README written for a showcase are
not the same document: the repo one opens with badges and a clone command, which
is not what someone browsing a portfolio wants first.

## Smaller things

- **`react-router-dom` 6 had two advisories**, one an open redirect via a
  backslash in `<Link>`. Only the SSR one was inapplicable here. v7 is a drop-in
  for the six APIs this app uses.
- **Vite 5 to 7** for the esbuild dev-server advisory. Zero vulnerabilities now,
  runtime and dev.
- **The edge function had two type errors** that nothing had ever checked,
  because there was no `deno check` in CI. One was the `Uint8Array<ArrayBufferLike>`
  vs `BufferSource` mismatch that bites every hand-rolled JWT verifier; the other
  was supabase-js's generics recursing forever on a runtime table name.
- **ESLint was linting the Deno function** with browser rules. It is excluded
  now; `deno check` covers it.
- **The projects list selected `*`**, which after this change would have pulled
  every project's full README to render a grid of cards that shows none of it.
  It selects an explicit column list now.
- **The card title was styled as a link and did nothing.** It goes to the
  showcase page.
- **There was no `<title>` per route**, so every project link previewed as the
  site's generic title in every chat app.
