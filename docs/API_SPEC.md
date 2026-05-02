# API SPECIFICATION — Maison Eloria

## Base URL
- **Production**: `https://api.maisoneloria.shop`
- **Development**: `http://localhost:8000`

## Headers
All requests use:
```
Content-Type: application/json
```

---

## Endpoints

### 1. Health Check

```
GET /api/health
```

**Response** `200`:
```json
{
  "status": "ok",
  "timestamp": "2026-05-02T16:00:00Z",
  "version": "1.0.0"
}
```

---

### 2. Create Order

```
POST /api/orders
```

**Request Body**:
```json
{
  "customer_name": "سارة الحسني",
  "customer_phone": "0661234567",
  "items": [
    {
      "pack_id": "pack_6",
      "color_id": "beige",
      "color_name": "بيج",
      "pieces": 6,
      "price": 330,
      "quantity": 1
    }
  ],
  "total": 330,
  "utm_source": "facebook",
  "utm_medium": "cpc",
  "utm_campaign": "pack-famille",
  "fbclid": "abc123def456",
  "ttclid": "xyz789",
  "sclid": "snap456",
  "fb_event_id": "evt_1714665600_abc123def",
  "page_url": "https://maisoneloria.shop/product/housse-chaise-beige",
  "user_agent": "Mozilla/5.0..."
}
```

**Validation Rules**:
- `customer_name`: required, min 3 chars, max 255 chars
- `customer_phone`: required, Moroccan format (06/07 + 8 digits)
- `items`: required, non-empty array
- `items[].pack_id`: must be one of `pack_4`, `pack_6`, `pack_9`
- `items[].color_id`: must be valid color ID
- `items[].price`: must match pack price
- `total`: must equal sum of items prices × quantities

**Processing Pipeline**:
1. Validate request body (Pydantic)
2. Rate limit check (IP-based)
3. Fraud check (MaxMind)
4. Generate order number (`ELO-XXXX`, sequential)
5. Save to PostgreSQL
6. Send to Google Sheets (async, non-blocking)
7. Fire CAPI events to FB/TikTok/Snap (async, non-blocking)
8. Return success

**Response** `201`:
```json
{
  "success": true,
  "order": {
    "order_number": "ELO-1234",
    "status": "pending",
    "total": 330,
    "delivery_estimate": "2-4 أيام عمل",
    "created_at": "2026-05-02T16:00:00Z"
  }
}
```

**Response** `400` (Validation Error):
```json
{
  "success": false,
  "error": "validation_error",
  "message": "المرجو إدخال رقم هاتف مغربي صحيح",
  "details": [
    {"field": "customer_phone", "message": "Invalid Moroccan phone number"}
  ]
}
```

**Response** `403` (Fraud Block):
```json
{
  "success": false,
  "error": "order_rejected",
  "message": "عذراً، لا يمكن معالجة طلبك حالياً. تواصل معنا على WhatsApp"
}
```

**Response** `429` (Rate Limited):
```json
{
  "success": false,
  "error": "rate_limited",
  "message": "الرجاء الانتظار قبل إعادة المحاولة"
}
```

---

### 3. Get Order Status (for Thank You page)

```
GET /api/orders/{order_number}
```

**Response** `200`:
```json
{
  "order_number": "ELO-1234",
  "status": "pending",
  "total": 330,
  "items": [
    {
      "pack_id": "pack_6",
      "color_name": "بيج",
      "pieces": 6,
      "price": 330,
      "quantity": 1
    }
  ],
  "delivery_estimate": "2-4 أيام عمل",
  "created_at": "2026-05-02T16:00:00Z"
}
```

**Response** `404`:
```json
{
  "success": false,
  "error": "not_found",
  "message": "الطلب غير موجود"
}
```

---

### 4. Contact Form

```
POST /api/contact
```

**Request Body**:
```json
{
  "name": "محمد",
  "phone": "0661234567",
  "message": "عندي سؤال على المنتج..."
}
```

**Validation**:
- `name`: required, min 2 chars
- `phone`: required, Moroccan format
- `message`: required, min 10 chars, max 2000 chars

**Response** `201`:
```json
{
  "success": true,
  "message": "شكراً، سنتواصل معك قريباً"
}
```

