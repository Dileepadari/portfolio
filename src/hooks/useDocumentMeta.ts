/**
 * Sets the document title, meta description, canonical link and the
 * Open Graph / Twitter pair for a page, and restores them on unmount.
 *
 * This is a single-page app with one `<head>` in index.html, so every route
 * shared the site-wide values: a link to a specific project previewed as
 * "Dileepadari | Full-Stack Web Developer" with the site's generic blurb, in
 * every chat app and every browser tab.
 *
 * The canonical link was the worse half of that. index.html declares
 * `<link rel="canonical" href="https://www.dileepadari.dev/">`, and with
 * nothing updating it, `/projects`, `/blog` and `/contact` each told a crawler
 * they were the homepage. Google renders JavaScript before reading the
 * canonical, so setting it here is enough for Google; a scraper that does not
 * run scripts still sees the index.html fallback, which is why that fallback is
 * the homepage's own correct values rather than something stale.
 *
 * Restoring on unmount matters because navigating away from a project should
 * not leave its title on the page that replaced it.
 */

import { useEffect } from "react";

/** The host actually served. The apex 308-redirects to it. */
const CANONICAL_ORIGIN = "https://www.dileepadari.dev";

/**
 * Strips markup and collapses whitespace.
 *
 * Several of these fields are rich text edited in the admin UI and rendered
 * with `dangerouslySetInnerHTML`, so a real value can be
 * `Software Engineer @ Chubb<br />GSoC 2026 Mentor`. A `<title>` and a meta
 * description are plain text: the tags would show up literally in the browser
 * tab and in every link preview.
 */
function toPlainText(value: string): string {
  const el = document.createElement("div");
  // A line break carries no text, so `textContent` alone would weld the two
  // sides together: "Engineer @ Chubb<br />GSoC Mentor" becomes
  // "Engineer @ ChubbGSoC Mentor". Turn the breaks into spaces first.
  el.innerHTML = value.replace(/<\s*br\s*\/?\s*>|<\/\s*(p|div|li|h[1-6])\s*>/gi, " ");
  return (el.textContent || "").replace(/\s+/g, " ").trim();
}

/**
 * Finds a `<meta>` by name or property, creating it if index.html has none.
 *
 * `name` covers the plain and twitter: tags; `property` is what Open Graph
 * uses, and a scraper looking for `og:title` will not match `name="og:title"`.
 */
function metaTag(key: string, attr: "name" | "property"): HTMLMetaElement {
  const selector = `meta[${attr}="${key}"]`;
  let tag = document.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  return tag;
}

function canonicalLink(): HTMLLinkElement {
  let tag = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!tag) {
    tag = document.createElement("link");
    tag.rel = "canonical";
    document.head.appendChild(tag);
  }
  return tag;
}

/**
 * The canonical URL for the page being viewed.
 *
 * Query strings and fragments are dropped: `/projects?tab=web` and `/projects`
 * are the same page, and a canonical that keeps the query invites a crawler to
 * index every filter separately. A trailing slash is kept only on the root,
 * which is how the site's own links are written.
 */
function canonicalUrlFor(pathname: string): string {
  const path = pathname.replace(/\/+$/, "");
  return `${CANONICAL_ORIGIN}${path || "/"}`;
}

/**
 * Document-level metadata for one route.
 *
 * `title` and `description` are optional because the pages that take them from
 * the database call this before the fetch resolves. The canonical link does not
 * depend on either, so it is set either way.
 */
export function useDocumentMeta(title?: string, description?: string) {
  useEffect(() => {
    const tag = canonicalLink();
    const previous = tag.href;
    tag.href = canonicalUrlFor(window.location.pathname);
    const url = metaTag("og:url", "property");
    const previousUrl = url.content;
    url.content = tag.href;

    return () => {
      tag.href = previous;
      url.content = previousUrl;
    };
  }, []);

  useEffect(() => {
    if (!title) return;

    const plainTitle = toPlainText(title);
    const plainDescription = description ? toPlainText(description) : undefined;

    // Every tag that mirrors the title or the description, so a link preview
    // says the same thing as the browser tab.
    const targets: Array<[HTMLMetaElement, string | undefined]> = [
      [metaTag("og:title", "property"), plainTitle],
      [metaTag("twitter:title", "name"), plainTitle],
      [metaTag("description", "name"), plainDescription],
      [metaTag("og:description", "property"), plainDescription],
      [metaTag("twitter:description", "name"), plainDescription],
    ];

    const previousTitle = document.title;
    const previous = targets.map(([tag]) => tag.content);

    document.title = plainTitle;
    for (const [tag, value] of targets) {
      if (value !== undefined) tag.content = value;
    }

    return () => {
      document.title = previousTitle;
      targets.forEach(([tag, value], i) => {
        if (value !== undefined) tag.content = previous[i];
      });
    };
  }, [title, description]);
}
