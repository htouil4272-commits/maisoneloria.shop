import httpx
import asyncio

async def test_capi_addtocart():
    async with httpx.AsyncClient() as client:
        payload = {
            "session_id": "test_session_123",
            "event_type": "addtocart",
            "path": "/products/test",
            "metadata_json": {
                "event_id": "test_add_to_cart_001",
                "currency": "MAD",
                "value": "299.00",
                "content_ids": ["prod_1"]
            }
        }
        res = await client.post("https://api.maisoneloria.shop/api/analytics/events", json=payload)
        print(f"Status: {res.status_code}")
        print(f"Response: {res.text}")

if __name__ == "__main__":
    asyncio.run(test_capi_addtocart())
