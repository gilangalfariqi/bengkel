# BengkelPro Monorepo (Laravel Backend + Next.js Frontend)

BengkelPro is a premium, mobile-first motorcycle sparepart online catalog and marketplace built using a monorepo architecture. The application features a high-fidelity Gen-Z dark theme UI and coordinates checkouts directly through WhatsApp.

## Repository Structure

The project is divided into two primary directory spaces:
*   `backend/` - Laravel REST API handles seeders, database schema migrations, authentication endpoints (Laravel Sanctum), and product listings.
*   `frontend/` - Next.js App Router application written in TypeScript, featuring client state management, responsive designs, and WhatsApp order builders.

---

## Architecture Design (Clean Architecture)

The frontend is structured using **Clean Architecture** patterns to keep components, states, and data models cleanly separated and easy to debug:

```
frontend/src/
├── app/                  # Next.js App Router Pages and Layouts
├── domain/               # Enterprise / Business Logic
│   └── entities/         # Domain Types & Interfaces (User, Product, Order, Cart)
├── data/                 # Data Layer (Gateways, Repositories, APIs)
│   ├── api/              # HttpClient client and low-level fetch wrappers
│   └── services/         # API Service clients (productService, cartService, etc.)
├── presentation/         # Interface Layer
│   ├── components/       # Layouts, UI primitives, and product features
│   ├── hooks/            # Shared custom React hooks (useDebounce, useScrollDirection)
│   └── stores/           # Zustand state management stores (auth, cart, products)
└── lib/                  # Utilities (formatters, WhatsApp string builders)
```

---

## Core Flow: WhatsApp Checkout

BengkelPro completely replaces complex payment gateways and automatic shipping APIs with a **WhatsApp-based Checkout system**:
1.  **Selection**: Users browse parts, select attributes, and add them to their shopping cart.
2.  **Checkout Gate**: Users must log in (or register) to place an order.
3.  **Shipping Information**: Users fill out a checkout form providing their full name, phone number, and detailed shipping address.
4.  **WhatsApp Dispatch**: Clicking "Pesan via WhatsApp" clears the cart, automatically compiles a beautifully formatted order message (listing products, quantities, prices, address details, and order timestamp), and routes them to the WhatsApp API.
5.  **Fulfillment**: The admin receives the order summary via WhatsApp to confirm stock availability and calculate shipping costs manually.

---

## Local Setup

### 1. Backend (Laravel API)

1.  Navigate to the directory and install Composer dependencies:
    ```bash
    cd backend
    composer install
    ```
2.  Copy the local configuration file:
    ```bash
    cp .env.example .env
    ```
3.  Configure database credentials in `.env` and run migrations with seed data:
    ```bash
    php artisan key:generate
    php artisan migrate:fresh --seed
    ```
4.  Launch the Laravel development server:
    ```bash
    php artisan serve
    ```
    *By default, this runs on `http://localhost:8000`.*

### 2. Frontend (Next.js App)

1.  Navigate to the directory and install Node dependencies:
    ```bash
    cd ../frontend
    npm install
    ```
2.  Configure environment variables in `.env.local`:
    ```env
    NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
    NEXT_PUBLIC_ADMIN_WHATSAPP_PHONE=6281234567890
    ```
3.  Start the Next.js development server:
    ```bash
    npm run dev
    ```
    *Open `http://localhost:3000` in your browser.*

---

## License

MIT License.
