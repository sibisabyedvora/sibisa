# Architectural & Design Decisions (SIBISA)

Dokumen ini mencatat keputusan arsitektur dan penyesuaian dari spesifikasi awal.

---

## 1. Perubahan Provider AI (2026-09-21)
- **Keputusan**: Menggunakan **Google Gemini API** (Free Tier / SDK `@google/genai` atau `@google/generative-ai`) menggantikan Anthropic Claude Haiku.
- **Alasan**: Efisiensi biaya (opsi gratisan untuk pengujian & MVP).
- **Implikasi**:
  - Environment variable `GEMINI_API_KEY` menggantikan `ANTHROPIC_API_KEY`.
  - Default model: `gemini-2.5-flash` (atau `gemini-1.5-flash`).
  - Implementasi AI core (`src/lib/ai/respond.ts`) disesuaikan untuk memanggil Google Gemini SDK dengan Structured Output / Tool Calling.

---

## 2. Penghapusan Payment Gateway Midtrans (2026-09-21)
- **Keputusan**: Pembayaran Midtrans ditiadakan dari alur MVP. Aktivasi & manajemen langganan dilakukan **secara manual melalui database** (tabel `subscriptions`).
- **Alasan**: Penyederhanaan alur operasional awal UMKM.
- **Implikasi**:
  - Webhook `/api/webhooks/midtrans` dan integrasi Snap SDK ditiadakan.
  - Halaman `/subscription` menampilkan instruksi pembayaran manual / kontak admin.
  - Perubahan status langganan (`active`, `expired`, `period_end`) dikelola langsung di tabel `subscriptions` Supabase.
