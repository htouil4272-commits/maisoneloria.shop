import {
  Env,
  badRequest,
  corsHeaders,
  generateOrderNumber,
  getClientIp,
  isValidMoroccanPhone,
  jsonResponse,
  notifyTelegram,
  rateLimit,
} from '../_lib';

interface OrderItemPayload {
  product_name?: string;
  variant?: string;
  quantity?: number;
  price?: number;
}

interface OrderPayload {
  customer_name?: string;
  customer_phone?: string;
  customer_city?: string;
  items?: OrderItemPayload[];
  total?: number;
  page_url?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  fbclid?: string;
  ttclid?: string;
  sclid?: string;
  fb_event_id?: string;
}

export const onRequestOptions: PagesFunction<Env> = async ({ request }) => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request.headers.get('Origin')),
  });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const origin = request.headers.get('Origin');

  let body: OrderPayload;
  try {
    body = await request.json<OrderPayload>();
  } catch {
    return badRequest('صيغة البيانات غير صحيحة', origin);
  }

  const name = (body.customer_name || '').trim();
  const phone = (body.customer_phone || '').trim().replace(/\s/g, '');
  const city = (body.customer_city || '').trim();
  const items = Array.isArray(body.items) ? body.items : [];
  const total = Number(body.total);

  if (name.length < 3) return badRequest('الاسم يجب أن يكون 3 أحرف على الأقل', origin);
  if (!isValidMoroccanPhone(phone))
    return badRequest('رقم الهاتف خاصو يبدا ب 06 أو 07 ويكون 10 أرقام', origin);
  if (city.length < 2) return badRequest('المرجو إدخال المدينة', origin);
  if (!items.length) return badRequest('السلة فارغة', origin);
  if (!Number.isFinite(total) || total <= 0)
    return badRequest('المجموع غير صحيح', origin);

  for (const item of items) {
    if (
      !item ||
      typeof item.product_name !== 'string' ||
      !Number.isFinite(Number(item.quantity)) ||
      Number(item.quantity) < 1 ||
      !Number.isFinite(Number(item.price)) ||
      Number(item.price) <= 0
    ) {
      return badRequest('بيانات المنتج غير صحيحة', origin);
    }
  }

  const ip = getClientIp(request);
  const allowed = await rateLimit(env, ip, 'orders', 5, 600);
  if (!allowed) {
    return jsonResponse(
      {
        success: false,
        error: 'تجاوزت الحد المسموح ديال الطلبات. حاول من بعد شوية.',
      },
      429,
      origin,
    );
  }

  const orderNumber = generateOrderNumber();
  const userAgent = request.headers.get('User-Agent') || '';

  await env.DB.prepare(
    `INSERT INTO orders (
       order_number, customer_name, customer_phone, customer_city,
       items, total, status,
       ip_address, user_agent, page_url,
       utm_source, utm_medium, utm_campaign,
       fbclid, ttclid, sclid, fb_event_id
     ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, 'pending', ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16)`,
  )
    .bind(
      orderNumber,
      name,
      phone,
      city,
      JSON.stringify(items),
      total,
      ip,
      userAgent,
      body.page_url ?? null,
      body.utm_source ?? null,
      body.utm_medium ?? null,
      body.utm_campaign ?? null,
      body.fbclid ?? null,
      body.ttclid ?? null,
      body.sclid ?? null,
      body.fb_event_id ?? null,
    )
    .run();

  const itemsSummary = items
    .map((it) => `• ${it.product_name} ×${it.quantity} — ${Number(it.price).toFixed(2)} درهم`)
    .join('\n');

  const notification = [
    '🛎️ <b>طلب جديد على Maison Eloria</b>',
    '',
    `📦 رقم الطلب: <code>${orderNumber}</code>`,
    `👤 الاسم: ${name}`,
    `📞 الهاتف: ${phone}`,
    `🏙️ المدينة: ${city}`,
    `💰 المجموع: ${total} درهم`,
    '',
    itemsSummary,
  ].join('\n');

  await notifyTelegram(env, notification);

  return jsonResponse(
    {
      success: true,
      order: {
        order_number: orderNumber,
        status: 'pending',
        total,
      },
      message: 'شكراً لك، طلبك قيد المراجعة وسنتواصل معك قريباً لتأكيده.',
    },
    201,
    origin,
  );
};
