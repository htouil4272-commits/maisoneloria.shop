import { OrderData } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function submitOrder(data: OrderData): Promise<{ success: boolean; orderNumber?: string; error?: string }> {
  try {
    const response = await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { success: false, error: error.message || 'حدث خطأ، المرجو المحاولة مرة أخرى' };
    }

    const result = await response.json();
    return { success: true, orderNumber: result.orderNumber || result.order_number };
  } catch {
    return { success: false, error: 'تعذر الاتصال بالخادم، المرجو المحاولة مرة أخرى' };
  }
}
