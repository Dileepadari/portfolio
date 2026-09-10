/**
 * Sets the document title and meta description for a page, and restores them
 * on unmount.
 *
 * This is a single-page app with one `<title>` in index.html, so every route
 * shared the site-wide title: a link to a specific project previewed as
 * "Dileepadari | Full-Stack Web Developer" with the site's generic blurb, in
 * every chat app and every browser tab.
 *
 * Restoring on unmount matters because navigating away from a project should
 * not leave its title on the page that replaced it.
 */

import { useEffect } from "react";

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

function setMetaDescription(content: string) {
  let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (!tag) {
    tag = document.createElement("meta");
    tag.name = "description";
    document.head.appendChild(tag);
  }
  tag.content = content;
}

export function useDocumentMeta(title?: string, description?: string) {
  useEffect(() => {
    if (!title) return;

    const previousTitle = document.title;
    const previousDescription =
      document.querySelector<HTMLMetaElement>('meta[name="description"]')?.content;

    document.title = toPlainText(title);
    if (description) setMetaDescription(toPlainText(description));

    return () => {
      document.title = previousTitle;
      if (description && previousDescription !== undefined) {
        setMetaDescription(previousDescription);
      }
    };
  }, [title, description]);
}
