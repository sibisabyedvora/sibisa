import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageSquare, Zap, ShieldCheck, ArrowRight, CheckCircle2, MessageCircle } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xl shadow-md">
              S
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-foreground">SIBISA</span>
              <span className="text-[10px] font-medium text-muted-foreground -mt-1">by Edvora</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Masuk
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Coba Gratis 14 Hari</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-28">
          <div className="container mx-auto max-w-5xl px-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-light px-4 py-1.5 text-xs font-semibold text-primary mb-6 shadow-sm">
              <Zap className="h-3.5 w-3.5" />
              <span>SaaS Chatbot AI Khusus UMKM Indonesia</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl leading-[1.15]">
              Customer bertanya, <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
                SIBISA yang bantu jawab 24/7.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Pasang 1 baris widget di website tokomu. Balas pertanyaan harga, jam buka, dan stok instan dalam hitungan detik. Jika butuh tindakan manusia, langsung handover ke WhatsApp!
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-primary/20">
                  Mulai Trial Gratis 14 Hari
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              <Link href="#demo">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Lihat Cara Kerja
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-secondary" />
                Tanpa Koding
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-secondary" />
                Trial 14 Hari (100 Balasan)
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-secondary" />
                Rp75.000 / Bulan
              </span>
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="border-t border-border bg-card py-16">
          <div className="container mx-auto max-w-5xl px-4">
            <h2 className="text-center text-2xl font-bold text-foreground md:text-3xl">
              Mengapa UMKM Memilih SIBISA?
            </h2>
            <p className="text-center text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
              Dirancang khusus untuk membantu bisnis kuliner, salon, travel, e-commerce & jasa perorangan yang menangani operasional sendiri.
            </p>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="flex flex-col items-start p-6 transition-all hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary mb-4">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Respon Instan 24/7</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Asisten AI menjawab calon pembeli detik itu juga tanpa membuat mereka berpaling ke kompetitor.
                </p>
              </Card>

              <Card className="flex flex-col items-start p-6 transition-all hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-light text-secondary mb-4">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Handover Otomatis ke WA</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Pertanyaan di luar data bisnis langsung diarahkan ke WhatsApp owner lengkap dengan ringkasan pesan.
                </p>
              </Card>

              <Card className="flex flex-col items-start p-6 transition-all hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary mb-4">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Akurat & Tanpa Halusinasi</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  AI dilatih menjawab HANYA dari data bisnis dan FAQ yang kamu masukkan di dashboard.
                </p>
              </Card>
            </div>
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
