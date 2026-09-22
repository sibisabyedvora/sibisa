# 📖 Panduan Penggunaan & SOP Operasional Admin SIBISA

> **SIBISA** (Presented by **Edvora**) adalah platform SaaS Chatbot AI Customer Service 24/7 yang merespons pertanyaan pengunjung website toko online secara otomatis & instan, serta mengalihkan (**handover**) pertanyaan khusus ke WhatsApp admin.

---

## 📋 Daftar Isi
1. [Langkah 1: Login & Autentikasi](#1-login--autentikasi)
2. [Langkah 2: Lengkapi Profil Bisnis & Jam Operasional](#2-lengkapi-profil-bisnis--jam-operasional)
3. [Langkah 3: Kelola Knowledge Base & FAQ](#3-kelola-knowledge-base--faq)
4. [Langkah 4: Atur Chatbot & Uji Coba Playground](#4-atur-chatbot--uji-coba-playground)
5. [Langkah 5: Pasang Script Widget di Website](#5-pasang-script-widget-di-website)
6. [Langkah 6: Operasional Harian Admin](#6-operasional-harian-admin)
   - [A. Memantau Riwayat Percakapan](#a-memantau-riwayat-percakapan)
   - [B. Mengelola Prospek / Leads](#b-mengelola-prospek--leads)
   - [C. Menambah FAQ dari Pertanyaan Belum Terjawab](#c-menambah-faq-dari-pertanyaan-belum-terjawab)
7. [Langkah 7: Pengelolaan Langganan & Kuota](#7-pengelolaan-langganan--kuota)
8. [Tanya Jawab & Solusi Kendala (Troubleshooting)](#8-tanya-jawab--solusi-kendala)

---

## 1. Login & Autentikasi

1. Buka URL aplikasi di [https://app.sibisa.id/login](https://app.sibisa.id/login) atau server lokal [http://localhost:3000/login](http://localhost:3000/login).
2. Kamu dapat masuk menggunakan **Email & Kata Sandi** atau mengeklik tombol **"Masuk dengan Google"**.
3. Saat baru pertama kali mendaftar, kamu akan langsung mendapatkan paket **Free Trial 14 Hari (100 Balasan AI Gratis)** secara otomatis.

---

## 2. Lengkapi Profil Bisnis & Jam Operasional

> **Lokasi Menu:** Dashboard ➔ **Profil Bisnis** (`/business`)

AI SIBISA membutuhkan data dasar tentang usahamu untuk menyapa pelanggan dan mengarahkan kontak.

### Langkah Pengisian:
1. Isi **Nama Usaha** (contoh: *Kopi Senja & Roastery*).
2. Pilih **Kategori Usaha** (Kuliner, Salon/Spa, Travel, Event, Edukasi, E-Commerce, dll).
3. Masukkan **Deskripsi Singkat** tentang usaha kamu.
4. **PENTING — Nomor WhatsApp Admin:**
   - Masukkan nomor WA yang akan menerima obrolan saat pelanggan meminta bantuan manusia.
   - Format wajib: `628xxxxxxxxxx` (contoh: `6281234567890`).
5. Isi **Alamat Fisik**, **Link Google Maps**, dan **Sosial Media** (Instagram, TikTok).
6. **Atur Jam Operasional:**
   - Tentukan jam buka & tutup per hari (Senin – Minggu).
   - Centang **Tutup** bila pada hari tertentu bisnismu tidak beroperasi.
   - *AI akan menggunakan data ini untuk menjawab pertanyaan seperti "Buka jam berapa hari Minggu?"*.
7. Klik **Simpan Profil Bisnis**.

---

## 3. Kelola Knowledge Base & FAQ

> **Lokasi Menu:** Dashboard ➔ **Knowledge & FAQ** (`/knowledge`)

AI SIBISA menjawab pertanyaan pelanggan **HANYA** berdasarkan informasi yang ada di menu ini.

### A. Memasukkan Produk / Layanan
1. Pilih tipe **Produk / Layanan**.
2. Masukkan **Nama Produk** (contoh: *Kopi Susu Gula Aren 1 Liter*).
3. Isi **Deskripsi**, **Harga Minimal**, dan **Harga Maksimal** (bila ada).
4. Klik **Tambah Knowledge**.

### B. Memasukkan FAQ (Pertanyaan Sering Diajukan)
1. Pilih tipe **FAQ**.
2. Masukkan **Pertanyaan** (contoh: *Apakah ada fasilitas area parkir mobil?*).
3. Masukkan **Jawaban** (contoh: *Ya, kedai kami memiliki area parkir mobil & motor yang luas dan gratis*).
4. *Tips:* Kamu bisa klik tombol **"Pakai Template Kategori"** di bagian atas untuk mengisi contoh FAQ otomatis sesuai jenis usahamu!

### C. Indikator Kapasitas Karakter
- Batas maksimum total data adalah **10.000 karakter** per bisnis.
- Pantau indikator kapasitas di bagian atas halaman untuk memastikan kuota teks tidak melebihi batas.

---

## 4. Atur Chatbot & Uji Coba Playground

> **Lokasi Menu:** Dashboard ➔ **Pengaturan Chatbot** (`/chatbot`)

Di menu ini kamu bisa menyesuaikan tampilan widget agar serasi dengan desain brand toko online kamu.

### A. Kustomisasi Tampilan Widget
- **Nama Chatbot:** Nama asisten yang tampil di header widget (contoh: *Asisten Senja*).
- **Sapaan Awal (Greeting):** Pesan pembuka otomatis saat pengunjung membuka chat (contoh: *Halo! Selamat datang di Kopi Senja. Ada yang bisa kami bantu?*).
- **Gaya Bahasa (Tone):** 
  - *Ramah* (Gunakan "kamu" / "Kak")
  - *Formal* (Gunakan "Anda" / "Bapak/Ibu")
  - *Santai* (Gunakan "Guys" / "Kamu")
- **Pesan Fallback:** Pesan yang dikirim saat AI tidak menemukan jawaban / mengalihkan ke WA.
- **Warna Utama (Primary Color):** Pilih warna tombol & header widget.
- **Posisi Widget:** Pojok Kanan Bawah (*Bottom-Right*) atau Kanan Left (*Bottom-Left*).
- **Domain Diizinkan:** Masukkan domain website kamu (kosongkan bila ingin mengizinkan semua domain).

### B. Menguji Chatbot di Playground (Tanpa Potong Kuota)
1. Klik tombol **"Uji Chatbot di Playground"** di pojok kanan atas.
2. Cobalah mengetik pertanyaan seolah-olah kamu adalah calon pembeli (contoh: *"Buka jam berapa hari ini?"*, *"Harga kopi berapa?"*).
3. *Pengujian di Playground 100% gratis dan tidak memotong kuota langganan harian/bulanan kamu.*

---

## 5. Pasang Script Widget di Website

> **Lokasi Menu:** Dashboard ➔ **Pengaturan Chatbot** (`/chatbot`)

1. Scroll ke bagian **Kode Embed Script Widget**.
2. Klik tombol **Salin Kode**. Kodenya tampak seperti berikut:
   ```html
   <script src="https://app.sibisa.id/widget.js" data-key="pk_live_xxxxxxxxxxxxxxxx" defer></script>
   ```
3. Tempelkan kode script tersebut ke dalam tag `<head>` atau sebelum tag `</body>` pada website toko online kamu (WordPress, Shopify, HTML statis, WooCommerce, dll).
4. Widget mengambang akan langsung muncul di websitemu secara otomatis!

---

## 6. Operasional Harian Admin

### A. Memantau Riwayat Percakapan
> **Lokasi Menu:** Dashboard ➔ **Riwayat Chat** (`/history`)

- Halaman ini menampilkan seluruh sesi chat pengunjung dari widget website.
- **Filter Status:**
  - `Terbuka`: Chat yang sedang aktif/dijawab AI.
  - `Handover WA`: Percakapan di mana pengunjung mengeklik tombol WhatsApp admin.
  - `Selesai`: Chat yang sudah selesai ditangani.
- Klik pada salah satu baris percakapan untuk membuka **Panel Detail Thread** dan membaca seluruh isi pesan antara pengunjung & AI.

### B. Mengelola Prospek / Leads
> **Lokasi Menu:** Dashboard ➔ **Leads / Prospek** (`/leads`)

- Setiap pengunjung yang mengeklik tombol WhatsApp atau mengisi form otomatis tercatat di sini.
- **Tindakan Admin:**
  1. Klik tombol **"Hubungi WA"** untuk langsung membuka percakapan WhatsApp dengan calon pembeli.
  2. Perbarui **Status Lead**: `Baru` ➔ `Dihubungi` ➔ `Closing (Won)` atau `Batal (Lost)`.
  3. Klik tombol **Export CSV** untuk mengunduh rekapitulasi data prospek ke format Microsoft Excel / CSV.

### C. Menambah FAQ dari Pertanyaan Belum Terjawab
> **Lokasi Menu:** Dashboard ➔ **Analitik** (`/analytics`)

- Buka bagian **"Pertanyaan Belum Terjawab"**.
- Bagian ini mencatat pertanyaan pengunjung yang memicu *handover* karena informasinya belum ada di Knowledge Base.
- Klik tombol **"Buat FAQ Baru"** di samping pertanyaan tersebut agar AI SIBISA dapat menjawab pertanyaan serupa secara otomatis di masa mendatang!

---

## 7. Pengelolaan Langganan & Kuota

> **Lokasi Menu:** Dashboard ➔ **Langganan** (`/subscription`)

- **Paket Free Trial:** 14 Hari pertama dengan kuota 100 balasan AI gratis.
- **Paket Basic SaaS:** Rp75.000/bulan dengan kuota 600 balasan AI per bulan.
- **Monitoring Kuota:** Progress bar di halaman langganan akan menampilkan jumlah balasan AI yang sudah terpakai.
- **Banner Peringatan 80% & 100%:** Bila kuota mencapai 80%, sistem akan memberikan peringatan. Jika kuota 100% habis, widget akan menayangkan pesan sopan tanpa menimbulkan biaya AI.
- **Perpanjangan Manual:** Klik tombol **"Hubungi Admin via WA untuk Perpanjang"** untuk mengonfirmasi pembayaran dan memperpanjang paket 30 hari.

---

## 8. Tanya Jawab & Solusi Kendala

#### Q: Mengapa widget tidak muncul di website saya?
- Pastikan status **Aktifkan Chatbot** di menu `/chatbot` dalam posisi menyala (ON).
- Pastikan domain website kamu sudah dimasukkan ke kolom **Domain Diizinkan** (atau kosongkan agar dapat diakses dari mana saja).

#### Q: Mengapa AI menjawab "Maaf, untuk hal ini silakan hubungi admin"?
- Berarti pertanyaan pelanggan belum terdata di menu **Knowledge & FAQ** (`/knowledge`). Silakan tambahkan pertanyaan tersebut ke Knowledge Base kamu.

#### Q: Apakah aman dari pembocoran data?
- Sangat aman. AI SIBISA dilatih dengan proteksi *anti-prompt injection* dan Row Level Security (RLS) sehingga data bisnismu terisolasi 100%.

---

© 2026 **SIBISA by Edvora**. Hak cipta dilindungi undang-undang.
