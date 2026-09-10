#!/usr/bin/env node
/**
 * Builds project-showcase content from each repository's own documentation.
 *
 *   node scripts/build-showcase.mjs            # writes scripts/showcase.json
 *   node scripts/build-showcase.mjs --print    # summary to stdout
 *
 * Every field is extracted from files that already exist in the sibling
 * checkouts. Nothing is written here that a human did not already write in a
 * README or a DEVDOC, because a showcase page full of generated prose is worse
 * than an empty one: it reads as filler and it goes stale without anyone
 * noticing it has.
 *
 * The extraction relies on the section headings the overhauled READMEs share.
 * A repository that does not have them contributes whatever it does have, and
 * the showcase page omits the rest.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
const SIBLINGS = path.join(ROOT, "..");
const USER = "Dileepadari";
const RAW = (repo, p) => `https://raw.githubusercontent.com/${USER}/${repo}/main/${p}`;

/**
 * Everything between one `## Heading` and the next heading of the same or a
 * higher level.
 *
 * A sentinel heading is appended before matching so the last section in a file
 * terminates the same way every other one does. JavaScript has no `\\Z`, and
 * `$` under the `m` flag matches every line ending, so a lookahead for "end of
 * input" is not expressible directly.
 */
function section(markdown, headingPattern) {
  const doc = `${markdown}\n## \u0000\n`;
  const re = new RegExp(`^##\\s+(?:${headingPattern})\\s*$([\\s\\S]*?)(?=^#{1,2}\\s)`, "im");
  const match = doc.match(re);
  return match && match[1].trim() ? match[1].trim() : null;
}

/** The bold one-liner directly under the H1. */
function tagline(markdown) {
  const match = markdown.match(/^\*\*(.+?)\*\*\s*$/ms);
  return match ? match[1].replace(/\s+/g, " ").trim() : null;
}

/**
 * The `### Feature` blocks under `## Features`, as {title, description}.
 *
 * The first paragraph is the description; the "**Using it:**" paragraph is
 * deliberately dropped, because it is written as instructions to someone
 * already inside the app and reads oddly on a showcase page.
 */
