#!/usr/bin/env node
/**
 * Writes dist/sitemap.xml after the Vite build.
 *
 *   node scripts/build-sitemap.mjs
 *
 * The site had no sitemap at all: `/sitemap.xml` returned the SPA shell through
 * the catch-all rewrite, so a crawler asking for one got an HTML page, and
 * robots.txt pointed at nothing. Every project and post lives behind a
 * client-side route, which means the only way a crawler finds
 * `/projects/nfsdrive` is by rendering `/projects` and following a link, or by
 * being handed the list.
 *
 * The slugs come from PostgREST with the **anon** key, which is the useful
 * part: the anon role sees exactly what a visitor sees, so a draft post cannot
 * be advertised to Google by accident. The boundary is the database's, not a
 * list of things to leave out.
 *
 * It never fails the build. A sitemap with four routes is worse than one with
 * fifty; a build that dies because a database was briefly unreachable is worse
 * than both, and the static routes are the ones that matter most anyway.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
const OUT = path.join(ROOT, "dist", "sitemap.xml");

/** Must match the canonical origin in index.html and useDocumentMeta. */
const ORIGIN = "https://www.dileepadari.dev";

/**
 * The routes that exist whether or not the database answers.
 *
 * `/settings` and `/auth` are deliberately absent: they are admin-only, and
 * listing them invites a crawler to index a login form.
 */
const STATIC_ROUTES = [
  { loc: "/", priority: "1.0", changefreq: "monthly" },
  { loc: "/projects", priority: "0.9", changefreq: "weekly" },
  { loc: "/blog", priority: "0.8", changefreq: "weekly" },
  { loc: "/contact", priority: "0.5", changefreq: "yearly" },
];

function credentials() {
  // Vercel sets these in the build environment. Falling back to .env keeps a
  // local `npm run build` producing the same file.
  let url = process.env.VITE_SUPABASE_URL;
  let key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) {
    const file = path.join(ROOT, ".env");
    if (!fs.existsSync(file)) return null;
    const text = fs.readFileSync(file, "utf8");
    const read = (name) =>
      text.match(new RegExp(`^${name}\\s*=\\s*"?([^"\\n]+)"?`, "m"))?.[1]?.trim();
    url ||= read("VITE_SUPABASE_URL");
    key ||= read("VITE_SUPABASE_PUBLISHABLE_KEY") ?? read("VITE_SUPABASE_ANON_KEY");
  }
  return url && key ? { url, key } : null;
}

/**
 * One PostgREST read.
 *
 * `fetch`, not curl through `execFileSync`. The first version shelled out, and
 * the first real deployment came back with a four-route sitemap: the build
 * container is not obliged to have curl on its PATH, and a build step that
 * depends on a binary nobody declared fails silently by design here, because
 * the fallback is meant to survive a database outage rather than hide a bug.
 * Global fetch has been stable since Node 18 and this package requires 20.19.
 *
 * The thrown message names the table and nothing else. `execFileSync` used to
 * put the whole argv into `err.message`, and that argv carried `apikey: <key>`,
 * which wrote the key into every build log for as long as the read kept
 * failing. The key is publishable and the logs are private, so that was
 * tidiness rather than a leak, but a build log is the wrong place to start
 * keeping credentials - and it is worth keeping true of whatever replaces this.
 */
async function fetchRows({ url, key }, table, select) {
  let res;
  try {
    res = await fetch(`${url}/rest/v1/${table}?select=${select}`, {
      headers: { apikey: key },
      signal: AbortSignal.timeout(20000),
    });
  } catch {
    throw new Error(`could not reach ${table}`);
  }
  if (!res.ok) throw new Error(`${table} returned ${res.status}`);
  let parsed;
  try {
    parsed = await res.json();
  } catch {
    throw new Error(`${table} did not return JSON`);
  }
  if (!Array.isArray(parsed)) throw new Error(`${table}: ${parsed.message ?? "unexpected response"}`);
  return parsed;
}

const escape = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** A `<lastmod>` is only worth emitting if the date parses. */
function lastmod(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
}

function entryFor(prefix, row, priority) {
  if (!row.slug) return null;
  return {
    // A `<loc>` is a URL, so the slug is percent-encoded before it is
    // XML-escaped. Real slugs are kebab-case and come out unchanged; a slug
    // with a space or an ampersand in it would otherwise produce a `<loc>` no
    // crawler can fetch.
    loc: `${prefix}/${encodeURIComponent(row.slug)}`,
    priority,
    changefreq: "monthly",
    lastmod: lastmod(row.updated_at ?? row.published_at ?? row.created_at),
  };
}

const routes = [...STATIC_ROUTES];
const creds = credentials();

/**
 * How this file was built, written into the file.
 *
 * The fallback is the point of this script and also its hazard: a sitemap with
 * four routes is a *valid* sitemap, so a build that silently failed to reach
 * the database looks exactly like a build that succeeded. Two deployments went
 * out that way before anyone could tell them apart, and the build log - the one
 * place the reason existed - is not somewhere you can look from a checkout.
 *
 * So the reason goes in the artifact. A crawler ignores an XML comment, it
 * costs one line, and `curl .../sitemap.xml | head -3` now answers "did this
 * work?" without any access to the deployment.
 */
let provenance;

if (!creds) {
  provenance = "no VITE_SUPABASE_URL / key in the build environment";
  console.warn(`sitemap: ${provenance}, writing the static routes only`);
} else {
  try {
    for (const row of await fetchRows(creds, "projects", "slug,updated_at")) {
      const entry = entryFor("/projects", row, "0.7");
      if (entry) routes.push(entry);
    }
    // A post the anon role cannot see is a draft, and is absent for that reason.
    for (const row of await fetchRows(creds, "blog_posts", "slug,updated_at,published_at")) {
      const entry = entryFor("/blog", row, "0.6");
      if (entry) routes.push(entry);
    }
    provenance = `${routes.length - STATIC_ROUTES.length} routes read from the database`;
  } catch (err) {
    provenance = `database not read: ${err.message}`;
    console.warn(`sitemap: ${err.message}; writing the routes gathered so far`);
  }
}

const body = routes
  .map(({ loc, priority, changefreq, lastmod: mod }) =>
    [
      "  <url>",
      `    <loc>${escape(ORIGIN + loc)}</loc>`,
      mod ? `    <lastmod>${mod}</lastmod>` : null,
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      "  </url>",
    ]
      .filter(Boolean)
      .join("\n")
  )
  .join("\n");

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(
  OUT,
  `<?xml version="1.0" encoding="UTF-8"?>\n<!-- ${escape(provenance)} -->\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
);

console.log(`sitemap: ${routes.length} urls -> dist/sitemap.xml`);
