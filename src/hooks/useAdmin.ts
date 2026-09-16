import { useAuth } from './useAuth';

/**
 * The JWT's `role: 'admin'` claim is signed server-side by the admin Edge
 * Function, so having a valid decoded token already implies admin - no
 * separate profiles-table lookup needed (the real authorization check
 * always happens again server-side on every write anyway).
 */
export function useAdmin() {
  const { user, loading } = useAuth();
  // A signed-in person is not automatically an admin; check the grant.
  return { isAdmin: !!user?.isAdmin, loading };
}
