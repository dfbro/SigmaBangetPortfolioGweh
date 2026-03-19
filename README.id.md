# SigmaBangetPortfolioGweh

Portfolio pribadi bertema cyberpunk untuk menampilkan proyek, write-up CTF, achievement, dan inbox admin dalam satu dashboard modern berbasis Next.js 15.

![Portfolio Preview](./awd.png)

## ✨ Highlight

- ⚡ Next.js 15 App Router + React 19 + Tailwind CSS
- 🧠 Utilitas refinement konten berbasis AI (`src/ai`)
- ☁️ Storage utama berbasis Cloudflare Workers + D1
- 🔐 Admin dashboard dengan cookie session server-side
- 🧾 Profile publik/admin tersentral di D1 (`profile_settings`)

## 🧱 Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, Radix UI
- **Backend/API:** Next Route Handlers (`src/app/api/**`)
- **Data:** Cloudflare D1 (SQL kompatibel SQLite)
- **Utilities:** date-fns, zod

## 🧭 Arsitektur Storage

- Endpoint `/api/**` aktif.
- Data utama dan profile settings tersimpan di D1.
- Endpoint `admin/upload` dinonaktifkan sementara sampai migrasi object storage selesai.

## 🚀 Quick Start

### 1) Prasyarat

- Node.js 18+ (disarankan 20+)
- `pnpm` (recommended) atau `npm`

### 2) Clone & install

```bash
git clone https://github.com/dfbro/SigmaBangetPortfolioGweh
cd SigmaBangetPortfolioGweh
pnpm install
```

Alternatif npm:

```bash
npm install
```

### 3) Setup environment

```bash
cp .env.example .env.local
```

Lalu isi `.env.local` dengan nilai yang dibutuhkan.

---

## ⚙️ Setting Environment

Gunakan template ini:

```env
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="ganti-dengan-password-kuat"
ADMIN_SESSION_SECRET="isi-random-string-minimal-32-karakter"
```

Generate secret aman (contoh):

```bash
openssl rand -base64 48
```

## ☁️ Setup Cloudflare Workers + D1

1) Buat database D1 lalu isi `database_id` dan `preview_database_id` di `wrangler.jsonc`:

```bash
pnpm d1:create
```

2) Generate typing environment Cloudflare:

```bash
pnpm cf-typegen
```

3) Terapkan migrasi schema:

```bash
pnpm d1:migrate:local
pnpm d1:migrate:remote
```

---

## 🏃 Menjalankan Project

### Development

```bash
pnpm dev
```

Server jalan di:

- http://localhost:9002

### Build production

```bash
pnpm build
pnpm start
```

### Preview runtime Workers

```bash
pnpm preview
```

### Deploy ke Cloudflare Workers

```bash
pnpm deploy
```

### Quality checks

```bash
pnpm typecheck
pnpm lint
```

## 🛠️ Admin Setup & Content Setting

Setelah app jalan:

1. Buka `/inbox`
2. Login dengan `ADMIN_USERNAME` + `ADMIN_PASSWORD`
3. Kelola:
   - Messages
   - Write-ups
   - Projects
   - Achievements
   - Profile (termasuk domain, foto profil, about text, philosophy, skill, journey)

### Profile data source

- Profile publik dibaca dari D1 (`profile_settings`)
- Perubahan dari tab Profile di admin disimpan ke D1

## 📂 Struktur Folder Penting

```text
src/app/                 # App Router pages + API routes
src/app/api/             # Endpoint auth/admin/public/contact
src/lib/                 # Storage, types, helper, session
migrations/d1/           # SQL migrasi D1 via Wrangler
wrangler.jsonc           # Konfigurasi Worker + binding D1
```

## 🧯 Troubleshooting

### 1) Binding D1 belum dikonfigurasi

Jika muncul error `Cloudflare D1 binding "PORTFOLIO_DB" is not configured.`:

```bash
pnpm d1:create
pnpm d1:migrate:local
pnpm cf-typegen
```

### 2) `ADMIN_SESSION_SECRET must be set and at least 32 characters`

- Pastikan `ADMIN_SESSION_SECRET` ada dan panjangnya minimal 32 karakter.

## 📌 Catatan

- `NEXT_PUBLIC_NAME`, `NEXT_PUBLIC_EMAIL`, dll tidak lagi dipakai sebagai sumber utama profile.
- Sumber profile utama sekarang adalah D1 (`profile_settings`).
