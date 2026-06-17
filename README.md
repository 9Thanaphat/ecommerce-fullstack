# Elysia E-Commerce

![Tech Stack](https://img.shields.io/badge/Bun-1.x-black?logo=bun)
![Tech Stack](https://img.shields.io/badge/ElysiaJS-1.x-purple?logo=javascript)
![Tech Stack](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tech Stack](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Tech Stack](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)
![Tech Stack](https://img.shields.io/badge/Drizzle_ORM-darkgreen)
![Status](https://img.shields.io/badge/Status-In_Development-orange)

---

## Overview

Full-stack e-commerce application built as a personal learning project to practice modern TypeScript full-stack development. The focus is on production-grade patterns: type-safe database access, secure authentication, and a principled design system — not just getting something to run.

**Design philosophy:** Dark, minimal, precise. The UI is built around a custom design system using OKLCH color tokens, not ad-hoc utility classes.

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
| Styling | TailwindCSS v4 + custom CSS design tokens (OKLCH) |
| Language | TypeScript (full-stack) |
| Email | Nodemailer (Gmail SMTP) |
| Image Storage | Cloudinary |

---

## Features

### ✅ Completed

**Authentication**
- Email + password registration
- OTP verification via email (Gmail SMTP, 5-minute expiry)
- Resend OTP flow
- Login with JWT stored in HttpOnly cookie (secure, sameSite: strict)
- "Remember me" (7-day cookie expiry)
- Auth check endpoint — frontend redirects if already authenticated

**Admin Panel**
- Dashboard with stat cards (total products, orders, revenue, low stock)
- Product management — full CRUD with modal UI (create, edit, delete)
- Order management — filter by status, inline status update
- Responsive sidebar, keyboard-accessible, empty states
- Refactored to pure Tailwind CSS for cleaner dark mode UI

**Frontend Store**
- Home page landing with hero section and featured products
- Product detail page (`/products/:id`) with component-specific specs
- Sidebar filter (price range, category)
- Standardized layout with React Router `Outlet`

**Backend API & Storage**
- `GET /products` — list all products
- `POST /admin/products`, `PUT /admin/products/:id`, `DELETE /admin/products/:id` — Admin product CRUD (with Elysia `t.Object` validation)
- Cloudinary integration for image uploads
- Custom dynamic product attributes support
- `POST /auth/register`, `POST /auth/verify-otp`, `POST /auth/resend-otp`
- `POST /auth/login`, `GET /auth/check-auth`

**Design System**
- OKLCH color palette (near-black surface, oxidized-crimson accent)
- CSS custom property tokens for spacing, radius, shadow, motion
- Reusable component classes: `.btn`, `.badge`, `.modal`, `.data-table`, `.skeleton`, `.form-input`
- Reduced-motion media query support

### 🚧 In Progress

- [ ] Connect order system to real API (currently using mock data)
- [ ] Deploy (Vercel + Railway)

---

## Project Structure

```text
ecommerce-fullstack/
├── DESIGN.md                 # Design system details
├── PRODUCT.md                # Product specifications
├── README.md                 # Project documentation
├── backend/
│   ├── src/
│   │   ├── controller/       # Controllers for business logic
│   │   ├── db/               # Database schemas and Drizzle client
│   │   ├── middleware/       # Authentication middlewares
│   │   ├── routes/           # Elysia API routes
│   │   └── index.ts          # Entry point (Elysia app)
│   └── ...config files
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page layouts and views (including Admin)
│   │   ├── App.tsx           # React app root
│   │   ├── index.css         # Design system CSS
│   │   └── main.tsx          # Vite entry
│   └── ...config files
└── docker-compose.yml        # PostgreSQL + Redis
```

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) >= 1.0
- [Docker](https://www.docker.com) (for PostgreSQL)
- Gmail account with App Password (for OTP email)

### 1. Clone & install

```bash
git clone https://github.com/9Thanaphat/ecommerce-fullstack.git
cd ecommerce-fullstack
```

### 2. Environment variables

Copy `.env.example` to `.env` and fill in:

```bash
cp .env.example .env
```

```env
# Backend
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce
JWT_SECRET=your-secret-here
GMAIL_USER=your@gmail.com
GMAIL_APP_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:5173

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Docker
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
bun run src/index.ts
```

Backend runs at `http://localhost:8000`

### 5. Run frontend

```bash
cd frontend
bun install
bun run dev
```

Frontend runs at `http://localhost:5173`

---
