/**
 * The shared PostgREST client for public reads.
 *
 * Anonymous and read-only by design: row level security decides what this can
 * see, and every write goes through the admin gateway instead. The visitor id
 * header rides along so like and view counts can be attributed without a
 * session or a cookie.
 *
 * @module data
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { getVisitorId } from '@/lib/visitor';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

// The schema is a *type* argument as well as a runtime option. Passing only
// `db: { schema: 'portfolio' }` leaves supabase-js typing every query against
// the default schema, which is how 30-odd cascading type errors came to be
// standing in this app: `.eq('slug', ...)` stopped resolving to a real column.
export const supabase = createClient<Database, 'portfolio'>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  // On the box, portfolio's tables live in the `portfolio` schema, not `public`
  // (which belongs to a different site). Default every read here so
  // `supabase.from('projects')` resolves to portfolio.projects.
  db: { schema: 'portfolio' },
  // No `auth` config: admin auth is a self-hosted JWT scheme (see
  // src/hooks/useAuth.ts), not supabase.auth - this client is only ever
  // used for public anon-key reads and the visitor-scoped like/comment
  // writes below.
  global: {
    // Lets RLS scope anonymous blog like/comment ownership per-browser
    // (see supabase/migrations/20260725000001_stage1_cleanup_and_fixes.sql).
    headers: {
      'x-visitor-id': getVisitorId(),
    },
  },
});