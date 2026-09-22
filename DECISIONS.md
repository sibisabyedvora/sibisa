# SIBISA — Architecture & Technical Decisions Record

Dokumen ini mencatat keputusan teknis & arsitektur final yang dikunci selama pengembangan **SIBISA AI Chatbot SaaS**.

---

## 1. Stack & Provider Model
- **AI Engine**: Menggunakan **Google Gemini API** (`@google/genai` dengan model `gemini-2.5-flash`). Keuntungan: kecepatan latensi tinggi (< 1.5s), dukungan Structured JSON Output (`responseSchema`), serta kuota gratis untuk penghematan unit economics.
- **Payment & Billing Model**: **Manual DB Activation (`subscriptions` table)** menggantikan payment gateway external. Status langganan diset via dashboard admin/Server Actions `adminActivateSubscriptionAction` dengan periode 30 hari.
- **Database & Auth**: **Supabase (Postgres & Auth)** di region Singapore (`ap-southeast-1`) dengan isolasi tenant 100% menggunakan Row Level Security (RLS) berdasar `owner_id`.
- **Rate Limiting**: **Upstash Redis** (`@upstash/ratelimit`) dengan fallback sliding-window in-memory untuk membatasi 10 pesan/menit per IP dan 60 pesan/jam per sesi pengunjung.

---

## 2. Widget & Public API Architecture
- **Loader Script**: Vanilla JS ≤ 5 KB ([`public/widget.js`](file:///d:/project%202027/sibisa/public/widget.js)) tanpa kerangka kerja (zero external dependencies) yang membuat floating bubble dan container Iframe secara responsif.
- **Iframe Container**: Halaman [/embed/[publicKey]](file:///d:/project%202027/sibisa/src/app/embed/[publicKey]/page.tsx) dengan header Content Security Policy (CSP) `frame-ancestors` dinamis sesuai daftar `allowed_domains` pemilik chatbot.
- **Guard Security Pipeline**: Tahapan validasi wajib sebelum memanggil AI Gemini (`chatbot.is_active` → domain check → `subscription.status` → `usage_counters` monthly quota). Ditolak pada tahap ini = 0 biaya AI.

---

## 3. Knowledge Base & Prompt Engineering
- **Context Stuffing**: Semua item produk, FAQ, dan kebijakan aktif digabungkan ke dalam tag `<business_data>` pada system prompt (maksimum 10.000 karakter per bisnis).
- **Anti-Prompt Injection Defense**: Aturan ketat di dalam prompt yang memerintahkan AI menjawab HANYA dari `<business_data>`, tidak membocorkan instruksi system prompt, dan otomatis menyetel `needs_handover = true` bila info tidak ditemukan.
- **Atomic Quota Increment**: Menggunakan PostgreSQL stored function `increment_usage(p_chatbot, p_period)` untuk increment jumlah balasan AI secara atomik & race-condition safe.
