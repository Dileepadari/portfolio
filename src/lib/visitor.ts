const VISITOR_ID_KEY = 'portfolio_visitor_id';

/**
 * A random id persisted per-browser, used to scope anonymous blog
 * like/comment ownership (see the blog_likes/blog_comments RLS policies in
 * supabase/migrations) without requiring visitors to have an account.
 */
export function getVisitorId(): string {
  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
}
