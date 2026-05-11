import urllib.request
import json

url = 'https://maisoneloria.shop/api/analytics/events'
data = {
    "session_id": "test_session_123",
    "event_type": "addtocart",
    "path": "/products/test",
    "metadata_json": {
        "event_id": "test_add_to_cart_002",
        "currency": "MAD",
        "value": "299.00",
        "content_ids": ["prod_1"]
    }
}

req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'})
try:
    response = urllib.request.urlopen(req)
    print("Status:", response.status)
    print("Response:", response.read().decode('utf-8'))
except Exception as e:
    print("Error:", e)
