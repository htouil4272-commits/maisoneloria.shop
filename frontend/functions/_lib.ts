export interface Env {
  DB: D1Database;
  ADMIN_PASSWORD?: string;
  ADMIN_TOKEN_SECRET?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
}

export const ALLOWED_ORIGINS = [
  'https://maisoneloria.shop',
  'https://www.maisoneloria.shop',
  'https://maisoneloria.pages.dev',
];

export function corsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigin =
    origin && (ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.maisoneloria.pages.dev'))
      ? origin
      : ALLOWED_ORIGINS[0];

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

export function jsonResponse(
  body: unknown,
  status = 200,
  origin: string | null = null,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...corsHeaders(origin),
    },
  });
}

export function badRequest(message: string, origin: string | null) {
  return jsonResponse({ success: false, error: message }, 400, origin);
}

export function unauthorized(origin: string | null) {
  return jsonResponse({ success: false, error: 'غير مصرح' }, 401, origin);
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

export function generateOrderNumber(): string {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  const ts = Date.now().toString(36).slice(-4).toUpperCase();
  return `ELO-${ts}${random}`;
}

const PHONE_REGEX = /^(06|07)\d{8}$/;
export function isValidMoroccanPhone(value: string): boolean {
  return PHONE_REGEX.test(value.replace(/\s/g, ''));
}

export async function rateLimit(
  env: Env,
  ip: string,
  bucket: string,
  maxRequests: number,
  windowSeconds: number,
): Promise<boolean> {
  const now = new Date();
  const cutoff = new Date(now.getTime() - windowSeconds * 1000).toISOString();

  await env.DB.prepare(
    `DELETE FROM rate_limits WHERE window_start < ?1`,
  )
    .bind(cutoff)
    .run();

  const existing = await env.DB.prepare(
    `SELECT count, window_start FROM rate_limits WHERE ip_address = ?1 AND bucket = ?2`,
  )
    .bind(ip, bucket)
    .first<{ count: number; window_start: string }>();

  if (!existing) {
    await env.DB.prepare(
      `INSERT INTO rate_limits (ip_address, bucket, count, window_start) VALUES (?1, ?2, 1, ?3)`,
    )
      .bind(ip, bucket, now.toISOString())
      .run();
    return true;
  }

  if (existing.count >= maxRequests) {
    return false;
  }

  await env.DB.prepare(
    `UPDATE rate_limits SET count = count + 1 WHERE ip_address = ?1 AND bucket = ?2`,
  )
    .bind(ip, bucket)
    .run();
  return true;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function base64UrlEncode(input: string): string {
  return btoa(input).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(input: string): string {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/');
  const padLen = (4 - (padded.length % 4)) % 4;
  return atob(padded + '='.repeat(padLen));
}

async function hmacSha256(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return bytesToHex(new Uint8Array(sig));
}

export async function signAdminToken(env: Env, ttlSeconds = 60 * 60 * 12): Promise<string> {
  const secret = env.ADMIN_TOKEN_SECRET || env.ADMIN_PASSWORD || 'change-me';
  const payload = {
    role: 'admin',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };
  const encoded = base64UrlEncode(JSON.stringify(payload));
  const signature = await hmacSha256(secret, encoded);
  return `${encoded}.${signature}`;
}

export async function verifyAdminToken(env: Env, token: string | null): Promise<boolean> {
  if (!token) return false;
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return false;
  const secret = env.ADMIN_TOKEN_SECRET || env.ADMIN_PASSWORD || 'change-me';
  const expected = await hmacSha256(secret, encoded);
  if (expected !== signature) return false;
  try {
    const payload = JSON.parse(base64UrlDecode(encoded)) as { exp?: number };
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return false;
    return true;
  } catch {
    return false;
  }
}

export function readAdminToken(request: Request): string | null {
  const auth = request.headers.get('Authorization');
  if (auth?.startsWith('Bearer ')) return auth.slice(7);
  return null;
}

export async function notifyTelegram(env: Env, message: string): Promise<void> {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return;
  try {
    await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });
  } catch {
    // ignore notification failures, never block the order
  }
}
