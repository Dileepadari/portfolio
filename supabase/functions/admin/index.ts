// Single authenticated gateway for every admin write in the app, plus the
// handful of admin-only reads (drafts, the contact inbox) that public
// visitors shouldn't see via the anon key.
//
// Auth is a self-issued username/password + JWT scheme (admin_users table,
// bcrypt hashes), not supabase.auth - see src/hooks/useAuth.ts for why.
// Routing mirrors the same single Deno.serve + pathname-matching style used
// on the Oracle storage server this also proxies uploads to.

import { createClient } from "npm:@supabase/supabase-js@2";
import bcrypt from "npm:bcryptjs@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const JWT_SECRET = Deno.env.get("ADMIN_JWT_SECRET")!;

// Oracle image/document storage - configurable without touching code.
// Upload and public-read happen to live on different hosts/domains today
// (and the upload endpoint's own returned `url` has a domain bug), so the
// public URL is built here from the known {fileType}/{appName}/{fileName}
// path convention rather than trusted from the upload response.
const ORACLE_UPLOAD_BASE_URL = Deno.env.get("ORACLE_UPLOAD_BASE_URL") ?? "https://supabase.dileepadari.dev";
const ORACLE_PUBLIC_BASE_URL = Deno.env.get("ORACLE_PUBLIC_BASE_URL") ?? "https://mystorage.dileepadari.dev";
const ORACLE_UPLOAD_PATH = Deno.env.get("ORACLE_UPLOAD_PATH") ?? "/functions/v1/upload";
const SELFHOST_JWT_SECRET = Deno.env.get("SELFHOST_JWT_SECRET") ?? "979fdfbfec9ee36526a7cc292d9108805ca0357a83f20cd50c3958e33a01e2b2";
const ORACLE_UPLOAD_API_KEY = Deno.env.get("ORACLE_UPLOAD_API_KEY") ?? "This_is_top_secret_to_upload_to_oracle";
const ORACLE_APP_NAME = Deno.env.get("ORACLE_APP_NAME") ?? "portfolio";

const db = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

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

function base64UrlDecode(str: string): Uint8Array {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/").padEnd(str.length + ((4 - (str.length % 4)) % 4), "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
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

async function handleUpload(req: Request): Promise<Response> {
  const fileType = req.headers.get("x-file-type");
  const fileName = req.headers.get("x-file-name");
  if (!fileType || !fileName || !["images", "documents"].includes(fileType)) {
    return json({ error: "Missing or invalid x-file-type/x-file-name headers" }, 400);
  }

  const fileBuffer = await req.arrayBuffer();

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
