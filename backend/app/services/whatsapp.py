import logging
import httpx
from app.config import settings

logger = logging.getLogger(__name__)

async def send_admin_whatsapp_notification(order) -> None:
    """
    Sends a WhatsApp notification to the admin when a new order is created.
    Requires WHATSAPP_API_TOKEN and WHATSAPP_PHONE_NUMBER_ID in environment variables.
    """
    if not settings.WHATSAPP_API_TOKEN or not settings.WHATSAPP_PHONE_NUMBER_ID:
        logger.info("WhatsApp API credentials not configured. Skipping admin notification.")
        return

    admin_number = settings.WHATSAPP_ADMIN_NUMBER
    
    # Format items
    items_text = ""
    for item in order.items:
        items_text += f"- {item.get('colorNameAr', 'منتج')} (باك {item.get('packQuantity', 1)}) x{item.get('quantity', 1)}\n"

    message = (
        f"🛍️ *طلب جديد!*\n\n"
        f"👤 *الاسم:* {order.customer_name}\n"
        f"📱 *الهاتف:* {order.customer_phone}\n"
        f"📍 *المدينة:* {order.city}\n\n"
        f"📦 *المنتجات:*\n{items_text}\n"
        f"💰 *المجموع:* {order.total} درهم\n"
        f"🔖 *رقم الطلب:* {order.order_number}\n"
    )

    url = f"https://graph.facebook.com/v17.0/{settings.WHATSAPP_PHONE_NUMBER_ID}/messages"
    
    headers = {
        "Authorization": f"Bearer {settings.WHATSAPP_API_TOKEN}",
        "Content-Type": "application/json"
    }

    payload = {
        "messaging_product": "whatsapp",
        "to": admin_number,
        "type": "text",
        "text": {
            "body": message
        }
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, json=payload, timeout=10.0)
            if response.status_code not in (200, 201):
                logger.error(f"Failed to send WhatsApp notification. Status: {response.status_code}, Response: {response.text}")
            else:
                logger.info(f"Admin WhatsApp notification sent for order {order.order_number}")
    except Exception as e:
        logger.error(f"Exception while sending WhatsApp notification: {e}")
