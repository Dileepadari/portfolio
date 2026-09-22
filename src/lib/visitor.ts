/**
 * Per-browser identity for anonymous blog engagement.
 *
 * There are no visitor accounts, so "my like" and "my comment" are scoped by a
 * random id kept in this browser's `localStorage` and sent as the
 * `x-visitor-id` header, which the blog_likes/blog_comments RLS policies read
 * (see supabase/migrations).
 *
 * That header is set by the client, so it is only ever as private as the id
 * itself: nothing here may publish one browser's id to another. Ownership in
 * the UI is therefore answered from this module's own record of what this
 * browser posted, never by comparing against ids downloaded from the server.
 *
 * @module engagement
 */

const VISITOR_ID_KEY = 'portfolio_visitor_id';
const OWN_COMMENTS_KEY = 'portfolio_own_comments';

/**
 * A random id persisted per-browser, used to scope anonymous blog
 * like/comment ownership without requiring visitors to have an account.
 *
 * @returns This browser's visitor id, minting one on first call.
 */
export function getVisitorId(): string {
  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
}

/**
 * Reads the ids of comments this browser posted.
 *
 * @returns The stored ids, or an empty array if the entry is missing or has
 *   been corrupted by hand.
 */
function readOwnCommentIds(): string[] {
  try {
    const raw = localStorage.getItem(OWN_COMMENTS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

/**
 * Records that this browser posted a comment.
 *
 * This is what the delete affordance is drawn from. The alternative - asking
 * the server for every comment's `visitor_id` and comparing - would hand every
 * reader the ids of everyone else who has commented, and those ids are exactly
 * what the delete policy trusts.
 *
 * @param commentId The id PostgREST returned for the inserted row.
 */
export function rememberOwnComment(commentId: string): void {
  const ids = readOwnCommentIds();
  if (ids.includes(commentId)) return;
  ids.push(commentId);
  try {
    localStorage.setItem(OWN_COMMENTS_KEY, JSON.stringify(ids));
  } catch {
    // A full or disabled localStorage costs the delete button, nothing more.
  }
}

/** Forgets a comment this browser deleted, so the list does not grow forever. */
export function forgetOwnComment(commentId: string): void {
  const ids = readOwnCommentIds().filter((id) => id !== commentId);
  try {
    localStorage.setItem(OWN_COMMENTS_KEY, JSON.stringify(ids));
  } catch {
    // Nothing to do; the stale id is harmless.
  }
}

/**
 * Whether this browser posted the given comment.
 *
 * Reach is identical to the old `visitor_id` comparison: the visitor id lives
 * in this same `localStorage`, so a comment posted from another browser was
 * never deletable from here either.
 *
 * @param commentId The comment being rendered.
 */
export function ownsComment(commentId: string): boolean {
  return readOwnCommentIds().includes(commentId);
}
