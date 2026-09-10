#!/usr/bin/env node
/**
 * Writes the extracted showcase content into a database.
 *
 *   node scripts/apply-showcase.mjs --local          # local Postgres, direct
 *   node scripts/apply-showcase.mjs --print-payload  # JSON for the admin gateway
 *
 * Matching is by the repository name in `github_url`, not by title: titles on
 * the site are display names ("PlaceTrack (Placement Navigator)") and change,
 * while the repo a project points at does not.
 *
 * Only fills fields that are empty. A value typed into the admin UI is never
 * overwritten by a value scraped out of a README, because the person who typed
 * it knew something the README does not.
 */

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = path.join(import.meta.dirname, "..");
const SHOWCASE = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts", "showcase.json"), "utf8"));

const LOCAL_URL = "http://127.0.0.1:54321";
const LOCAL_SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU";

/** The showcase fields, in the order the detail page reads them. */
const FIELDS = [
  "tagline", "overview", "problem", "features", "tech_stack",
  "architecture", "getting_started", "readme",
  "image_url", "image_url_light", "hero_url", "hero_url_light",
  "images", "images_light",
];

/**
 * GitHub repository name to the sibling checkout that documents it.
 *
 * A few projects were renamed on disk but not on GitHub, so the repo the site
 * links to and the directory holding its README are different words for the
 * same thing.
 */
const ALIASES = new Map([
  ["facebook_using_php", "faceclone"],
  ["moneyos", "moneyos"],
]);

const repoOf = (url) => {
  const name = (url || "").replace(/\/+$/, "").split("/").pop()?.toLowerCase() ?? "";
  return ALIASES.get(name) ?? name;
};

function curlJson(url, headers, body, method = "GET") {
  const args = ["-sS", "-X", method, url];
  for (const [k, v] of Object.entries(headers)) args.push("-H", `${k}: ${v}`);
  if (body !== undefined) args.push("-H", "Content-Type: application/json", "-d", JSON.stringify(body));
  const out = execFileSync("curl", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  return out.trim() ? JSON.parse(out) : null;
}

/** Fields to write for one project row: extracted, minus anything already set. */
export function updateFor(row, built) {
  const patch = {};
  for (const field of FIELDS) {
    const incoming = built[field];
    if (incoming === null || incoming === undefined) continue;
    if (Array.isArray(incoming) && incoming.length === 0) continue;

    const existing = row[field];
    const alreadySet =
      existing !== null &&
      existing !== undefined &&
      existing !== "" &&
      !(Array.isArray(existing) && existing.length === 0);
    if (alreadySet) continue;

    patch[field] = incoming;
  }
  // Slug is what the detail page is addressed by, so it is filled even though
  // the migration already backfilled one from the title: the repo name is a
  // better URL than a display name with brackets in it.
  if (!row.slug && built.slug) patch.slug = built.slug;
  if (!row.status) patch.status = "Shipped";
  return patch;
}

function plan(rows) {
  const byRepo = new Map(SHOWCASE.map((b) => [b.repo.toLowerCase(), b]));
  const updates = [];
  const unmatched = [];
  for (const row of rows) {
    const built = byRepo.get(repoOf(row.github_url));
    if (!built) {
      unmatched.push(`${row.title} (${repoOf(row.github_url) || "no github_url"})`);
      continue;
    }
    const patch = updateFor(row, built);
    if (Object.keys(patch).length > 0) updates.push({ id: row.id, title: row.title, repo: built.repo, patch });
  }
  return { updates, unmatched };
}


/** Repositories that are not portfolio projects. */
const SKIP_INSERT = new Set(["Dileepadari"]);

const GITHUB_META = JSON.parse(
  fs.readFileSync(path.join(ROOT, "scripts", "github-meta.json"), "utf8")
);

const LANGUAGE_COLORS = {
  TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5",
  C: "#555555", "C++": "#f34b7d", Java: "#b07219", PHP: "#4F5D95",
  Kotlin: "#A97BFF", HTML: "#e34c26", CSS: "#563d7c",
};

/** A complete row for a project the site does not have yet. */
function newRowFor(built) {
  const meta = GITHUB_META[built.repo] ?? {};
  const row = {
    title: built.repo.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    // GitHub's blurb, not the tagline: the detail page shows both, and two
    // fields carrying the same sentence reads as a mistake.
    description: meta.description || built.tagline,
    github_url: meta.url ?? `https://github.com/Dileepadari/${built.repo}`,
    live_url: meta.homepage || null,
    language: meta.language ?? null,
    language_color: LANGUAGE_COLORS[meta.language] ?? "#8b949e",
    tags: meta.topics?.length ? meta.topics : null,
    category: "web development",
    featured: false,
    order_index: 100,
    stars: meta.stars ?? 0,
    forks: meta.forks ?? 0,
    status: "Shipped",
    slug: built.slug,
  };
  for (const field of FIELDS) {
    const v = built[field];
    if (v === null || v === undefined) continue;
    if (Array.isArray(v) && v.length === 0) continue;
    row[field] = v;
  }
  return row;
}

const args = process.argv.slice(2);

if (args.includes("--local")) {
  const headers = { apikey: LOCAL_SERVICE_KEY, Authorization: `Bearer ${LOCAL_SERVICE_KEY}` };
  const rows = curlJson(`${LOCAL_URL}/rest/v1/projects?select=*`, headers);
  const { updates, unmatched } = plan(rows);
  for (const u of updates) {
    curlJson(
      `${LOCAL_URL}/rest/v1/projects?id=eq.${u.id}`,
      { ...headers, Prefer: "return=minimal" },
      u.patch,
      "PATCH"
    );
    console.log(`  ${u.title.padEnd(42)} <- ${u.repo} (${Object.keys(u.patch).length} fields)`);
  }
  console.log(`\nUpdated ${updates.length} of ${rows.length} projects.`);
  if (unmatched.length) console.log(`No local repo for: ${unmatched.join(", ")}`);
} else if (args.includes("--local-insert")) {
  const headers = { apikey: LOCAL_SERVICE_KEY, Authorization: `Bearer ${LOCAL_SERVICE_KEY}` };
  const rows = curlJson(`${LOCAL_URL}/rest/v1/projects?select=github_url`, headers);
  const present = new Set(rows.map((r) => repoOf(r.github_url)));
  const missing = SHOWCASE.filter(
    (b) => !present.has(b.repo.toLowerCase()) && !SKIP_INSERT.has(b.repo) && b.tagline
  );
  for (const b of missing) {
    const row = newRowFor(b);
    curlJson(`${LOCAL_URL}/rest/v1/projects`, { ...headers, Prefer: "return=minimal" }, row, "POST");
    console.log(`  + ${b.repo.padEnd(34)} (${b.images.length} images)`);
  }
  console.log(`\nInserted ${missing.length} projects.`);
} else if (args.includes("--print-payload")) {
  // Rows come in on stdin so this never needs production credentials itself.
  const rows = JSON.parse(fs.readFileSync(0, "utf8"));
  const { updates, unmatched } = plan(rows);
  process.stderr.write(`${updates.length} updates, ${unmatched.length} unmatched\n`);
  process.stdout.write(JSON.stringify(updates, null, 2));
} else {
  console.error("usage: --local | --print-payload  (rows JSON on stdin)");
  process.exit(1);
}
