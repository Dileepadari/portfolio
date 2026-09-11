/**
 * The single authenticated gateway for every admin write, plus the few
 * admin-only reads (drafts, the contact inbox) that the anon key must not see.
 *
 * This function holds the service-role key so the browser bundle never does.
 * Authentication is a self-issued username and password scheme over the
 * `admin_users` table with bcrypt hashes, not `supabase.auth`, because the site
 * has exactly one privileged user and no public sign-up to build on.
 *
 * @module admin
 * @public
 */

import { createClient } from "npm:@supabase/supabase-js@2";
import bcrypt from "npm:bcryptjs@2";

const SUPABASE_URL = requiredSecret("SUPABASE_URL");
const SERVICE_ROLE_KEY = requiredSecret("SUPABASE_SERVICE_ROLE_KEY");
const JWT_SECRET = requiredSecret("ADMIN_JWT_SECRET");

// The storage box. Upload and public read are different hosts today, and the
// upload endpoint returns a URL on the wrong domain, so the public URL is built
// here from the {fileType}/{appName}/{fileName} convention rather than trusted
// from the upload response.
const ORACLE_UPLOAD_BASE_URL = Deno.env.get("ORACLE_UPLOAD_BASE_URL") ?? "https://supabase.dileepadari.dev";
const ORACLE_PUBLIC_BASE_URL = Deno.env.get("ORACLE_PUBLIC_BASE_URL") ?? "https://mystorage.dileepadari.dev";
const ORACLE_UPLOAD_PATH = Deno.env.get("ORACLE_UPLOAD_PATH") ?? "/upload";
const ORACLE_APP_NAME = Deno.env.get("ORACLE_APP_NAME") ?? "portfolio";

// No fallbacks. These two were previously written into this file as `??`
// defaults and shipped to a public repository. SELFHOST_JWT_SECRET is the
// storage box's signing key, shared with every other project that uploads to
// it, so a default here is not a convenience: it is publication.
const SELFHOST_JWT_SECRET = requiredSecret("SELFHOST_JWT_SECRET");
const ORACLE_UPLOAD_API_KEY = requiredSecret("ORACLE_UPLOAD_API_KEY");

/**
 * Reads a secret that has no sensible default.
 *
 * Every secret in this file goes through here so a missing one fails at boot
 * instead of at the first request that needs it. An empty `ADMIN_JWT_SECRET`
 * reaching Web Crypto as an HMAC key is the specific failure this prevents: it
 * throws "Key length is zero" from inside a request handler, which reads like a
 * bug in the code rather than a missing deploy setting.
 *
 * @param name The environment variable to read.
 * @returns Its value, guaranteed non-empty.
 * @throws If it is unset or empty.
 */
function requiredSecret(name: string): string {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(
      `${name} is not set. Set it with \`npx supabase secrets set ${name}=...\`; ` +
        "there is deliberately no default.",
    );
  }
  return value;
}

// Untyped on purpose. Every query here selects a table by a runtime string
// from WRITABLE_TABLES, so supabase-js cannot narrow the row type and its
// generic machinery recurses until tsc gives up with "type instantiation is
// excessively deep". The safety that matters is the allowlist, not the types.
// deno-lint-ignore no-explicit-any
const db = createClient(SUPABASE_URL, SERVICE_ROLE_KEY) as any;

const JWT_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

// Every table an admin is allowed to insert/update/delete through this
// gateway. Deliberately explicit rather than accepting any table name.
const WRITABLE_TABLES = new Set([
  "personal_info", "education", "experience", "projects", "skills",
  "achievements", "blog_posts", "courses", "contact_messages",
  "blog_comments", "languages", "site_settings", "task_requests",
]);

// Tables where the admin needs to see rows the public anon key can't
// (drafts, the contact inbox) - a small "select" operation on the same
// gateway, service-role, bypasses RLS for these only.
const ADMIN_READABLE_TABLES: Record<string, { column: string; ascending: boolean }> = {
  blog_posts: { column: "created_at", ascending: false },
  contact_messages: { column: "created_at", ascending: false },
  task_requests: { column: "created_at", ascending: false },
};

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type, x-file-type, x-file-name",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

// --- Minimal HS256 JWT (sign + verify only) via Web Crypto -----------------
// Deliberately hand-rolled instead of a JWT library: the only thing this
// service ever needs is "sign a payload, verify a payload came from us."