---

### 5. Newsletter Subscription

```
POST /api/newsletter
```

**Request Body**:
```json
{
  "phone": "0661234567",
  "source": "exit_popup"
}
```

**Response** `201`:
```json
{
  "success": true,
  "message": "تم التسجيل بنجاح"
}
```

---

### 6. Admin — List Orders

```
GET /api/admin/orders?page=1&limit=20&status=pending
```

**Authentication**: Basic Auth
```
Authorization: Basic base64(admin:password)
```

**Query Parameters**:
- `page`: pagination (default 1)
- `limit`: items per page (default 20, max 100)
- `status`: filter by status (optional)
- `search`: search by name/phone/order_number (optional)
- `from_date`: filter from date (optional)
- `to_date`: filter to date (optional)

**Response** `200`:
```json
{
  "orders": [
    {
      "id": 1,
      "order_number": "ELO-1234",
      "customer_name": "سارة الحسني",
      "customer_phone": "0661234567",
      "items": [...],
      "total": 330,
      "status": "pending",
      "ip_address": "xxx.xxx.xxx.xxx",
      "country": "MA",
      "city": "Casablanca",
      "is_vpn": false,
      "fraud_score": 0.1,
      "utm_source": "facebook",
      "created_at": "2026-05-02T16:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "pages": 8
  }
}
```

---

### 7. Admin — Update Order Status

```
PATCH /api/admin/orders/{order_number}
```

**Authentication**: Basic Auth

**Request Body**:
```json
{
  "status": "confirmed"
}
```

**Valid statuses**: `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`

**Response** `200`:
```json
{
  "success": true,
  "order_number": "ELO-1234",
  "status": "confirmed"
}
```

---

### 8. Admin — Dashboard Stats

```
GET /api/admin/stats
```

**Authentication**: Basic Auth

**Response** `200`:
```json
{
  "today": {
    "orders": 12,
    "revenue": 4560,
    "avg_order_value": 380
  },
  "this_week": {
    "orders": 67,
    "revenue": 24780,
    "avg_order_value": 369.85
  },
  "this_month": {
    "orders": 312,
    "revenue": 112500,
    "avg_order_value": 360.58
  },
  "by_status": {
    "pending": 8,
    "confirmed": 45,
    "shipped": 120,
    "delivered": 134,
    "cancelled": 5
  },
  "top_colors": [
    {"color": "beige", "count": 89},
    {"color": "gris", "count": 76},
    {"color": "marron", "count": 52}
  ],
  "top_packs": [
    {"pack": "pack_9", "count": 145},
    {"pack": "pack_6", "count": 112},
    {"pack": "pack_4", "count": 55}
  ]
}
```

---

### 9. Admin — Export CSV

```
GET /api/admin/orders/export?from_date=2026-05-01&to_date=2026-05-31
```

**Authentication**: Basic Auth

**Response**: CSV file download

```csv
order_number,customer_name,customer_phone,pack_type,colors,total,status,city,utm_source,created_at
ELO-1234,سارة الحسني,0661234567,pack_6,beige,330,pending,Casablanca,facebook,2026-05-02T16:00:00Z
```

---

## Error Response Format

All errors follow this format:
```json
{
  "success": false,
  "error": "error_code",
  "message": "Human-readable message in Arabic",
  "details": []  // Optional: field-level errors
}
```

### Error Codes
| Code | HTTP | Description |
|------|------|-------------|
| `validation_error` | 400 | Invalid request data |
| `not_found` | 404 | Resource not found |
| `order_rejected` | 403 | Order blocked (fraud) |
| `rate_limited` | 429 | Too many requests |
| `internal_error` | 500 | Server error |
| `unauthorized` | 401 | Admin auth failed |

---

## CORS Configuration

```python
origins = [
    "https://maisoneloria.shop",
    "https://www.maisoneloria.shop",
    "http://localhost:3000",  # Dev only
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "OPTIONS"],
    allow_headers=["*"],
)
```

---

## Database Migration (Auto on Startup)

```python
# app/main.py

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Run migrations on startup
    await run_migrations()
    yield
    # Cleanup
    await engine.dispose()

app = FastAPI(lifespan=lifespan)
```
