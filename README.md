
# SigmaBangetPortfolioGweh

Cyberpunk-themed personal portfolio to showcase CTF write-ups, projects, achievements, and admin inbox management in one modern dashboard powered by Next.js 15.

> 🇮🇩 Indonesian version: [README.id.md](./README.id.md)

![Portfolio Preview](./awd.png)

## ✨ Highlights

- ⚡ Next.js 15 App Router + React 19 + Tailwind CSS
- 🧠 AI-assisted content refinement utility (`src/ai`)
- ☁️ Cloudflare Workers + D1 storage for app data
- 🔐 Server-side cookie session for admin dashboard
- 🧾 Public/admin profile data centralized in D1 (`profile_settings`)

## 🧱 Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, Radix UI
- **Backend/API:** Next.js Route Handlers (`src/app/api/**`)
- **Data:** Cloudflare D1 (SQLite-compatible SQL)
- **Utilities:** date-fns, zod

## 🧭 Storage Architecture

- `/api/**` endpoints are active.
- Main app data and profile settings are stored in D1.
- `admin/upload` is temporarily disabled until cloud object storage migration is finalized.

## 🚀 Quick Start

### 1) Prerequisites

- Node.js 18+ (20+ recommended)
- `pnpm` (recommended) or `npm`

### 2) Clone & install

```bash
git clone https://github.com/dfbro/SigmaBangetPortfolioGweh
cd SigmaBangetPortfolioGweh
pnpm install
```

Using npm:

```bash
npm install
```

### 3) Configure environment

```bash
cp .env.example .env.local
```

Then fill `.env.local` with the required values.

---

## ⚙️ Environment Configuration

Use this template:

```env
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="replace-with-a-strong-password"
ADMIN_SESSION_SECRET="use-a-random-string-with-at-least-32-characters"
```

Generate a secure secret (example):

```bash
openssl rand -base64 48
```

## ☁️ Cloudflare Workers + D1 Setup

1) Create D1 database and copy the returned IDs to `wrangler.jsonc` (`database_id` and `preview_database_id`):

```bash
pnpm d1:create
```

2) Generate Cloudflare env typings:

```bash
pnpm cf-typegen
```

3) Apply schema migrations:

```bash
pnpm d1:migrate:local
pnpm d1:migrate:remote
```

---

## 🏃 Running the Project

### Development

```bash
pnpm dev
```

Runs at:

- http://localhost:9002

### Production build

```bash
pnpm build
pnpm start
```

### Preview in Workers runtime

```bash
pnpm preview
```

### Deploy to Cloudflare Workers

```bash
pnpm deploy
```

### Quality checks

```bash
pnpm typecheck
pnpm lint
```

## 🛠️ Admin Setup & Content Management

After starting the app:

1. Open `/inbox`
2. Sign in with `ADMIN_USERNAME` + `ADMIN_PASSWORD`
3. Manage:
   - Messages
   - Write-ups
   - Projects
   - Achievements
   - Profile (domain, profile photo, about text, philosophy, skills, journey)

### Profile data source

- Public profile reads from D1 (`profile_settings` table)
- Changes from the Profile tab are persisted to D1

## 📂 Key Project Structure

```text
src/app/                 # App Router pages + API routes
src/app/api/             # Auth/admin/public/contact endpoints
src/lib/                 # Storage, types, helpers, session
migrations/d1/           # Wrangler D1 SQL migrations
wrangler.jsonc           # Cloudflare Worker + D1 bindings config
```

## 🧯 Troubleshooting

### 1) D1 binding is not configured

If you get `Cloudflare D1 binding "PORTFOLIO_DB" is not configured.`:

```bash
pnpm d1:create
pnpm d1:migrate:local
pnpm cf-typegen
```

### 2) `ADMIN_SESSION_SECRET must be set and at least 32 characters`

- Ensure `ADMIN_SESSION_SECRET` exists and is at least 32 characters long.

## 📌 Notes

- `NEXT_PUBLIC_NAME`, `NEXT_PUBLIC_EMAIL`, and similar vars are no longer the primary profile source.
- The main profile source is now D1 (`profile_settings`).
