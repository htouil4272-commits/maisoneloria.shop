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
    async def send_fb_capi_event(self, order, phone_international: str):
        if not settings.FB_ACCESS_TOKEN or not settings.FB_PIXEL_ID:
            return

        try:
            hashed_phone = hash_phone(phone_international)
            event_time = int(time.time())

            payload = {
                "data": [
                    {
                        "event_name": "Purchase",
                        "event_time": event_time,
                        "event_id": order.fb_event_id or order.order_number,
                        "action_source": "website",
                        "user_data": {
                            "ph": [hashed_phone],
                            "client_ip_address": order.ip_address,
                            "client_user_agent": order.user_agent,
                            "country": [hashlib.sha256("ma".encode()).hexdigest()],
                        },
                        "custom_data": {
                            "currency": "MAD",
                            "value": float(order.total),
                            "order_id": order.order_number,
                        },
                    }
                ],
            }

            if order.fbclid:
                payload["data"][0]["user_data"]["fbc"] = f"fb.1.{event_time}.{order.fbclid}"

            url = f"https://graph.facebook.com/v18.0/{settings.FB_PIXEL_ID}/events"
            params = {"access_token": settings.FB_ACCESS_TOKEN}

            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.post(url, params=params, json=payload)
                if response.status_code == 200:
                    logger.info(f"FB CAPI event sent for {order.order_number}")
                else:
                    logger.error(f"FB CAPI error: {response.status_code} - {response.text}")

        except Exception as e:
            logger.error(f"FB CAPI exception: {e}")

    async def send_tiktok_capi_event(self, order, phone_international: str):
        if not settings.TIKTOK_ACCESS_TOKEN or not settings.TIKTOK_PIXEL_ID:
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
        if not settings.SNAP_ACCESS_TOKEN or not settings.SNAP_PIXEL_ID:
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
