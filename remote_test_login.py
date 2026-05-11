import urllib.request, json
req = urllib.request.Request(
    'https://maisoneloria.shop/api/admin/login',
    data=json.dumps({'username':'Hamzaeloria01','password':'0668110109zaki'}).encode('utf-8'),
    headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
)
try:
    print(urllib.request.urlopen(req).read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print(f"Error {e.code}: {e.read().decode('utf-8')}")