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
      if (['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'LINK', 'META'].includes(tag)) {
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

