/**
 * Admin sign-in state, backed by the shared ecosystem session.
 *
 * The interface components rely on is unchanged - `user`, `loading`, `signIn`,
 * `signOut` - but underneath it is now the ecosystem's single sign-on. Being
 * signed in is not enough to reach the admin screens: the person must hold a
 * portfolio admin grant, which `isAdmin` reflects. There is no visitor sign-up;
 * admin access is granted deliberately.
 *
 * @module auth
 */

import { useState, useEffect, useCallback } from 'react';
import { session } from '@/lib/session';
import type { SessionUser } from '@completeos/auth-client';

export interface AdminUser {
  id: string;
  username: string;
  isAdmin: boolean;
}

function toAdmin(u: SessionUser): AdminUser {
  const role = u.apps?.portfolio;
  return { id: u.id, username: u.username, isAdmin: role === 'admin' || role === 'owner' };
}

export function useAuth() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore a session from the shared cookie. Arriving already signed in from
    // another ecosystem app lands here signed in too.
    session.init()
      .then((s) => setUser(s.status === 'authenticated' ? toAdmin(s.user) : null))
      .finally(() => setLoading(false));
    return session.subscribe((s) => {
      if (s.status === 'anonymous') setUser(null);
      else if (s.status === 'authenticated') setUser(toAdmin(s.user));
    });
  }, []);

  const signIn = useCallback(async (identifier: string, password: string) => {
    try {
      const u = await session.login(identifier, password);
      const admin = toAdmin(u);
      if (!admin.isAdmin) {
        await session.logout();
        return { error: new Error('That account is not a portfolio administrator.') };
      }
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Login failed') };
    }
  }, []);

  const signOut = useCallback(async () => {
    await session.logout();
    setUser(null);
  }, []);

  return { user, loading, signIn, signOut };
}
