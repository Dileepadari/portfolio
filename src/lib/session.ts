/**
 * The ecosystem session portfolio's admin runs on.
 *
 * The public site reads content anonymously through the Supabase client; the
 * admin, who signs in, uses this shared session instead of a token portfolio
 * kept for itself. The access token lives in memory, the refresh token is an
 * HttpOnly cookie on `.dileepadari.dev`, and signing in on any ecosystem app
 * signs the admin in here too.
 *
 * @module session
 */
import { createSessionClient } from '@completeos/auth-client';

const GATEWAY = import.meta.env.VITE_GATEWAY_URL ?? 'https://api.dileepadari.dev';

export const session = createSessionClient({ baseUrl: GATEWAY });

/** The gateway root, for the shared ecosystem assistant. */
export const GATEWAY_URL = GATEWAY;
