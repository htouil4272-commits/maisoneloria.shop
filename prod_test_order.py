import urllib.request, json

payload = json.dumps({
  "customer_name": "Prod Verification Test",
  "customer_phone": "0600000000",
  "customer_city": "Casablanca",
  "items": [{"product_name": "Test Item", "variant": "Test Variant", "quantity": 1, "price": 10.0}],
  "total": 10.0
}).encode('utf-8')

req = urllib.request.Request(
    "https://maisoneloria.shop/api/orders", 
    data=payload, 
    headers={
        "Content-Type": "application/json",
        "User-Agent": "MaisonEloria-Test/1.0"
    }
)

try:
    res = urllib.request.urlopen(req, timeout=10)
    print("STATUS:", res.status)
    print(res.read().decode())
except urllib.error.HTTPError as e:
    print("ERROR:", e.code, e.read().decode())
except Exception as ex:
    print("EXCEPTION:", ex)