import { Env, badRequest, jsonResponse, rateLimit, getClientIp, signAdminToken, corsHeaders } from '../../_lib';

export const onRequestOptions: PagesFunction<Env> = async ({ request }) => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request.headers.get('Origin')),
  });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const origin = request.headers.get('Origin');

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return badRequest('صيغة غير صحيحة', origin);
  }

  const ip = getClientIp(request);
  const allowed = await rateLimit(env, ip, 'admin-login', 6, 300);
  if (!allowed) {
    return jsonResponse(
      { success: false, error: 'محاولات كثيرة. حاول لاحقاً.' },
      429,
      origin,
    );
  }

  const expected = env.ADMIN_PASSWORD;
  if (!expected) {
    return jsonResponse(
      { success: false, error: 'ADMIN_PASSWORD غير مهيأ' },
      500,
      origin,
    );
  }

  if ((body.password || '') !== expected) {
    return jsonResponse({ success: false, error: 'كلمة السر غير صحيحة' }, 401, origin);
  }

  const token = await signAdminToken(env);
  return jsonResponse({ success: true, token }, 200, origin);
};
