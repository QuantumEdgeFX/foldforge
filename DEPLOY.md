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

### Prerequisites
- GitHub repository with FoldForge code
- Render account (https://render.com)

### Steps

1. **Push to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Fix deployment configuration"
   git push origin main
   ```

2. **Connect to Render**
   - Go to https://dashboard.render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub account and select the `foldforge` repository
   - Select branch: `main` (or your deployment branch)

3. **Configure Service**
   - **Name:** `foldforge` (or your preferred name)
   - **Environment:** `Node`
   - **Build Command:** `pnpm install && pnpm run build`
   - **Start Command:** `pnpm run start`
   - **Plan:** Free or Paid (as needed)

4. **Set Environment Variables**
   In Render dashboard, add these environment variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render default)
   - `JWT_SECRET`: Generate a strong random secret
   - Any optional variables (STRIPE_SECRET_KEY, SUPABASE_URL, etc.)

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy
   - Monitor the deployment logs in the dashboard

### Troubleshooting

**Error: `ENOENT: no such file or directory, stat '/opt/render/project/dist/public/index.html'`**

This error has been fixed in the latest version. The issue was that the server couldn't find the static files directory. The fixes include:

- Updated `server/_core/vite.ts` to use `process.cwd()` for reliable path resolution
- Modified build and start scripts to set `PROJECT_ROOT` environment variable
- Added `render.yaml` for explicit Render configuration

If you still encounter this error:
1. Ensure you've pulled the latest changes from GitHub
2. Clear Render's build cache: Dashboard → Service → Settings → Clear Build Cache
3. Trigger a new deployment

### Port Configuration

Render automatically detects the port your application listens on. FoldForge listens on the `PORT` environment variable (default: 3000), but Render may override this. The application will automatically find an available port if the default is busy.

