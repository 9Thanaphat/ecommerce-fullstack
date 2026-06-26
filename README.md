# E-Commerce Fullstack

![Tech Stack](https://img.shields.io/badge/Bun-1.x-black?logo=bun)
![Tech Stack](https://img.shields.io/badge/ElysiaJS-1.x-purple?logo=javascript)
![Tech Stack](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tech Stack](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Tech Stack](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)
![Tech Stack](https://img.shields.io/badge/Drizzle_ORM-darkgreen)
![Status](https://img.shields.io/badge/Status-In_Development-orange)

**Live Demo:** [boss-it-ecommerce.vercel.app](https://boss-it-ecommerce.vercel.app)

---

## Overview

Full-stack IT e-commerce application built as a personal learning project to practice modern TypeScript full-stack development. The focus is on production-grade patterns: type-safe database access, secure authentication, real order management, and a clean design system.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | [Bun](https://bun.sh) |
| Backend Framework | [ElysiaJS](https://elysiajs.com) |
| Database | PostgreSQL 16 (Docker) |
| ORM | [Drizzle ORM](https://orm.drizzle.team) |
| Auth | JWT (HttpOnly cookie) + OTP email verification |
| Frontend | React 19 + Vite |
| Styling | TailwindCSS v4 |
| Language | TypeScript (full-stack) |
| Email | Nodemailer (Gmail SMTP) |
| Image Storage | Cloudinary (multiple images per product) |
| Thai Address | react-thailand-address-typeahead |

---

## Features

### Authentication
- Email + password registration with OTP verification (Gmail SMTP, 5-minute expiry)
- Login with JWT in HttpOnly cookie (`secure`, `sameSite: strict`)
- "Remember me" (7-day vs 1-hour expiry)
- Change password from profile page

### Store (Customer)
- Product listing with sidebar filters — category, price range slider (auto-adjusts per category), text search
- Product detail page with component-specific specs and image gallery (multiple images)
- Related products section (same category)
- Add to cart with toast notification — no page reload required
- Cart page — adjust quantity, remove items, proceed to checkout
- Checkout with saved shipping address (Thai address autocomplete)
- Mock payment flow → order confirmation
- Order success page with order number
- My Orders page — view history, expand to see items, cancel orders (pending/confirmed only)

### User Profile
- Name, phone, address (ตำบล/อำเภอ/จังหวัด/รหัสไปรษณีย์ via typeahead)
- All address fields required before saving
- Change password (verifies current password first)

### Admin Panel
- **Dashboard** — real-time stats: total products, total orders, today's orders, revenue (excluding cancelled), low stock count; recent orders table
- **Products** — full CRUD, multiple image upload per product (up to 8), image thumbnail grid with per-image delete, dynamic attributes per category
- **Orders** — filter by status, expand to view items + shipping address, inline status update
- **Users** — list all members, search by name/email, role and verification status badges
- Role-based access control (RBAC) — admin routes protected server-side

### Backend API
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register with email + password |
| POST | `/auth/verify-otp` | Verify OTP |
| POST | `/auth/login` | Login → set HttpOnly cookie |
| GET | `/auth/check-auth` | Verify session + return profile |
| PUT | `/auth/profile` | Update shipping profile |
| PUT | `/auth/change-password` | Change password |
| POST | `/auth/logout` | Clear cookie |
| GET | `/products` | List all products |
| GET | `/cart` | Get cart items |
| POST | `/cart` | Add to cart |
| PUT | `/cart/:productId` | Update quantity |
| DELETE | `/cart/:productId` | Remove item |
| DELETE | `/cart` | Clear cart |
| GET | `/orders/my` | My order history |
| GET | `/orders/my/:id` | Order items |
| PATCH | `/orders/my/:id/cancel` | Cancel order + restore stock |
| POST | `/orders/checkout` | Create order, deduct stock, clear cart |
| GET | `/admin/dashboard` | Dashboard stats + recent orders |
| GET | `/admin/users` | List all users |
| POST | `/admin/products` | Add product (multipart) |
| PUT | `/admin/products/:id` | Update product |
| DELETE | `/admin/products/:id` | Delete product |
| GET | `/admin/orders` | All orders with customer info |
| GET | `/admin/orders/:id/items` | Order line items |
| PATCH | `/admin/orders/:id/status` | Update order status |

---

## Project Structure

```text
ecommerce-fullstack/
├── backend/
│   └── src/
│       ├── controller/
│       │   ├── adminDashboardController.ts
│       │   ├── adminOrderController.ts
│       │   ├── loginController.ts
│       │   ├── orderController.ts
│       │   ├── productController.ts
│       │   └── registerController.ts
│       ├── db/
│       │   ├── index.ts
│       │   └── schema.ts
│       ├── middleware/
│       │   └── authMiddleware.ts
│       ├── routes/
│       │   ├── admin.ts
│       │   ├── auth.ts
│       │   ├── cart.ts
│       │   ├── orders.ts
│       │   └── products.ts
│       └── index.ts
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── NavBar.tsx
│       │   ├── ProductCard.tsx
│       │   ├── ProductGrid.tsx
│       │   └── SideBar.tsx
│       ├── context/
│       │   └── CartContext.tsx
│       ├── pages/
│       │   ├── admin/
│       │   │   ├── AdminLayout.tsx
│       │   │   ├── Dashboard.tsx
│       │   │   ├── OrderManagement.tsx
│       │   │   ├── ProductManagement.tsx
│       │   │   └── UserManagement.tsx
│       │   ├── Auth.tsx
│       │   ├── Cart.tsx
│       │   ├── Checkout.tsx
│       │   ├── Home.tsx
│       │   ├── MyOrders.tsx
│       │   ├── OrderSuccess.tsx
│       │   ├── Product.tsx
│       │   ├── ProductDetail.tsx
│       │   └── UserProfile.tsx
│       ├── types/
│       │   └── product.ts
│       ├── App.tsx
│       └── index.css
└── docker-compose.yml
```

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) >= 1.0
- [Docker](https://www.docker.com) (for PostgreSQL)
- Gmail account with App Password (for OTP email)
- [Cloudinary](https://cloudinary.com) account (free tier works)

### 1. Clone & install

```bash
git clone https://github.com/9Thanaphat/ecommerce-fullstack.git
cd ecommerce-fullstack
```

### 2. Environment variables

```bash
cp backend/.env.example backend/.env
```

```env
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce
JWT_SECRET=your-secret-here
GMAIL_USER=your@gmail.com
GMAIL_APP_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

DB_USER=user
DB_PASSWORD=password
DB_NAME=ecommerce
```

### 3. Start database

```bash
docker-compose up -d
```

### 4. Run backend

```bash
cd backend
bun install
bunx drizzle-kit push   # apply schema to DB
bun run src/index.ts
```

Backend runs at `http://localhost:8000`

### 5. Run frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## Database Schema

| Table | Description |
|-------|-------------|
| `users` | Accounts, profile info, shipping address, role |
| `otps` | Email verification codes (5-min expiry) |
| `products` | Products with category attributes, multiple image URLs |
| `cart_items` | Active cart per user |
| `orders` | Order records with shipping snapshot |
| `order_items` | Line items with price snapshot at purchase time |

```mermaid
erDiagram
    users {
        serial id PK
        text email UK
        text password_hash
        text role
        boolean is_verified
        text first_name
        text last_name
        text phone
        text address
        text subdistrict
        text city
        text province
        text postal_code
    }

    otps {
        serial id PK
        text email
        text otp
        timestamp expires_at
    }

    products {
        serial id PK
        text name
        text category
        integer price
        integer stock
        jsonb image_urls
        jsonb attributes
    }

    cart_items {
        serial id PK
        integer user_id FK
        integer product_id FK
        integer quantity
    }

    orders {
        serial id PK
        integer user_id FK
        integer total_amount
        text status
        text shipping_first_name
        text shipping_last_name
        text shipping_address
        text shipping_province
        text shipping_postal_code
    }

    order_items {
        serial id PK
        integer order_id FK
        integer product_id
        text product_name
        integer price
        integer quantity
    }

    users ||--o{ cart_items : "has"
    products ||--o{ cart_items : "in"
    users ||--o{ orders : "places"
    orders ||--|{ order_items : "contains"
    products ||--o{ order_items : "snapshot ref"
    users ||--o{ otps : "verifies via"
```
