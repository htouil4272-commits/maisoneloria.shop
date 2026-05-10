import {
  Env,
  corsHeaders,
  jsonResponse,
  readAdminToken,
  unauthorized,
  verifyAdminToken,
} from '../../_lib';

interface OrderRow {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_city: string;
  items: string;
  total: number;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const onRequestOptions: PagesFunction<Env> = async ({ request }) => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request.headers.get('Origin')),
  });
};

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const origin = request.headers.get('Origin');
  const ok = await verifyAdminToken(env, readAdminToken(request));
  if (!ok) return unauthorized(origin);

  const url = new URL(request.url);
  const status = url.searchParams.get('status');
  const search = url.searchParams.get('search');
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '100', 10) || 100, 500);

  let query = `SELECT id, order_number, customer_name, customer_phone, customer_city,
                      items, total, status, notes, created_at, updated_at
               FROM orders`;
  const conditions: string[] = [];
  const bindings: (string | number)[] = [];

  if (status && ['pending', 'confirmed', 'cancelled'].includes(status)) {
    conditions.push('status = ?');
    bindings.push(status);
  }

  if (search) {
    conditions.push('(customer_name LIKE ? OR customer_phone LIKE ? OR order_number LIKE ?)');
    const like = `%${search}%`;
    bindings.push(like, like, like);
  }

  if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
  query += ' ORDER BY created_at DESC LIMIT ?';
  bindings.push(limit);

  const result = await env.DB.prepare(query).bind(...bindings).all<OrderRow>();
  const counts = await env.DB.prepare(
    `SELECT status, COUNT(*) AS count FROM orders GROUP BY status`,
  ).all<{ status: string; count: number }>();

  return jsonResponse(
    {
      success: true,
      orders: (result.results || []).map((row) => ({
        ...row,
        items: safeParse(row.items),
      })),
      counts: (counts.results || []).reduce<Record<string, number>>((acc, row) => {
        acc[row.status] = row.count;
        return acc;
      }, {}),
    },
    200,
    origin,
  );
};

function safeParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}