function features(markdown) {
  const raw = section(markdown, "Features|What it does");
  if (!raw) return null;
  const body = `${raw}\n### \u0000\n`;
  const out = [];
  const re = /^###\s+(.+?)\s*$([\s\S]*?)(?=^#{1,3}\s)/gim;
  let m;
  while ((m = re.exec(body)) !== null) {
    const title = m[1].replace(/[*`]/g, "").trim();
    const first = m[2]
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .find((p) => p && !/^\*\*Using it:/.test(p) && !p.startsWith("|") && !p.startsWith("```"));
    if (!title) continue;
    out.push({
      title,
      description: first ? first.replace(/\s+/g, " ").replace(/[*`]/g, "").trim() : undefined,
    });
  }
  if (out.length > 0) return out.slice(0, 12);

  // Fall back to a bullet list of the form "- **Name** - description".
  const bullets = [...body.matchAll(/^[-*]\s+\*\*(.+?)\*\*\s*[-:]?\s*(.*)$/gim)].map((b) => ({
    title: b[1].trim(),
    description: b[2] ? b[2].replace(/\s+/g, " ").replace(/[*`]/g, "").trim() : undefined,
  }));
  return bullets.length > 0 ? bullets.slice(0, 12) : null;
}

/** The two-column stack table in a README or DEVDOC, as {name, role}. */
function techStack(readme, devdoc) {
  for (const [doc, heading] of [
    [readme, "Stack|Tech stack"],
    [devdoc, "Tech stack|Stack"],
  ]) {
    if (!doc) continue;
    const body = section(doc, heading);
    if (!body) continue;
    const rows = [...body.matchAll(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*$/gim)]
      .map((r) => [r[1].trim(), r[2].trim()])
      .filter(([a, b]) => a && b && !/^-+$/.test(a) && a.toLowerCase() !== "stack");
    if (rows.length === 0) continue;
    // Tables are written both ways round: "area | technologies" and
    // "technology | what it does". Longer right-hand cells mean the former.
    const flipped = rows.filter(([, b]) => b.split(/[,/]/).length > 1).length > rows.length / 2;
    return rows
      .flatMap(([left, right]) =>
        flipped
          ? right.split(/\s*,\s*/).map((name) => ({ name: clean(name), role: clean(left) }))
          : [{ name: clean(left), role: clean(right) }]
      )
      .filter((t) => t.name)
      .slice(0, 18);
  }
  return null;
}

const clean = (s) => s.replace(/[*`]/g, "").replace(/\[(.+?)\]\(.*?\)/g, "$1").trim();

/**
 * The README as an article: badge header removed, and the sections the showcase
 * page already renders above it taken out.
 *
 * Without this the page shows each screenshot twice, once in the gallery and
 * again inside the README's own table. On LifeBook that was 38 images on one
 * page, most of them duplicates. `Contents` goes too: it is a nav list for a
 * document that is no longer being navigated.
 *
 * The prose sections stay even where they overlap, because the README's version
 * is the author's full argument and the extracted one is a summary of it.
 */
function readmeBody(markdown) {
  const afterDivider = markdown.split(/\n---\n/);
  let body = afterDivider.length > 1 ? afterDivider.slice(1).join("\n---\n") : markdown;
  body = `${body}\n## \u0000\n`;
  for (const heading of ["Contents", "Screenshots", "Responsive layout"]) {
    body = body.replace(
      new RegExp(`^##\\s+${heading}\\s*$[\\s\\S]*?(?=^#{1,2}\\s)`, "im"),
      ""
    );
  }
  return body.replace(/\n## \u0000\n\s*$/, "").trim();
}

function screenshots(repo) {
  const dir = path.join(SIBLINGS, repo, "docs", "screenshots");
  const list = (sub) => {
    const p = path.join(dir, sub);
    return fs.existsSync(p) ? fs.readdirSync(p).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).sort() : [];
  };
  const dark = list("dark");
  const light = list("light");
  // Pair by filename, not by position: the two directories are the same set of
  // screens and sorting them independently is only reliable if the names match.
  const paired = dark.filter((f) => light.includes(f));
  const darkFiles = paired.length > 0 ? paired : dark;
  return {
    dark: darkFiles.map((f) => RAW(repo, `docs/screenshots/dark/${f}`)),
    light: darkFiles.filter((f) => light.includes(f)).map((f) => RAW(repo, `docs/screenshots/light/${f}`)),
  };
}

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function buildFor(repo) {
  const dir = path.join(SIBLINGS, repo);
  const readmePath = path.join(dir, "README.md");
  if (!fs.existsSync(readmePath)) return null;
  const readme = fs.readFileSync(readmePath, "utf8");
  const devdocPath = path.join(dir, "DEVDOC.md");
  const devdoc = fs.existsSync(devdocPath) ? fs.readFileSync(devdocPath, "utf8") : null;

  const shots = screenshots(repo);
  const arch = devdoc ? section(devdoc, "Architecture") : null;

  return {
    repo,
    slug: slugify(repo),
    tagline: tagline(readme),
    overview: section(readme, "Why this project matters"),
    problem: section(readme, "Where it came from|Origin|Inspiration"),
    features: features(readme),
    tech_stack: techStack(readme, devdoc),
    architecture: arch,
    getting_started: section(readme, "Getting started|Getting Started|Quick start"),
    readme: readmeBody(readme),
    image_url: shots.dark[0] ?? null,
    image_url_light: shots.light[0] ?? null,
    hero_url: shots.dark[1] ?? shots.dark[0] ?? null,
    hero_url_light: shots.light[1] ?? shots.light[0] ?? null,
    images: shots.dark,
    images_light: shots.light,
  };
}

const REPOS = fs
  .readdirSync(SIBLINGS, { withFileTypes: true })
  .filter((d) => d.isDirectory() && fs.existsSync(path.join(SIBLINGS, d.name, "README.md")))
  .map((d) => d.name)
  .filter((n) => n !== "portfolio");

const built = REPOS.map(buildFor).filter(Boolean).filter((b) => b.tagline || b.images.length > 0);

if (process.argv.includes("--print")) {
  for (const b of built) {
    const filled = ["tagline", "overview", "problem", "features", "tech_stack", "architecture", "getting_started"]
      .filter((k) => b[k] && (!Array.isArray(b[k]) || b[k].length > 0));
    console.log(
      `${b.repo.padEnd(34)} imgs=${String(b.images.length).padEnd(3)} light=${String(b.images_light.length).padEnd(3)} ${filled.join(",")}`
    );
  }
} else {
  fs.writeFileSync(path.join(ROOT, "scripts", "showcase.json"), JSON.stringify(built, null, 2));
  console.log(`Wrote scripts/showcase.json for ${built.length} repositories`);
}
