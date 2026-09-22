# not_for_you.md

A personal working log. Not documentation, and nothing here is needed to use or
contribute to this site. Everything a newcomer actually needs is in
[README.md](./README.md) and [DEVDOC.md](./DEVDOC.md).

---

## The storage box's signing key was in the source

`supabase/functions/admin/index.ts`, lines 25 and 26:

```ts
const SELFHOST_JWT_SECRET = Deno.env.get("SELFHOST_JWT_SECRET") ?? "979fdfbf...e2b2";
const ORACLE_UPLOAD_API_KEY = Deno.env.get("ORACLE_UPLOAD_API_KEY") ?? "This_is_top_...oracle";
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

---

# The move into CompleteOS (2026-09-22)

## The repository this app lives in changed under the overhaul

The standalone `Dileepadari/portfolio` repo was the overhaul target. Three days
before I picked it up, `d1990e2` "Merge portfolio upstream into apps/portfolio"
was pushed to its `main`, bringing the monorepo's variant of this app back into
the standalone repo. That merge added

```json
"@completeos/auth-client": "*",
"@completeos/ui": "*"
```

which are workspace packages. They are not on npm, not vendored, and not in that
repo's lockfile, so `npm ci` 404s there. The standalone repo had been red for
three days and could not install, build, typecheck, test or run.

The owner's call was that the standalone repo is superseded and the overhaul
targets `CompleteOS/apps/portfolio` instead. So the standalone repo keeps its
red CI and needs a disposition decision (archive, revert, or delete); it is not
this app's problem any more.

One thing did go back to it: `not_for_you.md` there was quoting the storage
box's upload key in full, and that repo is public. That single redaction was
pushed on its own.

## The typecheck had never actually compiled this app

The monorepo CI had six jobs and not one of them built an app. The portfolio app
was carrying **33 standing type errors** the whole time, and CI was green.

The root cause was one line. The merge moved the client onto the `portfolio`
schema:

```ts
db: { schema: 'portfolio' }
```

while `src/integrations/supabase/types.ts` still declared only `public`. That is
a type error at the `createClient` call, and from there every query loses its row
type, so `.eq('slug', ...)` stops resolving to a real column and the failure
lands in thirty other places that each look like their own bug.

Two halves to the fix, and doing only one makes it worse:

1. the generated types declare the `portfolio` schema;
2. `createClient<Database, 'portfolio'>` passes the schema as a **type**
   argument, not only a runtime option.

With just the first, the default schema lookup finds nothing and every insert
payload becomes `never`, which is a stranger error than the one you started
with.

The types file now carries a header saying it was hand-adjusted, because a plain
`supabase gen types` would silently undo it.

## The dead argument the broken typecheck was hiding

`adminApi.upsert` was rewritten by the merge to take two arguments and PUT to the
gateway's `/settings` route. Its one caller still passed three. Nothing caught
it, because typecheck was never green enough to be read.

## Two security bugs, found by reading rather than by a scanner

Neither gitleaks nor `npm audit` had anything to say about this app. Both of
these came out of reading the code.

**The inline sanitiser unwrapped elements without cleaning them.** `sanitizeHtml`
drops a tag it does not allow but keeps the text inside, which is right. It was
hoisting those children into the document without ever visiting them, and the
scan loop had already passed that index, so nothing looked at them again:

```
<section><img src=x onerror="alert(1)"></section>   ->   <img src=x onerror="alert(1)">
<article><a href="javascript:alert(1)">x</a></article> -> the href survived
```

A top-level `<img onerror>` was stripped correctly, which is presumably why it
read as working. The fix cleans a disallowed element's subtree before unwrapping
it, and drops the subtree outright for the seven tags where the subtree *is* the
payload. Five of the ten new tests in `utils.test.ts` fail without it.

Worth saying why this is reachable rather than theoretical: project titles and
descriptions are scraped out of other people's READMEs by
`scripts/apply-showcase.mjs`. "Only an admin can type this" was never the threat
model.

**The blog published commenter emails and visitor ids.** The comment read was
`select('*')`, and the table holds `author_email` (typed into the form by
whoever commented) and `visitor_id`. Both went to every reader of the post.

The visitor id is the value the delete policy trusts, via a client-set
`x-visitor-id` header, so publishing it meant any visitor could delete any
comment by copying someone else's id out of the response. The likes read had the
same shape: `select('visitor_id')` for every like on the post.

Fixes, all client-side, no migration:

- the comment read names its columns and omits both;
- likes became two server-side counts instead of a list of ids;
- the delete button now asks `ownsComment(id)`, which reads this browser's own
  record of what it posted.

That last one has exactly the same reach as the old comparison, which is the
reason it is acceptable: the visitor id lives in this browser's `localStorage`
too, so a comment posted from another browser was never deletable from here
anyway.

## Left alone deliberately

- **`supabase/functions/admin/` is retired and still in the tree.** The gateway's
  `services/gateway/apps/portfolio.ts` owns those routes now, and nothing in this
  app calls the function. I did not delete it: whether that Supabase function is
  still deployed is a deploy question, not a source question, and deleting source
  does not undeploy anything. Flagged for the owner instead.
- **`supabase/migrations/` likewise.** They built this schema before it moved to
  the shared box. They are history, not provisioning.
- **Sign-in still has no rate limit.** The gateway is the right place for it and
  it is not mine to invent here.
- **`className` is allowed on any tag** by the markdown allow-list. Untrusted
  README content can therefore set classes, which is a cosmetic nuisance rather
  than an escalation. Left, but noted.

## A commit boundary I got wrong

`usePortfolioData.ts` carried three unrelated changes into one commit: the
engagement privacy fix, the `Database['portfolio']` rename and the dead
`upsert` argument. They are all correct and all verified, but the commit message
only describes the first. Splitting it afterwards would have meant rewriting
pushed-adjacent history for a cosmetic gain, so it stands.
