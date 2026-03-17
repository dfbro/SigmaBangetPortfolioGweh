# SigmaBangetPortfolioGweh

Portfolio pribadi bertema cyberpunk untuk menampilkan proyek, write-up CTF, achievement, dan inbox admin dalam satu dashboard modern berbasis Next.js 15.

![Portfolio Preview](./awd.png)

## ✨ Highlight

- ⚡ Next.js 15 App Router + React 19 + Tailwind CSS
- 🧠 AI flow support via Genkit (`src/ai`)
- 🗂️ Dual storage mode: `sqlite` atau `firebase`
- 🔐 Admin dashboard dengan cookie session server-side
- 🧾 Profile publik disimpan di `public/profile.json` (editable dari admin)

## 🧱 Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, Radix UI
- **Backend/API:** Next Route Handlers (`src/app/api/**`)
- **Data:** SQLite (`sqlite3`) atau Firebase/Firestore
- **Utilities:** date-fns, zod, Genkit

## 🧭 Arsitektur Storage

| Mode | Cocok untuk | Perilaku |
|---|---|---|
| `sqlite` | Local dev paling simpel | API `/api/**` aktif, data utama di SQLite, profile tetap di `public/profile.json` |
| `firebase` | Integrasi Firebase/Firestore | Request browser ke `/api/**` (non-auth, non-profile) dialihkan ke Firebase client; direct hit ke endpoint tersebut akan kena `502` dari middleware |

> Rekomendasi untuk mulai cepat: pakai `sqlite` dulu, lalu migrasi ke `firebase` setelah env siap.

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

Lalu isi `.env.local` sesuai mode yang dipilih.

---

## ⚙️ Setting Environment

### Opsi A — Mode SQLite (paling cepat untuk development)

Gunakan template minimal ini:

```env
STORAGE_TYPE="sqlite"
NEXT_PUBLIC_STORAGE_TYPE="sqlite"
SQLITE_DB_PATH="./data/portfolio.sqlite3"

ADMIN_USERNAME="admin"
ADMIN_PASSWORD="ganti-dengan-password-kuat"
ADMIN_SESSION_SECRET="isi-random-string-minimal-32-karakter"
```

Generate secret aman (contoh):

```bash
openssl rand -base64 48
```

### Opsi B — Mode Firebase

```env
STORAGE_TYPE="firebase"
NEXT_PUBLIC_STORAGE_TYPE="firebase"

ADMIN_USERNAME="admin"
ADMIN_PASSWORD="harus-sesuai-untuk-login-admin-dan-fallback-firebase"
ADMIN_SESSION_SECRET="isi-random-string-minimal-32-karakter"

NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""
NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=""
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""

NEXT_PUBLIC_FIREBASE_ADMIN_EMAIL=""
FIREBASE_ADMIN_PROJECT_ID=""
FIREBASE_ADMIN_CLIENT_EMAIL=""
FIREBASE_ADMIN_PRIVATE_KEY=""
```

#### Catatan penting Firebase

- Cara **paling aman** untuk akses admin server-side: isi `FIREBASE_ADMIN_CLIENT_EMAIL` + `FIREBASE_ADMIN_PRIVATE_KEY` (service account).
- Jika service account kosong, sistem fallback ke login email/password Firebase dan butuh `NEXT_PUBLIC_FIREBASE_ADMIN_EMAIL` + `ADMIN_PASSWORD` yang valid di Firebase Auth.
- Di mode `firebase`, endpoint API non-auth/non-profile bisa mengembalikan `502` jika dipanggil langsung dari luar browser.

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

- Profile publik dibaca dari `public/profile.json`
- Perubahan dari tab Profile di admin akan langsung menulis file tersebut

## 📂 Struktur Folder Penting

```text
src/app/                 # App Router pages + API routes
src/app/api/             # Endpoint auth/admin/public/contact
src/lib/                 # Storage, types, helper, session
src/firebase/            # Firebase client config/provider
public/profile.json      # Sumber data profile publik
data/portfolio.sqlite3   # Database SQLite (jika mode sqlite)
```

## 🧯 Troubleshooting

### 1) Error SQLite binding saat install/build

Jika pakai `pnpm` dan modul native belum kebuild:

```bash
pnpm approve-builds --all
pnpm install
```

### 2) `ADMIN_SESSION_SECRET must be set and at least 32 characters`

- Pastikan `ADMIN_SESSION_SECRET` ada dan panjangnya minimal 32 karakter.

### 3) API `502` saat mode Firebase

- Ini expected untuk endpoint non-auth/non-profile jika dipanggil langsung via network.
- Akses dari UI tetap bekerja melalui layer Firebase client.

## 📌 Catatan

- `NEXT_PUBLIC_NAME`, `NEXT_PUBLIC_EMAIL`, dll tidak lagi dipakai sebagai sumber utama profile.
- Sumber profile utama sekarang adalah `public/profile.json`.

---

Kalau kamu mau, README ini bisa saya lanjutkan dengan badge status (build/lint), diagram arsitektur, dan section deploy (Vercel/Firebase Hosting) biar lebih “portfolio-ready”.
