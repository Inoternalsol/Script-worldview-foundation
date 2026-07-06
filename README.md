# Script Worldview Foundation - Full-Stack Enterprise Platform

A modern, enterprise-grade web platform and content management system built for the **Script Worldview Foundation (SWF)**. Designed with high visual excellence, responsive animations, and a decoupled architecture powered by **Next.js 14 (App Router)** and **Cloudflare Workers (Hono + D1 SQLite)**.

---

## 🌟 Key Features & Highlights

- **✨ Rich Modern UI & Animations**: Tailored HSL color palettes, dark/light mode support, glassmorphism, smooth Framer Motion micro-animations, and responsive layouts that wow users on first glance.
- **💝 3-Step Interactive Donation Wizard**: Replacing legacy long forms with a streamlined, multi-step donation experience supporting preset amounts, recurring options, and dual payment gateway integration (Stripe & Paystack).
- **🚀 Decoupled Cloudflare Worker Backend**: Ultra-fast edge API built with **Hono**, strictly typed with **Drizzle ORM**, and backed by **Cloudflare D1 SQLite** and Cloudflare R2 Media Storage.
- **🔐 Enterprise Security & RBAC**: NextAuth.js authentication integrated with backend JWT verification supporting granular Role-Based Access Control (`super_admin`, `dept_admin`, `content_editor`, `viewer`).
- **📊 Advanced Admin Dashboard**: Complete CRM for managing volunteers, donations, campaigns, blog posts, events, programs, team members, transparency documents, and real-time interactive analytics charts.

---

## 🏛️ System Architecture

```
+-----------------------------------------------------------------------+
|                         Frontend (Next.js 14)                         |
|  +---------------------+   +-------------------+   +---------------+  |
|  | Public Pages & UI   |   |  3-Step Donate    |   | Admin Portal  |  |
|  | (Shadcn + Tailwind) |   |  Wizard (Zod UI)  |   | (NextAuth v5) |  |
|  +---------------------+   +-------------------+   +---------------+  |
+-----------------------------------+-+---------------------------------+
                                    | |
                         REST / JWT | | Proxy (/api/admin/*)
                                    v v
+-----------------------------------------------------------------------+
|                      Edge Backend (Hono Worker)                       |
|  +-----------------------+   +-------------------+   +-------------+  |
|  | Auth & Role Middleware|   | Core CRM API      |   | R2 Media    |  |
|  | (JOSE Bearer Token)   |   | (Drizzle ORM)     |   | Uploads     |  |
|  +-----------------------+   +-------------------+   +-------------+  |
+-----------------------------------+-+---------------------------------+
                                    | |
                           SQL DB   | | Object Store
                                    v v
+-----------------------------------------------------------------------+
|                         Cloudflare Infrastructure                     |
|            [ Cloudflare D1 SQLite ]         [ Cloudflare R2 Storage ] |
+-----------------------------------------------------------------------+
```

---

## 🛠️ Technology Stack

### Frontend Core
- **Framework**: Next.js 14 (App Router, Server Actions, React Server Components)
- **Styling**: Tailwind CSS, Vanilla CSS (`index.css`), Shadcn UI
- **State & Data Fetching**: React Query (TanStack Query), Zustand
- **Animations**: Framer Motion, Lucide React Icons
- **Forms & Validation**: React Hook Form, Zod

### Backend Core
- **Runtime**: Cloudflare Workers
- **API Framework**: Hono.js (Lightweight Web Framework)
- **Database & ORM**: Cloudflare D1 (SQLite) + Drizzle ORM
- **Authentication**: NextAuth.js (Frontend Session) + `jose` JWT verification (Worker API)
- **Storage**: Cloudflare R2 Object Storage (Media Library)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher
- **Wrangler CLI**: For Cloudflare Workers local emulation (`npx wrangler`)

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-org/script-worldview-foundation.git
cd script-worldview-foundation

# Install root dependencies
npm install

# Install worker dependencies
cd workers && npm install && cd ..
```

### 2. Environment Configuration

Create a `.env` file in the root directory:
```env
NEXTAUTH_SECRET="development_nextauth_secret_key_12345_should_be_long"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:8787"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
JWT_SECRET="development_jwt_secret_key_12345"
```

Create a `.dev.vars` file inside the `workers/` directory:
```env
ENVIRONMENT="development"
JWT_SECRET="development_jwt_secret_key_12345"
FRONTEND_URL="http://localhost:3000"
EMAIL_FROM="noreply@scriptworldviewfoundation.org"
```

### 3. Database Setup (Local D1 SQLite)

Apply Drizzle database migrations to your local Cloudflare D1 database:
```bash
cd workers
npm run db:apply:local
cd ..
```

### 4. Running the Development Servers

Open two terminal windows or run them concurrently:

**Terminal 1: Cloudflare Worker API Server (`http://localhost:8787`)**
```bash
cd workers
npm run dev
```

**Terminal 2: Next.js Frontend Application (`http://localhost:3000`)**
```bash
npm run dev
```

---

## 🔐 Admin Authentication & Seeding

In development mode (`ENVIRONMENT="development"`), user registration is enabled via API. You can register your initial `super_admin` account using `curl` or Postman:

```bash
curl -X POST http://localhost:8787/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Super Admin",
    "email": "admin@scriptworldview.org",
    "password": "Password123!",
    "role": "super_admin",
    "department": "executive"
  }'
```

Once registered, navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login) and sign in with your credentials.

---

## 🧪 Automated QA Testing Suite

The project includes an automated end-to-end QA verification suite that validates all public API endpoints, protected Admin CRM routes, JWT authentication, CMS page creation, storage media upload/delete, and Next.js frontend route accessibility.

To run the full QA test suite:
```bash
node scratch/qa-test-suite.mjs
```

### Expected Output:
```
====================================================
🚀 STARTING SWF PLATFORM TOTAL QA TEST SUITE
====================================================
--- 1. Seeding & Testing Admin Authentication ---
✅ [PASS] Admin Register (POST /api/auth/register) -> Status: 200
✅ [PASS] Admin Login (POST /api/auth/login) -> Status: 200
...
--- 6. Testing Frontend Route Accessibility & Navigation ---
✅ [PASS] Frontend Route: Home Page -> Status: 200
✅ [PASS] Frontend Route: Admin Dashboard Home -> Status: 200
====================================================
📊 QA TEST SUMMARY: 37 PASSED | 0 FAILED
====================================================
```

---

## 📦 Production Building & Deployment

### Build Next.js Production Bundle
```bash
npm run build
```

### Build & Deploy Cloudflare Worker
```bash
cd workers
npm run build
npm run deploy
```

---

## 📄 License & Ownership

Copyright © 2026 Script Worldview Foundation. All rights reserved.
