#!/usr/bin/env node
/**
 * Provisions or updates the one `admin_users` row, using the service-role key.
 *
 * Deliberately a standalone script rather than app code or a committed
 * migration: an admin's password hash should never be reachable from a UI form
 * that ships in the browser bundle, and never end up in git history.
 *
 * Credentials come from environment variables, never argv, because argv is
 * echoed back by npm, by shell history and by the process list.
 *
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *   ADMIN_BOOTSTRAP_USERNAME=... ADMIN_BOOTSTRAP_PASSWORD=... npm run create-admin
 *
 * @module admin
 */

import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const username = process.env.ADMIN_BOOTSTRAP_USERNAME;
const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;

if (!username || !password) {
  console.error('Missing ADMIN_BOOTSTRAP_USERNAME / ADMIN_BOOTSTRAP_PASSWORD environment variables.');
  process.exit(1);
}

if (password.length < 8) {
  console.error('Password must be at least 8 characters.');
  process.exit(1);
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const password_hash = await bcrypt.hash(password, 10);

const { error } = await supabase
  .from('admin_users')
  .upsert({ username, password_hash, is_active: true }, { onConflict: 'username' });

if (error) {
  console.error('Failed to create/update admin user:', error.message);
  process.exit(1);
}

console.log(`Admin user "${username}" is ready.`);
