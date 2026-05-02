# Maison Eloria - Backend API

FastAPI backend for Maison Eloria Moroccan DTC e-commerce store.

## Tech Stack

- **FastAPI** - Async Python web framework
- **SQLAlchemy 2.0** - Async ORM with asyncpg
- **PostgreSQL** - Primary database
- **Alembic** - Database migrations (auto-run on startup)
- **MaxMind GeoIP** - Fraud detection
- **Google Sheets** - Order logging
- **CAPI** - Facebook, TikTok, Snapchat conversion tracking

## Setup

### 1. Install dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your settings
```

### 3. Run the server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 4. (Optional) Download MaxMind DB

```bash
python scripts/download_maxmind.py
```

## Docker

```bash
docker build -t maisoneloria-backend .
docker run -p 8000:8000 --env-file .env maisoneloria-backend
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check |
| POST | /api/orders | Create order |
| GET | /api/orders/{order_number} | Get order details |
| POST | /api/contact | Submit contact form |
| POST | /api/newsletter | Subscribe newsletter |
| GET | /api/admin/orders | List orders (auth) |
| PATCH | /api/admin/orders/{order_number} | Update status (auth) |
| GET | /api/admin/stats | Dashboard stats (auth) |
| GET | /api/admin/orders/export | CSV export (auth) |

## Project Structure

```
backend/
├── app/
│   ├── api/           # Route handlers
│   ├── models/        # SQLAlchemy models
│   ├── schemas/       # Pydantic schemas
│   ├── services/      # Business logic
│   ├── middleware/    # Rate limiting
│   ├── migrations/    # Alembic migrations
│   ├── config.py      # Settings
│   ├── database.py    # DB connection
│   └── main.py        # App entry point
├── scripts/           # Utility scripts
├── alembic.ini        # Alembic config
├── requirements.txt   # Python dependencies
├── Dockerfile
└── .env.example
```
