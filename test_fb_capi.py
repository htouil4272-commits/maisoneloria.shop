import urllib.request
import json
import time

url = "https://graph.facebook.com/v19.0/928755302819513/events?access_token=EAAbLorAUoXkBRf0gVlSIK0j995mNuxDR3EdKVzsm60kYmZBkpPVxevV9KeZAvtZATCcAxsRk6R4nRMHjgQrLAaIBUvpebZCH8SyZBA4eIGiGMk0vyoKEaJg80teMGZCa5CEWisY2QSJ2tpTqP2N71WTnwe8W1ilhawH0Grbe8mGUwOlmj6bt8JGpMZBPj6X9gZDZD"

data = {
    "data": [
        {
            "event_name": "TestEvent",
            "event_time": int(time.time()),
            "action_source": "website",
            "user_data": {
                "client_ip_address": "8.8.8.8",
                "client_user_agent": "TestAgent"
            }
        }
    ],
    "test_event_code": "TEST97254"
}

req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'})
try:
    response = urllib.request.urlopen(req)
    print("Status:", response.status)
    print("Response:", response.read().decode('utf-8'))
except Exception as e:
    if hasattr(e, 'read'):
        print("Error response:", e.read().decode('utf-8'))
    print("Error:", e)
