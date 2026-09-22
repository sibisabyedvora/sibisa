'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Zap,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  Send,
  User,
  Bot,
  ChevronDown,
} from 'lucide-react';

export default function LandingPage() {
  // Dogfooding Demo Widget State
  const [demoMessages, setDemoMessages] = useState([
    {
      role: 'assistant',
      content: 'Halo! Selamat datang di Kopi Senja. Ada yang bisa kami bantu?',
    },
  ]);
  const [demoInput, setDemoInput] = useState('');
  const [demoSending, setDemoSending] = useState(false);

  function handleDemoSend(e: React.FormEvent) {
    e.preventDefault();
    if (!demoInput.trim() || demoSending) return;

    const userText = demoInput.trim();
    setDemoInput('');
    setDemoMessages((prev) => [...prev, { role: 'user', content: userText }]);
    setDemoSending(true);

    setTimeout(() => {
      let botReply = 'Halo! Kopi Gula Aren Senja ready setiap hari ya. Kami buka dari jam 09:00 - 22:00 WIB.';
      if (userText.toLowerCase().includes('harga') || userText.toLowerCase().includes('paket')) {
        botReply = 'Harga kopi kami mulai dari Rp18.000 untuk Espresso dan Rp25.000 untuk Kopi Susu Senja!';
      } else if (userText.toLowerCase().includes('alamat') || userText.toLowerCase().includes('lokasi')) {
        botReply = 'Alamat kedai kami di Jl. Pemuda No. 45, Bandung. Tersedia area parkir mobil & motor!';
      } else if (userText.toLowerCase().includes('diskon') || userText.toLowerCase().includes('borongan')) {
        botReply = 'Untuk pesanan borongan kantor & negosiasi diskon khusus, silakan klik tombol WhatsApp di bawah ya.';
      }

      setDemoMessages((prev) => [...prev, { role: 'assistant', content: botReply }]);
      setDemoSending(false);
    }, 800);
  }

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Apakah saya perlu keahlian koding untuk memasang SIBISA?',
      a: 'Sama sekali tidak! Kamu cukup menyalin 1 baris kode script unik dari dashboard dan menempelkannya di website toko online kamu (WordPress, Shopify, HTML, dll).',
    },
    {
      q: 'Bagaimana AI SIBISA tahu informasi bisnis saya?',
      a: 'AI SIBISA belajar langsung dari profil usaha, daftar produk, jam operasional, dan FAQ yang kamu masukkan di dashboard SIBISA.',
    },
    {
      q: 'Bagaimana jika ada pertanyaan sulit yang tidak ada di Knowledge Base?',
      a: 'AI SIBISA tidak akan asal mengarang jawaban. AI akan secara otomatis menawarkan tombol WhatsApp lengkap dengan ringkasan pertanyaan pelanggan agar bisa dilanjutkan oleh kamu/admin.',
    },
    {
      q: 'Berapa biaya langganan SIBISA setelah masa trial habis?',
      a: 'Setelah trial 14 hari gratis (100 balasan) habis, kamu dapat melanjutkan ke Paket Basic hanya seharga Rp75.000/bulan untuk 600 balasan AI per bulan.',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xl shadow-md">
              S
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-foreground">SIBISA</span>
              <span className="text-[10px] font-medium text-muted-foreground -mt-1">by Edvora</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-muted-foreground">
            <a href="#masalah" className="hover:text-foreground transition-colors">Masalah</a>
            <a href="#cara-kerja" className="hover:text-foreground transition-colors">Cara Kerja</a>
            <a href="#demo" className="hover:text-foreground transition-colors">Demo Live</a>
            <a href="#harga" className="hover:text-foreground transition-colors">Harga</a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Masuk</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="shadow-sm">Coba Gratis 14 Hari</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* 1. HERO SECTION */}
        <section className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-b from-primary-light/30 via-background to-background">
          <div className="container mx-auto max-w-5xl px-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-4 py-1.5 text-xs font-bold text-primary mb-6 shadow-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>SaaS Chatbot AI Customer Service UMKM Indonesia</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl leading-[1.15]">
              Customer bertanya, <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-primary via-indigo-600 to-emerald-600 bg-clip-text text-transparent">
                SIBISA yang bantu jawab 24/7.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-sm text-muted-foreground sm:text-base leading-relaxed">
              Pasang 1 baris widget di website toko online kamu. Balas pertanyaan harga, stok, dan jam buka secara otomatis & instan. Bila butuh tindakan manusia, langsung handover ke WhatsApp admin!
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-primary/20 gap-2">
                  Mulai Trial Gratis 14 Hari
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#demo">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Coba Demo Chatbot Langsung
                </Button>
              </a>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Tanpa Koding & Tanpa Server
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Trial 14 Hari (100 Balasan Gratis)
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Hanya Rp75.000 / Bulan
              </span>
            </div>
          </div>
        </section>

        {/* 2. MASALAH SECTION */}
        <section id="masalah" className="py-16 bg-card border-y border-border">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-extrabold text-foreground sm:text-3xl">
                Berapa Banyak Calon Pembeli yang Kabur Karena Chat Lambat Dibalas?
              </h2>
              <p className="text-xs text-muted-foreground mt-2">
                Pola kebocoran prospek pada UMKM akibat operasional penanganan customer service secara manual.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <Card className="p-6 border border-rose-200 bg-rose-50/40">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700 mb-4">
                  <Clock className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-rose-950">1. Balas Chat Lambat Saat Ramai</h3>
                <p className="text-xs text-rose-800 mt-1.5 leading-relaxed">
                  Saat kamu sibuk melayani pembeli di toko atau packing barang, calon pelanggan online yang bertanya harga terabaikan dan pindah ke kompetitor.
                </p>
              </Card>

              <Card className="p-6 border border-amber-200 bg-amber-50/40">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 mb-4">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-amber-950">2. Pertanyaan Berulang Yang Sama</h3>
                <p className="text-xs text-amber-800 mt-1.5 leading-relaxed">
                  Menjawab pertanyaan &ldquo;buka jam berapa?&rdquo;, &ldquo;lokasi di mana?&rdquo;, dan &ldquo;ada menu apa aja?&rdquo; berulang kali menyita waktu fokus bisnismu.
                </p>
              </Card>

              <Card className="p-6 border border-indigo-200 bg-indigo-50/40">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 mb-4">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-indigo-950">3. Kehilangan Chat Malam Hari</h3>
                <p className="text-xs text-indigo-800 mt-1.5 leading-relaxed">
                  Pengunjung website mencari informasi di malam hari saat toko tutup, namun tidak ada respons hingga pagi hari dan prospek hilang.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* 3. CARA KERJA SECTION */}
        <section id="cara-kerja" className="py-20 bg-background">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold text-primary px-3 py-1 rounded-full bg-primary-light">
                Praktis & Instan
              </span>
              <h2 className="text-2xl font-extrabold text-foreground sm:text-3xl mt-3">
                3 Langkah Mudah Memasang SIBISA
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Tanpa perlu latar belakang teknis atau coding. Siap dalam 5 menit.
              </p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-extrabold text-lg shadow-md">
                  1
                </div>
                <h3 className="font-bold text-base text-foreground">Isi Profil & Knowledge Base</h3>
                <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                  Masukkan jam operasional, daftar produk, harga, dan pertanyaan FAQ pelanggan kamu di dashboard SIBISA.
                </p>
              </div>

              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-extrabold text-lg shadow-md">
                  2
                </div>
                <h3 className="font-bold text-base text-foreground">Salin 1 Baris Kode Widget</h3>
                <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                  Tempelkan 1 baris kode widget ke website atau landing page toko online kamu.
                </p>
              </div>

              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-extrabold text-lg shadow-md">
                  3
                </div>
                <h3 className="font-bold text-base text-foreground">AI Balas 24/7 & Handover WA</h3>
                <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                  AI langsung menjawab pertanyaan calon pembeli 24/7 dan mengalihkan pertanyaan khusus ke WhatsApp kamu!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. LIVE DEMO DOGFOODING SECTION */}
        <section id="demo" className="py-20 bg-card border-y border-border">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold text-emerald-800 px-3 py-1 rounded-full bg-emerald-100">
                Uji Coba Langsung (Dogfooding Demo)
              </span>
              <h2 className="text-2xl font-extrabold text-foreground sm:text-3xl mt-3">
                Coba Interaksi Chatbot SIBISA di Bawah Ini
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Ketik pertanyaan seperti &ldquo;buka jam berapa?&rdquo;, &ldquo;harga kopi berapa?&rdquo;, atau &ldquo;minta diskon borongan&rdquo; untuk melihat respons AI & handover WhatsApp.
              </p>
            </div>

            {/* Simulated Live Chat Box */}
            <Card className="max-w-md mx-auto border-2 border-primary/30 shadow-xl overflow-hidden rounded-2xl">
              <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white font-bold">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Asisten Kopi Senja (Demo)</h4>
                    <span className="text-[10px] text-primary-foreground/80">Online 24/7 • SIBISA AI</span>
                  </div>
                </div>
              </div>

              <div className="h-72 p-4 overflow-y-auto space-y-3 bg-muted/20 text-xs">
                {demoMessages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-tr-none'
                          : 'bg-card border border-border text-foreground rounded-tl-none shadow-sm'
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                {demoSending && (
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Bot className="h-3.5 w-3.5 text-primary animate-pulse" />
                    <span>Asisten AI sedang mengetik...</span>
                  </div>
                )}
              </div>

              <form onSubmit={handleDemoSend} className="p-3 border-t border-border bg-card flex gap-2">
                <input
                  type="text"
                  placeholder="Ketik pertanyaan kamu di sini..."
                  value={demoInput}
                  onChange={(e) => setDemoInput(e.target.value)}
                  className="flex-1 bg-muted px-3 py-2 text-xs rounded-xl border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button type="submit" size="sm" disabled={demoSending} className="rounded-xl px-3">
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </form>
            </Card>
          </div>
        </section>

        {/* 5. FITUR UNGGULAN SECTION */}
        <section className="py-20 bg-background">
          <div className="container mx-auto max-w-5xl px-4">
            <h2 className="text-center text-2xl font-extrabold text-foreground md:text-3xl">
              Fitur Lengkap yang Bikin UMKM Makin Efisien
            </h2>
            <p className="text-center text-xs text-muted-foreground mt-2 max-w-xl mx-auto">
              Dirancang sesuai kebutuhan riil pemilik usaha skala kecil & menengah di Indonesia.
            </p>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="p-6 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-foreground">Akurat & Anti Halusinasi</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  AI menjawab HANYA dari data bisnis kamu. Tidak pernah asal mengarang harga, jadwal, atau promo.
                </p>
              </Card>

              <Card className="p-6 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-foreground">Handover WA + Ringkasan Chat</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Pertanyaan khusus langsung dihubungkan ke WhatsApp kamu dengan teks yang memuat ringkasan percakapan.
                </p>
              </Card>

              <Card className="p-6 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                  <User className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-foreground">Penangkap Lead & Export CSV</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Kumpulkan nama & kontak calon pelanggan potensial dan unduh data ke format CSV kapan saja.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* 6. HARGA & FAQ SECTION */}
        <section id="harga" className="py-20 bg-card border-t border-border">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl font-extrabold text-foreground sm:text-3xl">
                Paket & Pertanyaan Sering Diajukan (FAQ)
              </h2>
              <p className="text-xs text-muted-foreground mt-2">
                Satu harga sederhana untuk semua fitur hebat SIBISA.
              </p>
            </div>

            {/* Pricing Summary Card */}
            <Card className="max-w-xl mx-auto p-8 border-2 border-primary bg-primary-light/10 mb-16 text-center space-y-6">
              <div>
                <span className="text-xs font-bold text-emerald-800 px-3 py-1 rounded-full bg-emerald-100">
                  Paket Basic SaaS
                </span>
                <div className="mt-4 flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-extrabold text-foreground">Rp75.000</span>
                  <span className="text-xs text-muted-foreground font-semibold">/ bulan</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Sudah termasuk 600 balasan AI/bulan, Widget Chatbot, Knowledge Base, Analitik & Handover WA.
                </p>
              </div>

              <Link href="/register">
                <Button size="lg" className="w-full gap-2 shadow-md">
                  Coba Gratis 14 Hari Pertama
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </Card>

            {/* FAQ Accordion */}
            <div className="max-w-2xl mx-auto space-y-3">
              {faqs.map((faq, idx) => (
                <Card
                  key={idx}
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="p-4 cursor-pointer transition-all hover:border-primary/50"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="font-bold text-xs text-foreground">{faq.q}</h4>
                    <ChevronDown
                      className={`h-4 w-4 text-muted-foreground transition-transform ${
                        openFaq === idx ? 'rotate-180 text-primary' : ''
                      }`}
                    />
                  </div>
                  {openFaq === idx && (
                    <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border leading-relaxed">
                      {faq.a}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 7. CTA AKHIR SECTION */}
        <section className="py-20 bg-primary text-primary-foreground text-center relative overflow-hidden">
          <div className="container mx-auto max-w-4xl px-4 space-y-6">
            <h2 className="text-3xl font-extrabold sm:text-4xl leading-tight">
              Siap Mengubah Pengunjung Website Jadi Pelanggan Setia?
            </h2>
            <p className="text-sm text-primary-foreground/80 max-w-xl mx-auto">
              Daftar sekarang dan aktifkan asisten AI SIBISA dalam 5 menit. Tanpa kartu kredit.
            </p>
            <Link href="/register" className="inline-block">
              <Button size="lg" variant="secondary" className="font-bold gap-2 text-primary shadow-lg">
                Mulai Trial Gratis 14 Hari
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto max-w-6xl px-4 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-foreground">SIBISA</span>
            <span className="text-xs text-muted-foreground">© 2026 Presented by Edvora. All rights reserved.</span>
          </div>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
            <Link href="/harga" className="hover:text-foreground">Harga</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
