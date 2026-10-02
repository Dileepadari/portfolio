/**
 * Small helpers shared across the app: class merging and HTML sanitising.
 *
 * @module app
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Spread onto a <DialogContent> that holds a form worth not losing - blocks
 * the two accidental-dismiss paths (stray click on the backdrop, stray
 * Escape press) that otherwise silently discard whatever was typed. The
 * dialog still closes via its own Cancel/X/submit handlers.
 */
export const preventAccidentalDialogClose = {
  onPointerDownOutside: (e: Event) => e.preventDefault(),
  onEscapeKeyDown: (e: Event) => e.preventDefault(),
};

const ALLOWED_TAGS = new Set(['BR', 'SPAN', 'B', 'STRONG', 'I', 'EM', 'U', 'SMALL', 'CODE', 'P', 'DIV', 'A']);
const ALLOWED_ATTRS = new Set(['class', 'style', 'title', 'target', 'rel', 'href']);

/**
 * Disallowed elements whose children go with them.
 *
 * Every other disallowed element is unwrapped instead: `<section>hello</section>`
 * should still read "hello". These seven carry their payload in their own
 * subtree, so hoisting the children out would be the whole attack.
 */
const DROP_SUBTREE_TAGS = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'LINK', 'META']);

/**
 * Strips any script injection, iframes, on* event handlers, and javascript: protocols,
 * preserving only whitelisted inline styling/formatting tags (e.g. <br />, <span>, <strong>, <b>).
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty) return '';

  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return dirty
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, (tag) => {
        const match = tag.match(/^<\/?([a-z0-9]+)/i);
        if (match && ALLOWED_TAGS.has(match[1].toUpperCase())) {
          return tag.replace(/on\w+\s*=\s*(['"]).*?\1/gi, '').replace(/javascript:/gi, '');
        }
        return '';
      });
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(dirty, 'text/html');

  function cleanNode(node: Node) {
    const toRemove: Node[] = [];

    for (let i = 0; i < node.childNodes.length; i++) {
      const child = node.childNodes[i];
      if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as HTMLElement;
        const tagName = el.tagName.toUpperCase();

        if (!ALLOWED_TAGS.has(tagName)) {
          // Unwrapped children have to be cleaned *before* they are hoisted
          // into this node. The scan loop above has already passed this index
          // by the time the unwrap happens, so nothing would ever look at them
          // again: `<section><img src=x onerror=...></section>` used to come
          // out of here as a live `<img onerror>`.
          if (!DROP_SUBTREE_TAGS.has(tagName)) cleanNode(child);
          toRemove.push(child);
        } else {
          const attrNames = Array.from(el.attributes).map((a) => a.name);
          for (const attr of attrNames) {
            const lowerAttr = attr.toLowerCase();
            if (!ALLOWED_ATTRS.has(lowerAttr) || lowerAttr.startsWith('on')) {
              el.removeAttribute(attr);
            } else {
              const val = el.getAttribute(attr) || '';
              if (/javascript:|data:|vbscript:/i.test(val)) {
                el.removeAttribute(attr);
              }
            }
          }
          cleanNode(child);
        }
      } else if (child.nodeType === Node.COMMENT_NODE) {
        toRemove.push(child);
      }
    }

    for (const rem of toRemove) {
      const tag = (rem as HTMLElement).tagName?.toUpperCase();
      if (DROP_SUBTREE_TAGS.has(tag)) {
        node.removeChild(rem);
      } else {
        while (rem.firstChild) {
          node.insertBefore(rem.firstChild, rem);
        }
        node.removeChild(rem);
      }
    }
  }

  cleanNode(doc.body);
  return doc.body.innerHTML;
}


/**
 * Turns a human-readable phone number into the `tel:` URI for it.
 *
 * `personal_info.phone` is typed for people to read - "+91 7330701217" - and
 * interpolating that straight into an href produced `tel:+91 7330701217`. A
 * space is not valid in a `tel:` URI: RFC 3966 allows digits, a leading `+`
 * and visual separators, and a raw space has to be percent-encoded, which
 * leaves the dialler with `%20` in the middle of a number. Strip everything
 * that is not dialable instead, and keep the `+` so the country code survives.
 *
 * Returns an empty string for a value with no digits in it, so the caller can
 * leave the link out rather than render `tel:`.
 */
export function dialHref(phone: string | null | undefined): string {
  if (!phone) return "";
  const digits = phone.replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "");
  return /\d/.test(digits) ? `tel:${digits}` : "";
}

/**
 * True when a URL points back at this site.
 *
 * `personal_info.website` is "https://dileepadari.dev", and the header rendered
 * it as a "Portfolio" button on the portfolio: a link whose only effect is to
 * reload the page you are already on. The field is still worth keeping - it is
 * what a printed copy or a scraped profile wants - so this hides the button
 * rather than clearing the data.
 *
 * `www.` is stripped from both sides because the apex redirects to the www host
 * and either spelling means the same site. An unparseable value is not this
 * site, so a malformed URL still renders as an ordinary external link.
 */
export function isOwnSite(url: string | null | undefined): boolean {
  if (!url) return false;
  const strip = (host: string) => host.replace(/^www\./i, "").toLowerCase();
  try {
    return strip(new URL(url).hostname) === strip(window.location.hostname);
  } catch {
    return false;
  }
}
