# SIBISA — AI Chatbot Customer Service SaaS untuk UMKM Indonesia

> **SIBISA** (Presented by **Edvora**) adalah platform SaaS Chatbot AI Customer Service 24/7 yang dirancang khusus untuk pemilik UMKM di Indonesia (kuliner, salon, travel, e-commerce, dan jasa perorangan).

---

## 🌟 Fitur Utama

- **Customer Service AI 24/7**: Merespons pertanyaan harga, jam operasional, alamat, dan produk secara otomatis dan instan (< 1.5 detik).
- **Akurat & Anti-Halusinasi**: AI Google Gemini (`gemini-2.5-flash`) dilatih menjawab HANYA berdasarkan data bisnis & FAQ yang kamu masukkan di dashboard (maks 10.000 karakter).
- **Handover WhatsApp Otomatis**: Pertanyaan di luar Knowledge Base otomatis dialihkan ke WhatsApp admin lengkap dengan ringkasan percakapan.
- **Widget Chatbot Vanilla JS (≤ 5 KB)**: Cukup pasang 1 baris kode script di website toko online kamu, langsung muncul bubble chat mengambang yang responsif.
- **Dashboard Management Mobile-First**: Kelola profil bisnis, knowledge base, FAQ, riwayat percakapan, dan penangkap calon pelanggan (leads) langsung dari HP maupun desktop.
- **Analitik & Jam Tersibuk**: Grafik tren percakapan 14 hari, distribusi jam tersibuk (00:00 - 23:00), dan daftar pertanyaan yang belum terjawab.
- **Proteksi Kuota & Keamanan Multi-Tenant**: RLS Supabase di semua tabel, Upstash Redis Rate Limiting, serta gating kuota bulanan atomik.

---

## 🛠 Tech Stack

| Lapisan | Teknologi | Catatan |
|---|---|---|
| **Framework** | Next.js 16 (App Router) + React 19 + TypeScript | Strict Mode, Server Components & Actions |
| **Styling** | Tailwind CSS v4 + Lucide Icons + Font Plus Jakarta Sans | Design Tokens SIBISA |
| **Database & Auth** | Supabase (Postgres, Auth, RLS) | Region Singapore (`ap-southeast-1`) |
| **AI Engine** | `@google/genai` (Google Gemini API `gemini-2.5-flash`) | Structured JSON Output (`responseSchema`) |
| **Rate Limiter** | Upstash Redis (`@upstash/ratelimit`) | Sliding Window per IP & per Session |
| **Visualisasi Chart** | Recharts | Grafik Tren 14 Hari & Jam Tersibuk |
| **Billing Model** | Manual DB Subscription (`subscriptions` table) | Free Trial 14 Hari (100 balasan) & Basic (600 balasan) |

---

## 🚀 Panduan Setup Lokal (Local Development)

### 1. Prerequisites
- Node.js >= 18.x
- `pnpm` (disarankan) atau `npm`

### 2. Install Dependencies
```bash
npx pnpm install
```

### 3. Konfigurasi Environment Variables (`.env.local`)
Salin file `.env.example` menjadi `.env.local` dan isi nilainya:
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
GEMINI_API_KEY=your-google-gemini-api-key
AI_MODEL=gemini-2.5-flash
UPSTASH_REDIS_REST_URL=https://your-upstash-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-upstash-token
CRON_SECRET=your-random-cron-secret
```

### 4. Setup Database Migration (Supabase)
Jalankan skrip migrasi SQL yang berada di `supabase/migrations/0001_init.sql` pada SQL Editor konsol Supabase kamu.

### 5. Jalankan Server Dev
```bash
npx pnpm dev
```
Buka `http://localhost:3000` di peramban kamu.

---

## 📖 Runbook & Deployment Checklist (Vercel & Supabase)

1. **Deploy ke Vercel**:
   - Push repository ke GitHub (`main` branch).
   - Hubungkan repo Vercel dan isi seluruh environment variables di atas pada Vercel Project Settings.
2. **Cron Job Configuration (`vercel.json`)**:
   - Pass cron headers `CRON_SECRET` ke endpoint `/api/cron/expire-subscriptions` dan `/api/cron/reminders`.
3. **Database Security Audit**:
   - Pastikan RLS aktif di seluruh 9 tabel (`businesses`, `chatbots`, `knowledge_items`, `conversations`, `messages`, `leads`, `subscriptions`, `payments`, `usage_counters`).
4. **Smoke Testing Production**:
   - Daftar akun baru ➔ Isi Profil & Knowledge ➔ Buka Playground ➔ Uji Widget Embed ➔ Verifikasi Handover WA.

---

## 📝 Lisensi & Hak Cipta

© 2026 **SIBISA by Edvora**. Hak cipta dilindungi undang-undang.
