import hashlib
import logging
import time

import httpx

from app.config import settings

logger = logging.getLogger(__name__)


def hash_phone(phone: str) -> str:
    """SHA-256 hash a phone number for CAPI events."""
    return hashlib.sha256(phone.encode("utf-8")).hexdigest()


def format_phone_for_capi(moroccan_phone: str) -> str:
    """Convert 06/07XXXXXXXX to +212XXXXXXXXX format."""
    return "+212" + moroccan_phone[1:]


class TrackingService:
    async def send_meta_capi_event(self, event_name: str, event_id: str, ip_address: str, user_agent: str, custom_data: dict, fbc: str = None, fbp: str = None, phone_international: str = None):
        if not settings.META_ACCESS_TOKEN or not settings.META_PIXEL_ID:
            return

        try:
            event_time = int(time.time())

            user_data = {
                "client_ip_address": ip_address,
                "client_user_agent": user_agent,
            }

            if phone_international:
                user_data["ph"] = [hash_phone(phone_international)]

            if fbc:
                user_data["fbc"] = fbc
            if fbp:
                user_data["fbp"] = fbp

            payload = {
                "data": [
                    {
                        "event_name": event_name,
                        "event_time": event_time,
                        "event_id": event_id,
                        "action_source": "website",
                        "user_data": user_data,
                        "custom_data": custom_data,
                    }
                ],
            }

            if settings.META_TEST_EVENT_CODE:
                payload["test_event_code"] = settings.META_TEST_EVENT_CODE

            url = f"https://graph.facebook.com/v19.0/{settings.META_PIXEL_ID}/events"
            params = {"access_token": settings.META_ACCESS_TOKEN}

            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.post(url, params=params, json=payload)
                if response.status_code == 200:
                    logger.info(f"Meta CAPI event '{event_name}' sent successfully (event_id: {event_id})")
                else:
                    logger.error(f"Meta CAPI error: {response.status_code} - {response.text}")

        except Exception as e:
            logger.error(f"Meta CAPI exception: {e}")

    async def send_fb_capi_event(self, order, phone_international: str):
        """Legacy wrapper used by OrderService for Purchase events."""
        custom_data = {
            "currency": "MAD",
            "value": float(order.total),
            "order_id": order.order_number,
        }
        
        # Build fbc from fbclid if available
        fbc = None
        if getattr(order, 'fbclid', None):
            fbc = f"fb.1.{int(time.time())}.{order.fbclid}"

        await self.send_meta_capi_event(
            event_name="Purchase",
            event_id=order.fb_event_id or order.order_number,
            ip_address=order.ip_address,
            user_agent=order.user_agent,
            custom_data=custom_data,
            fbc=fbc,
            phone_international=phone_international
        )

    async def send_tiktok_capi_event(self, order, phone_international: str):
        if not settings.TIKTOK_ACCESS_TOKEN or not getattr(settings, 'TIKTOK_PIXEL_ID', None):
            return

        try:
            # TikTok requires "+" prefix before hashing
            phone_with_plus = phone_international if phone_international.startswith("+") else f"+{phone_international}"
            hashed_phone = hash_phone(phone_with_plus)

            payload = {
                "pixel_code": settings.TIKTOK_PIXEL_ID,
                "event": "CompletePayment",
                "event_id": order.fb_event_id or order.order_number,
                "timestamp": int(time.time()),
                "context": {
                    "user_agent": order.user_agent,
                    "ip": order.ip_address,
                    "user": {
                        "phone_id": hashed_phone,
                    },
                },
                "properties": {
                    "currency": "MAD",
                    "value": float(order.total),
                    "order_id": order.order_number,
                },
            }

            if order.ttclid:
                payload["context"]["user"]["ttclid"] = order.ttclid

            url = "https://business-api.tiktok.com/open_api/v1.3/event/track/"
            headers = {
                "Access-Token": settings.TIKTOK_ACCESS_TOKEN,
                "Content-Type": "application/json",
            }

            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.post(url, headers=headers, json={"batch": [payload]})
                if response.status_code == 200:
                    logger.info(f"TikTok CAPI event sent for {order.order_number}")
                else:
                    logger.error(f"TikTok CAPI error: {response.status_code} - {response.text}")

        except Exception as e:
            logger.error(f"TikTok CAPI exception: {e}")

    async def send_snap_capi_event(self, order, phone_international: str):
        if not getattr(settings, 'SNAP_ACCESS_TOKEN', None) or not getattr(settings, 'SNAP_PIXEL_ID', None):
            return

        try:
            hashed_phone = hash_phone(phone_international)

            payload = {
                "pixel_id": settings.SNAP_PIXEL_ID,
                "event_type": "PURCHASE",
                "event_conversion_type": "WEB",
                "event_tag": "order",
                "timestamp": int(time.time() * 1000),
                "hashed_phone_number": hashed_phone,
                "user_agent": order.user_agent,
                "ip_address": order.ip_address,
                "price": str(order.total),
                "currency": "MAD",
                "transaction_id": order.order_number,
            }

            if order.sclid:
                payload["click_id"] = order.sclid

            url = "https://tr.snapchat.com/v2/conversion"
            headers = {
                "Authorization": f"Bearer {settings.SNAP_ACCESS_TOKEN}",
                "Content-Type": "application/json",
            }

            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.post(url, headers=headers, json=payload)
                if response.status_code in (200, 202):
                    logger.info(f"Snap CAPI event sent for {order.order_number}")
                else:
                    logger.error(f"Snap CAPI error: {response.status_code} - {response.text}")

        except Exception as e:
            logger.error(f"Snap CAPI exception: {e}")


tracking_service = TrackingService()