const ADMIN_TOKEN_KEY = 'admin_token';

export interface AdminTokenPayload {
  sub: string;
  username: string;
  role: string;
  iat: number;
  exp: number;
}

export function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string): void {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken(): void {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

/** Decodes (but does not cryptographically verify) the token for UI state —
 *  real verification always happens server-side in the admin Edge Function. */
export function decodeAdminToken(token: string): AdminTokenPayload | null {
  try {
    const payloadSegment = token.split('.')[1];
    const json = atob(payloadSegment.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(json) as AdminTokenPayload;
    if (typeof payload.exp !== 'number' || payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}
