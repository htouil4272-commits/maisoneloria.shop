import {
  Env,
  badRequest,
  corsHeaders,
  jsonResponse,
  readAdminToken,
  unauthorized,
  verifyAdminToken,
} from '../../../../_lib';

const ALLOWED_STATUSES = new Set(['pending', 'confirmed', 'cancelled']);

export const onRequestOptions: PagesFunction<Env> = async ({ request }) => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request.headers.get('Origin')),
  });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env, params }) => {
  const origin = request.headers.get('Origin');
  const ok = await verifyAdminToken(env, readAdminToken(request));
  if (!ok) return unauthorized(origin);

  const id = Number(params.id);
  if (!Number.isFinite(id) || id <= 0) return badRequest('معرّف الطلب غير صحيح', origin);

  let body: { status?: string; notes?: string };
  try {
    body = await request.json();
  } catch {
    return badRequest('صيغة غير صحيحة', origin);
  }

  const status = (body.status || '').trim();
  if (!ALLOWED_STATUSES.has(status)) return badRequest('الحالة غير صحيحة', origin);

  const notes = body.notes?.trim() ?? null;

  const result = await env.DB.prepare(
    `UPDATE orders SET status = ?1, notes = COALESCE(?2, notes), updated_at = datetime('now') WHERE id = ?3`,
  )
    .bind(status, notes, id)
    .run();

  if (!result.success || (result.meta?.changes ?? 0) === 0) {
    return jsonResponse({ success: false, error: 'الطلب غير موجود' }, 404, origin);
  }

  return jsonResponse({ success: true, status, id }, 200, origin);
};
