import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '@/lib/adminApi';
import {
  getAdminToken,
  setAdminToken,
  clearAdminToken,
  decodeAdminToken,
  type AdminTokenPayload,
} from '@/lib/adminAuthToken';

/**
 * Admin-only auth against our own `admin_users` table (see
 * supabase/functions/admin), not supabase.auth - there is no visitor-facing
 * sign-up; admins are provisioned via `npm run create-admin`.
 */
export function useAuth() {
  const [user, setUser] = useState<AdminTokenPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAdminToken();
    setUser(token ? decodeAdminToken(token) : null);
    setLoading(false);
  }, []);

  const signIn = useCallback(async (username: string, password: string) => {
    try {
      const { token } = await adminApi.login(username, password);
      setAdminToken(token);
      setUser(decodeAdminToken(token));
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Login failed') };
    }
  }, []);

  const signOut = useCallback(async () => {
    clearAdminToken();
    setUser(null);
  }, []);

  return { user, loading, signIn, signOut };
}
