import urllib.request
import json
import time

url = "https://graph.facebook.com/v19.0/749884987768036/events?access_token=EAAbh69FmvrYBRQNNk3cAZB6H0jr3HVDiDKtMZBLtPookVIh24EcPUxzn27YzM31fDklOom9yZBqJvvsKLLUDk6eTGanmBw3fkFbTnbAfTHD7h1rz9AQkxF2r5WcvmsojBRJacINDNTEF0ZBT4k96wUv47ysyN5APNrYWhgzUPWY20IzVr1X4gBLv1iXUeAZDZD"

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
    "test_event_code": "TEST87958"
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