function base64UrlEncode(bytes: Uint8Array): string {
  let str = "";
  for (const byte of bytes) str += String.fromCharCode(byte);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Backed by an explicitly allocated ArrayBuffer. `Uint8Array.from` yields
// `Uint8Array<ArrayBufferLike>`, which crypto.subtle.verify rejects because
// ArrayBufferLike also admits SharedArrayBuffer.
function base64UrlDecode(str: string): Uint8Array<ArrayBuffer> {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/").padEnd(str.length + ((4 - (str.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmacKey(secret = JWT_SECRET) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function signJwt(payload: Record<string, unknown>, secret = JWT_SECRET): Promise<string> {
  const encHeader = base64UrlEncode(new TextEncoder().encode(JSON.stringify({ alg: "HS256", typ: "JWT" })));
  const encPayload = base64UrlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const data = `${encHeader}.${encPayload}`;
  const signature = await crypto.subtle.sign("HMAC", await hmacKey(secret), new TextEncoder().encode(data));
  return `${data}.${base64UrlEncode(new Uint8Array(signature))}`;
}

async function verifyJwt(token: string): Promise<Record<string, unknown> | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [encHeader, encPayload, encSignature] = parts;
  const valid = await crypto.subtle.verify(
    "HMAC",
    await hmacKey(),
    base64UrlDecode(encSignature),
    new TextEncoder().encode(`${encHeader}.${encPayload}`),
  );
  if (!valid) return null;

  const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(encPayload)));
  if (typeof payload.exp === "number" && Date.now() / 1000 > payload.exp) return null;
  return payload;
}

async function requireAdmin(req: Request): Promise<Record<string, unknown> | null> {
  const header = req.headers.get("authorization") ?? "";
  const token = header.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;
  const payload = await verifyJwt(token);
  if (!payload || payload.role !== "admin") return null;
  return payload;
}

// --- Route handlers ----------------------------------------------------

async function handleLogin(req: Request): Promise<Response> {
  const { username, password } = await req.json().catch(() => ({}));
  if (!username || !password) return json({ error: "Missing username/password" }, 400);

  const { data: user } = await db
    .from("admin_users")
    .select("id, username, password_hash, is_active")
    .eq("username", username)
    .maybeSingle();

  if (!user || !user.is_active || !(await bcrypt.compare(password, user.password_hash))) {
    return json({ error: "Invalid credentials" }, 401);
  }

  await db.from("admin_users").update({ last_login_at: new Date().toISOString() }).eq("id", user.id);

  const now = Math.floor(Date.now() / 1000);
  const token = await signJwt({
    sub: user.id,
    username: user.username,
    role: "admin",
    iat: now,
    exp: now + JWT_TTL_SECONDS,
  });

  return json({ token, user: { id: user.id, username: user.username } });
}

async function handleData(req: Request): Promise<Response> {
  const body = await req.json().catch(() => ({}));
  const { table, operation } = body;

  if (typeof table !== "string" || !WRITABLE_TABLES.has(table)) {
    return json({ error: "Table not allowed" }, 400);
  }

  if (operation === "select") {
    const order = ADMIN_READABLE_TABLES[table];
    if (!order) return json({ error: "Table not readable through this gateway" }, 400);
    const { data, error } = await db.from(table).select("*").order(order.column, { ascending: order.ascending });
    if (error) return json({ error: error.message }, 400);
    return json({ data });
  }

  if (operation === "insert") {
    const { data, error } = await db.from(table).insert(body.payload).select().single();
    if (error) return json({ error: error.message }, 400);
    return json({ data });
  }

  // Most tables key on `id` (uuid); site_settings keys on `key` (text) - the
  // client passes idColumn for those instead of hardcoding a per-table map here.
  const idColumn = typeof body.idColumn === "string" ? body.idColumn : "id";

  if (operation === "upsert") {
    const { data, error } = await db.from(table).upsert(body.payload, { onConflict: idColumn }).select().single();
    if (error) return json({ error: error.message }, 400);
    return json({ data });
  }

  if (operation === "update") {
    if (!body.id) return json({ error: "Missing id" }, 400);
    const { data, error } = await db.from(table).update(body.payload).eq(idColumn, body.id).select().single();
    if (error) return json({ error: error.message }, 400);
    return json({ data });
  }

  if (operation === "delete") {
    if (!body.id) return json({ error: "Missing id" }, 400);
    const { error } = await db.from(table).delete().eq(idColumn, body.id);
    if (error) return json({ error: error.message }, 400);
    return json({ success: true });
  }

  return json({ error: "Unknown operation" }, 400);
}

