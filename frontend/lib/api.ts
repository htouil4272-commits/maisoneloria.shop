import { OrderData } from './types';
import { formatApiErrorBody } from './http-errors';
import { computeOrderTotalMAD } from './utils';

/**
 * Base URL for the API.
 *
 * En production le frontend et les Cloudflare Pages Functions sont servis depuis
 * la même origine, donc on utilise des chemins relatifs (`/api/...`).
 * En local, on peut configurer NEXT_PUBLIC_API_URL pour pointer vers
 * `npx wrangler pages dev` ou un backend de développement.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function submitOrder(data: OrderData): Promise<{
  success: boolean;
  orderNumber?: string;
  message?: string;
  error?: string;
}> {
  try {
    const phone = data.phone.replace(/\s/g, '');
    const total = computeOrderTotalMAD(data.items);

    const payload = {
      customer_name: data.name.trim(),
      customer_phone: phone,
      customer_city: data.city.trim(),
      items: data.items.map((item) => ({
        product_name: `غطاء كرسي - ${item.colorNameAr}`,
        variant: `باك ${item.packQuantity} - ${item.colorNameAr}`,
        quantity: item.quantity,
        price: Math.round(item.price * 100) / 100,
      })),
      total,
      page_url: data.landing_page,
      utm_source: data.utm_source,
      utm_medium: data.utm_medium,
      utm_campaign: data.utm_campaign,
      fbclid: data.fbclid,
      ttclid: data.ttclid,
      sclid: data.sclid,
      fb_event_id: data.event_id,
    };

    const response = await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    let result: any = null;
    try {
      result = await response.json();
    } catch {
      result = null;
    }

    if (!response.ok || !result?.success) {
      return {
        success: false,
        error: formatApiErrorBody(result, 'حدث خطأ، المرجو المحاولة مرة أخرى'),
      };
    }

    return {
      success: true,
      orderNumber: result.order?.order_number,
      message: result.message,
    };
  } catch {
    return { success: false, error: 'تعذر الاتصال بالخادم، المرجو المحاولة مرة أخرى' };
  }
}
