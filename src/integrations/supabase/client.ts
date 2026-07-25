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

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  // No `auth` config: admin auth is a self-hosted JWT scheme (see
  // src/hooks/useAuth.ts), not supabase.auth — this client is only ever
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