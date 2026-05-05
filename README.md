# 📚 AMIBOOK — Sistem Informasi Perpustakaan Kampus

![AMIBOOK Banner](https://via.placeholder.com/1200x400/1D4ED8/FFFFFF?text=AMIBOOK+%E2%80%94+Perpustakaan+Kampus+Digital)

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Deploy on Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel)](https://vercel.com)

**AMIBOOK** adalah aplikasi web perpustakaan kampus digital yang memungkinkan mahasiswa meminjam dan mengembalikan buku secara online, serta memberikan panel admin untuk mengelola koleksi dan anggota perpustakaan.

🌐 **[Live Demo](https://amibook.vercel.app)** · 🎨 **Design Reference**: `stitch_amibook_app` · 📝 **[PRD](./docs/PRD.md)**

---

## ✨ Fitur Utama

### Mahasiswa (User)
- 🔍 **Katalog buku** — pencarian dan filter berdasarkan kategori
- 📖 **Peminjaman digital** — pinjam buku tanpa perlu ke perpustakaan
- 📋 **Riwayat pinjaman** — lacak status dan jatuh tempo
- 🔔 **Notifikasi** — pengingat jatuh tempo otomatis
- 👤 **Profil anggota** — kelola data diri

### Admin Perpustakaan
- 📊 **Dashboard statistik** — ringkasan real-time sistem
- 📚 **Kelola buku** — tambah, edit, hapus koleksi (CRUD)
- 👥 **Kelola anggota** — lihat dan kelola data mahasiswa
- 🔄 **Monitor peminjaman** — pantau semua transaksi

---

## 🛠 Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| State Management | Zustand |
| Data Fetching | TanStack React Query |
| Backend & Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| Routing | React Router v6 |
| Deploy | Vercel |

---

## 🎨 UI & Design Direction

- Frontend diselaraskan ke referensi desain di folder `stitch_amibook_app`.
- Sistem warna memakai token semantik berbasis Tailwind (`surface`, `ink`, `status`, `primary`) agar konsisten lintas halaman.
- Tipografi menggunakan kombinasi **Plus Jakarta Sans** (headline) + **Manrope** (body).
- Fokus portofolio: user flow lengkap + admin baseline yang konsisten visualnya.

---

## 🚀 Cara Menjalankan Locally

### Prasyarat
- Node.js 18+
- Akun [Supabase](https://supabase.com) (gratis)

### 1. Clone & Install
```bash
git clone https://github.com/username/amibook.git
cd amibook
npm install
```

### 2. Setup Supabase
1. Buat project baru di [supabase.com](https://supabase.com)
2. Buka **SQL Editor** → paste isi file `supabase_schema.sql` → klik Run
3. Salin **Project URL** dan **Anon Key** dari Settings → API

### 3. Konfigurasi Environment
```bash
cp .env.example .env
```
Isi file `.env`:
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Jalankan
```bash
npm run dev
```
Buka [http://localhost:5173](http://localhost:5173)

---

## 📁 Struktur Proyek

```
src/
├── components/
│   ├── layout/       # UserLayout, AdminLayout, AuthLayout
│   ├── shared/       # ProtectedRoute, AdminRoute, LoadingScreen
│   └── ui/           # Komponen UI reusable (Button, Modal, dll)
├── pages/
│   ├── auth/         # Login, Register
│   ├── user/         # Home, Catalog, BookDetail, MyBorrowings
│   └── admin/        # Dashboard, Books, Borrowings, Users
├── services/         # Semua query ke Supabase
├── store/            # Zustand stores (auth, dll)
├── hooks/            # Custom React hooks
├── lib/              # Konfigurasi Supabase client
├── router/           # React Router konfigurasi
└── styles/           # Global CSS
```

---

## 🗄 Database Schema

```
profiles ←── auth.users (auto-sync via trigger)
books ←── categories
borrowings ←── profiles + books
```

Row Level Security (RLS) aktif di semua tabel. Admin memiliki akses penuh, user hanya bisa mengakses data milik sendiri.

---

## 🌐 Deploy ke Vercel

1. Push project ke GitHub.
2. Import repository di [vercel.com](https://vercel.com).
3. Framework preset: **Vite** (otomatis terdeteksi).
4. Tambahkan environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Klik **Deploy**.

### Konfigurasi Build
- Build Command: `npm run build`
- Output Directory: `dist`

### Kenapa Vercel?
- Setup paling cepat untuk project Vite.
- Gratis untuk portfolio/personal project.
- Preview deployment otomatis per commit.

---

## 🌍 Opsi Deploy Gratis Lainnya (Fallback)

### Netlify
1. Import repository ke [netlify.com](https://www.netlify.com/).
2. Build command: `npm run build`.
3. Publish directory: `dist`.
4. Tambahkan env var yang sama seperti Vercel.

### Cloudflare Pages (opsional)
- Build command: `npm run build`
- Build output directory: `dist`
- Tetap gunakan env var yang sama.

---

## ✅ Portfolio Publish Checklist

- [ ] Ganti link demo pada bagian atas README jika domain berubah.
- [ ] Isi identitas developer di section Developer.
- [ ] Tambahkan screenshot asli halaman Login, Katalog, Dashboard Admin.
- [ ] Pastikan env vars sudah diisi di platform deploy.
- [ ] Verifikasi login user/admin pada deployment production.

---

## 📸 Screenshots

<!-- Ganti dengan screenshot asli setelah project jalan -->
| Halaman | Preview |
|---------|---------|
| Login | _screenshot_ |
| Katalog Buku | _screenshot_ |
| Dashboard Admin | _screenshot_ |

---

## 👨‍💻 Developer

**[Nama Kamu]** — Fresh Graduate Informatika  
[LinkedIn](#) · [GitHub](#) · [Portfolio](#)

---

*Dibangun sebagai bagian dari portfolio pengembangan aplikasi web full-stack.*