/** Upload body cap. The largest thing the admin UI sends is a resume PDF. */
const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;

/**
 * Extensions each file type may carry.
 *
 * Not a formality: the storage box serves what it is given from a domain that
 * is not sandboxed from this one, so an `.html` or `.svg` accepted here is
 * script running on the storage origin later.
 */
const ALLOWED_EXTENSIONS: Record<string, string[]> = {
  images: ["png", "jpg", "jpeg", "webp", "gif", "avif"],
  documents: ["pdf"],
};

/**
 * Whether a client-supplied name is safe to use as a storage path segment.
 *
 * The admin UI builds this name, but the header is set by the caller, and an
 * admin token is not a reason to hand a path separator to another service.
 *
 * @param name The `x-file-name` header value.
 * @param fileType Already validated against ALLOWED_EXTENSIONS' keys.
 */
function isSafeFileName(name: string, fileType: string): boolean {
  if (name.length === 0 || name.length > 200) return false;
  if (name.startsWith(".")) return false;
  // deno-lint-ignore no-control-regex
  if (/[/\\\x00-\x1f]/.test(name)) return false;
  if (name.includes("..")) return false;
  const extension = name.split(".").pop()?.toLowerCase() ?? "";
  return ALLOWED_EXTENSIONS[fileType].includes(extension);
}

async function handleUpload(req: Request): Promise<Response> {
  const fileType = req.headers.get("x-file-type");
  const fileName = req.headers.get("x-file-name");
  if (!fileType || !fileName || !["images", "documents"].includes(fileType)) {
    return json({ error: "Missing or invalid x-file-type/x-file-name headers" }, 400);
  }
  if (!isSafeFileName(fileName, fileType)) {
    return json(
      { error: `Invalid file name. Allowed extensions: ${ALLOWED_EXTENSIONS[fileType].join(", ")}` },
      400,
    );
  }

  const declaredLength = Number(req.headers.get("content-length") ?? "0");
  if (declaredLength > MAX_UPLOAD_BYTES) {
    return json({ error: `File is larger than ${MAX_UPLOAD_BYTES / 1024 / 1024} MB` }, 413);
  }

  const fileBuffer = await req.arrayBuffer();
  if (fileBuffer.byteLength > MAX_UPLOAD_BYTES) {
    return json({ error: `File is larger than ${MAX_UPLOAD_BYTES / 1024 / 1024} MB` }, 413);
  }

  const now = Math.floor(Date.now() / 1000);
  const adminToken = await signJwt({ is_admin: true, iat: now, exp: now + 300 }, SELFHOST_JWT_SECRET);

  const headers: Record<string, string> = {
    "Authorization": `Bearer ${adminToken}`,
    "x-upload-key": ORACLE_UPLOAD_API_KEY,
    "x-file-type": fileType,
    "x-app-name": ORACLE_APP_NAME,
    "x-file-name": fileName,
    "Content-Type": "application/octet-stream",
  };

  const uploadRes = await fetch(`${ORACLE_UPLOAD_BASE_URL.replace(/\/+$/, "")}${ORACLE_UPLOAD_PATH}`, {
    method: "POST",
    headers,
    body: fileBuffer,
  });

  const result = await uploadRes.json().catch(() => ({}));
  if (!uploadRes.ok || !result.success) {
    return json({ error: result.error ?? "Upload to storage failed" }, 502);
  }

  const publicUrl = `${ORACLE_PUBLIC_BASE_URL}/${fileType}/${ORACLE_APP_NAME}/${fileName}`;
  return json({ url: publicUrl });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  const url = new URL(req.url);

  if (req.method === "POST" && url.pathname.endsWith("/login")) {
    return handleLogin(req);
  }

  if (url.pathname.endsWith("/data") || url.pathname.endsWith("/upload")) {
    const admin = await requireAdmin(req);
    if (!admin) return json({ error: "Unauthorized" }, 401);

    if (req.method === "POST" && url.pathname.endsWith("/data")) return handleData(req);
    if (req.method === "POST" && url.pathname.endsWith("/upload")) return handleUpload(req);
  }

  return json({ error: "Route or method not found" }, 404);
});
