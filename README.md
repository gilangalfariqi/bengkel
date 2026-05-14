# Bengkel Marketplace (Laravel + Next.js)

Full-stack marketplace application with:
- **Backend:** Laravel (REST API)
- **Frontend:** Next.js (SPA-style pages)
- **Auth:** Bearer token using **Laravel Sanctum**
- **Payments:** **Midtrans** (create payment + handle notification webhook)

---

## Features

### Marketplace
- Products browsing
- Cart management
- Orders management

### Authentication
- Register / Login
- Password reset
- Logout
- Fetch current user (`/auth/me`)
- Update profile / change password

### Payments (Midtrans)
- Create Midtrans payment for a pending order
- Webhook endpoint to handle Midtrans notifications

### Shipping
- Province/city lookup
- Shipping cost calculation

---

## API Overview

All endpoints are intended to be available under the `/api` prefix.

### Public
- `GET /api/health`

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

Protected (Bearer token, `auth:sanctum`):
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `PUT /api/auth/profile`
- `PUT /api/auth/change-password`

### Products
- `GET /api/products`
- `GET /api/products/{slug}`

### Cart (protected)
- `GET /api/cart`
- `POST /api/cart`
- `PUT /api/cart/{productId}`
- `DELETE /api/cart/{productId}`
- `DELETE /api/cart`

### Orders (protected)
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/{id}`

### Payments (protected)
- `POST /api/payments/create`

Webhook (public):
- `POST /api/payments/notification`

### Shipping
- `GET /api/shipping/provinces`
- `GET /api/shipping/cities/{provinceId}`
- `POST /api/shipping/cost`

---

## Authentication (How the frontend calls the API)

The Next.js frontend sends requests with:
- `Authorization: Bearer <token>`
- Token stored in `localStorage` under the key: **`bengkel_auth`**

If the API returns **401**, the frontend clears `bengkel_auth`.

---

## Midtrans Payment Flow

1. User creates an **order** (`POST /api/orders`).
2. Frontend requests a Midtrans payment token:
   - `POST /api/payments/create` with `{ order_id }`
3. Frontend opens the Midtrans popup using `snap_token`.
4. Midtrans calls the backend webhook:
   - `POST /api/payments/notification`
5. Backend updates order/payment status accordingly.

Implementation notes (from code):
- `payments/create` uses a DB transaction + row locking to avoid race conditions.
- Duplicate successful payments are prevented.
- If an existing pending/challenge payment exists, it reuses the existing `snap_token`.

---

## Local Setup

### 1) Backend (Laravel)

**Directory:** `backend/`

1. Install dependencies:
```bash
cd backend
composer install
```
2. Copy env:
```bash
copy .env.example .env
```
3. Configure environment variables:
- Database connection
- Sanctum / auth settings
- **Midtrans** keys (at minimum):
  - `MIDTRANS_SERVER_KEY`
  - `MIDTRANS_CLIENT_KEY`
  - optional:
    - `MIDTRANS_IS_PRODUCTION`
    - `MIDTRANS_IS_SANITIZED`
    - `MIDTRANS_IS_3DS`
4. Generate app key:
```bash
php artisan key:generate
```
5. Run migrations + seed (if desired):
```bash
php artisan migrate
php artisan db:seed
```
6. Start dev server:
```bash
php artisan serve
```

### 2) Frontend (Next.js)

**Directory:** `frontend/`

1. Install dependencies:
```bash
cd frontend
npm install
```
2. Configure API base URL:
- Set `NEXT_PUBLIC_API_BASE_URL` in your frontend environment.
- Default in code: `http://localhost:8000`
3. Run dev server:
```bash
npm run dev
```

---

## CORS

CORS is handled in the backend configuration (`backend/config/cors.php`).
If frontend requests fail, verify allowed origins and headers for your dev domain/port.

---

## Repo Structure

- `backend/` - Laravel API + controllers + models + payment webhook handling
- `frontend/` - Next.js UI + API client layer

---

## Testing

Backend tests exist under `backend/tests/` (feature + unit).

---

## License

Add your license information here (e.g., MIT).
