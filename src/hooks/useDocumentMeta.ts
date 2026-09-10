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

    document.title = title;
    if (description) setMetaDescription(description);

    return () => {
      document.title = previousTitle;
      if (description && previousDescription !== undefined) {
        setMetaDescription(previousDescription);
      }
    };
  }, [title, description]);
}
