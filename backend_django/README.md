# SEMURUG CAKE CENTER — DJANGO BACKEND ARCHITECTURE & API SPECIFICATION

This directory contains the production-ready Django REST Framework backend architecture for Semurug Cake Center, configured for PostgreSQL, JWT Authentication, and Redis caching.

## 1. Directory Structure

```text
backend_django/
├── manage.py
├── requirements.txt
├── semurug_cake/
│   ├── __init__.py
│   ├── settings.py      # PostgreSQL, JWT, CORS, Media, Cache setup
│   ├── urls.py          # Root API routing
│   └── wsgi.py
└── apps/
    ├── accounts/        # User registration, JWT login, profiles
    ├── products/        # Categories, Cakes, Ingredients, Sizes
    ├── orders/          # Standard checkout orders & OrderItem
    ├── custom_orders/   # Bespoke cake design orders & references
    ├── reviews/         # Star ratings & moderation
    └── notifications/   # Telegram Bot webhook dispatcher
```

## 2. Environment Variables (.env)

```env
SECRET_KEY="semurug-production-secret-key-cake-luxury"
DEBUG=False
ALLOWED_HOSTS="localhost,127.0.0.1,semurugcakes.com"

# PostgreSQL Database Configuration
DB_NAME=semurug_db
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=5432

# Redis Cache
REDIS_URL=redis://127.0.0.1:6379/1

# Telegram Order Notifications
TELEGRAM_BOT_TOKEN="your_telegram_bot_token"
TELEGRAM_ADMIN_CHAT_ID="your_telegram_chat_id"
```

## 3. Quickstart & Migrations

```bash
# 1. Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run database migrations
python manage.py makemigrations
python manage.py migrate

# 4. Seed initial bakery data
python manage.py loaddata initial_cakes.json

# 5. Create superuser administrator
python manage.py createsuperuser

# 6. Run development server
python manage.py runserver 8000
```

## 4. REST API Endpoints

- `POST /api/auth/register/` - Register new customer
- `POST /api/auth/token/` - Obtain JWT Access & Refresh tokens
- `POST /api/auth/token/refresh/` - Refresh JWT token
- `GET  /api/products/` - Catalog list with filters (`?category=`, `?search=`, `?sort=`)
- `GET  /api/products/<id>/` - Cake details, sizes, ingredients, reviews
- `POST /api/orders/` - Place order (Guest or Authenticated)
- `GET  /api/orders/my-orders/` - Customer order history
- `POST /api/custom-orders/` - Submit custom cake specification & reference photo
- `GET  /api/admin/stats/` - Administrative metrics & monthly sales overview
