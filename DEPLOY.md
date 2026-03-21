# FoldForge — Deployment Guide

## Quick Start (Any Server)

### Requirements
- Node.js 18+ (or 20+)
- pnpm (`npm install -g pnpm`)

### 1. Install Dependencies
```bash
cd foldforge
pnpm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

**Minimum required variables:**
```
NODE_ENV=production
PORT=3000
JWT_SECRET=<generate a strong random secret>
```

**Optional — Supabase (for email auth/password reset):**
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Optional — Stripe (for payments):**
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Optional — MySQL/TiDB (for production DB instead of SQLite):**
```
DATABASE_URL=mysql://user:pass@host:3306/foldforge
DATABASE_PATH=./data/foldforge.db   # SQLite path (default)
```

### 3. Build the Frontend
```bash
pnpm build
```

### 4. Start the Server
```bash
# Production
NODE_ENV=production PROJECT_ROOT=$(pwd) node dist/index.js

# Or with tsx (development)
pnpm dev
```

### 5. Using PM2 (Recommended for Production)
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## Database

By default, FoldForge uses **SQLite** stored at `./data/foldforge.db`.  
The database is auto-created on first run with all tables and 50+ reference symbols seeded.

To use MySQL/TiDB in production, set `DATABASE_URL` in your `.env`.

---

## Admin Account

The first user to sign up with the email set in `ADMIN_EMAIL` (default: `bigbags301@gmail.com`) will automatically be granted admin role.

---

## Ports & Proxy

The server runs on `PORT` (default: 3000). For HTTPS, place it behind nginx or Caddy:

```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Features Included
- Full Studio Engine (backtest, Monte Carlo, walk-forward)
- Broker Data Pipeline (MT4/MT5 EA sync)
- License Management (generate, activate, deactivate)
- Stripe Webhook Handler
- Supabase Auth (optional) or Local JWT Auth
- Admin Dashboard
- Support Ticket System
- 50+ Symbol Reference Hub (seeded automatically)
- PDF Report Generation
- Funded Account Guardian UI

---

## Deploying to Render

FoldForge ships with a `render.yaml` Blueprint that automates the full Render setup.

### Option A — Blueprint (Recommended, one click)

1. Push this repository to GitHub (if not already done).
2. Go to [https://dashboard.render.com/blueprints](https://dashboard.render.com/blueprints) and click **New Blueprint Instance**.
3. Connect your GitHub account and select the `foldforge` repository.
4. Render reads `render.yaml` and pre-fills all settings automatically.
5. Fill in the `sync: false` env vars that require your own secrets (see table below).
6. Click **Apply** — Render builds and deploys.

### Option B — Manual Web Service

1. Go to [https://dashboard.render.com](https://dashboard.render.com) → **New +** → **Web Service**.
2. Connect your GitHub account and select the `foldforge` repository, branch `main`.
3. Set the following:
   - **Runtime:** Node
   - **Build Command:** `pnpm install --frozen-lockfile && pnpm run build`
   - **Start Command:** `node dist/index.js`
   - **Plan:** Starter (required for persistent disk)
4. Add a **Disk** under the service settings:
   - **Mount Path:** `/opt/render/project/src/data`
   - **Size:** 1 GB
5. Set environment variables (see table below).
6. Click **Create Web Service**.

### Required Environment Variables

| Variable | Value | Notes |
|---|---|---|
| `NODE_ENV` | `production` | Set automatically by `render.yaml` |
| `PORT` | `3000` | Set automatically |
| `JWT_SECRET` | *(auto-generated)* | Render generates a secure random value |
| `DATABASE_PATH` | `/opt/render/project/src/data/foldforge.db` | Points to the persistent disk |
| `ADMIN_EMAIL` | `your-admin@email.com` | First signup with this email gets admin role |

### Supabase Auth Variables (required for email verification & password reset)

Create a free project at [https://supabase.com](https://supabase.com), then copy the values from **Project Settings → API**.

| Variable | Where to find it |
|---|---|
| `SUPABASE_URL` | Project Settings → API → Project URL |
| `SUPABASE_ANON_KEY` | Project Settings → API → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API → service_role |

> Without these three variables the app still works — it falls back to local JWT auth with no email verification.

### Supabase Project Setup

Before connecting Supabase to Render:

1. Create a new project at [https://supabase.com](https://supabase.com).
2. In **Authentication → URL Configuration**, set:
   - **Site URL:** `https://your-render-service.onrender.com`
   - **Redirect URLs:** `https://your-render-service.onrender.com/reset-password`
3. In **Authentication → Email Templates**, customise the password reset email if desired.
4. Copy the three API keys into your Render environment variables.

### Stripe Variables (required for subscription billing)

Get keys from [https://dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys).

| Variable | Value |
|---|---|
| `STRIPE_SECRET_KEY` | `sk_live_...` (or `sk_test_...` for testing) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` from Stripe Dashboard → Webhooks |

After deploying, add a Stripe webhook endpoint pointing to:
```
https://your-render-service.onrender.com/api/stripe/webhook
```
Enable these events: `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.deleted`, `customer.subscription.updated`.

### Health Check

Render pings `GET /api/health` to confirm the service is live. This endpoint is built into the app and returns `{ ok: true }`.

### Troubleshooting

**Build fails with `pnpm: command not found`**  
Render's Node environment includes npm and yarn but not pnpm by default. The `render.yaml` `buildCommand` uses `pnpm install --frozen-lockfile` which Render resolves via the `packageManager` field in `package.json`. If it still fails, prefix the build command with `npm install -g pnpm &&`.

**`ENOENT: dist/public/index.html` not found**  
The `serveStatic` function resolves `dist/public` relative to `process.cwd()`. Ensure the build command runs `vite build` before `esbuild` and that the `startCommand` is run from the project root (Render does this by default).

**SQLite data lost after redeploy**  
Ensure the persistent disk is mounted at `/opt/render/project/src/data` and `DATABASE_PATH` points to that directory. Render preserves disk data across deploys.

**Port mismatch**  
Render injects `PORT=10000` at runtime. The server reads `process.env.PORT` and listens on that port automatically — no manual change needed.

