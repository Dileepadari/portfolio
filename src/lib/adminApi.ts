/**
 * The only way the browser writes anything.
 *
 * Public reads go straight to PostgREST under row level security. Every write
 * goes through one Deno edge function that holds the service-role key, so no
 * privileged credential is ever in the bundle. This module is that function's
 * client: one place that knows the URL shape, attaches the admin token, and
 * turns an expired session into a message a person can act on.
 *
 * @module admin
 */

import { session } from './session';

const GATEWAY = import.meta.env.VITE_GATEWAY_URL ?? 'https://api.dileepadari.dev';
const PORTFOLIO_BASE = `${GATEWAY}/apps/portfolio`;

async function call(path: string, init: RequestInit = {}) {
  const token = await session.getAccessToken();
  const res = await fetch(`${PORTFOLIO_BASE}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      ...(init.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (res.status === 401) {
    throw new Error('Your admin session has expired. Please log in again.');
  }

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return body;
}

async function dataCall(operation: string, table: string, extra: Record<string, unknown> = {}) {
  // The gateway keys entities as `<app>.<table>`; portfolio's admin only ever
  // touches portfolio tables.
  const body = await call('/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ entity: `portfolio.${table}`, operation, ...extra }),
  });
  return body.data;
}

/**
 * Reduces a picked file's name to something that survives being an HTTP header
 * and a URL path segment.
 *
 * Two things force this. `x-file-name` is a header, and `fetch` throws on a
 * non-ISO-8859-1 header value, so a file called `resume-final.pdf` uploads and
 * one with an accent in its name fails with nothing useful in the message. The
 * gateway also rejects path separators, so a name has to arrive already clean.
 *
 * @param name The `File.name` the picker gave us.
 * @returns Lowercase, ASCII, dot-and-hyphen only, never empty.
 */
export function safeFileName(name: string): string {
  const cleaned = name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[.-]+/, '')
    .toLowerCase()
    .slice(-120);
  return cleaned || 'file';
}

export const adminApi = {
  login: async (identifier: string, password: string) => {
    await session.login(identifier, password);
    return { ok: true };
  },

  /** Admin-only reads that the public anon key can't see (drafts, the
   *  contact inbox). */
  select: <T = unknown>(table: string): Promise<T[]> => dataCall('select', table),

  insert: <T = unknown>(table: string, payload: unknown): Promise<T> => dataCall('insert', table, { payload }),

  update: <T = unknown>(table: string, id: string, payload: unknown, idColumn = 'id'): Promise<T> =>
    dataCall('update', table, { id, payload, idColumn }),

  remove: async (table: string, id: string, idColumn = 'id'): Promise<void> => {
    await dataCall('delete', table, { id, idColumn });
  },

  /** site_settings is a key/value table; it has its own upsert route. */
  upsert: async <T = unknown>(_table: string, payload: unknown): Promise<T> => {
    const body = await call('/settings', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    });
    return body.data as T;
  },

  upload: async (file: File, opts: { fileType: 'images' | 'documents'; fileName?: string }): Promise<string> => {
    const fileName = opts.fileName || `${crypto.randomUUID()}-${safeFileName(file.name)}`;
    const buffer = await file.arrayBuffer();
    const token = await session.getAccessToken();
    const res = await fetch(`${PORTFOLIO_BASE}/upload`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'x-file-type': opts.fileType,
        'x-file-name': fileName,
        'Content-Type': 'application/octet-stream',
      },
      body: buffer,
    });

    if (res.status === 401) {
      throw new Error('Your admin session has expired. Please log in again.');
    }

    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error || `Upload failed (${res.status})`);
    return body.url as string;
  },
};
