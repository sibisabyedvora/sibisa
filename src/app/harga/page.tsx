import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, ArrowRight, Zap } from 'lucide-react';

export const metadata = {
  title: 'Harga Paket SIBISA — SaaS Chatbot AI UMKM Rp75.000/bln',
  description: 'Daftar harga paket langganan SIBISA AI Chatbot. Mulai dari Free Trial 14 Hari hingga Paket Basic Rp75.000/bulan.',
};

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      {/* Header */}
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
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Masuk</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Coba Gratis 14 Hari</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-16 md:py-24">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-light px-4 py-1.5 text-xs font-semibold text-primary mb-4">
            <Zap className="h-3.5 w-3.5" />
            <span>Transparan & Tanpa Biaya Tersembunyi</span>
          </div>

          <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl md:text-5xl">
            Harga Terjangkau untuk UMKM Indonesia
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
            Pilih paket yang paling sesuai dengan kebutuhan usaha kamu. Coba gratis 14 hari pertama tanpa kartu kredit.
          </p>

          {/* Pricing Grid */}
          <div className="mt-12 grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {/* Free Trial Card */}
            <Card className="p-8 flex flex-col justify-between border border-border text-left">
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-primary px-3 py-1 rounded-full bg-primary-light">
                    Evaluasi Usaha
                  </span>
                  <h3 className="text-2xl font-bold text-foreground mt-3">Free Trial</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Evaluasi penuh performa AI menjawab pertanyaan calon pembeli kamu.
                  </p>
                </div>
                <div className="text-3xl font-extrabold text-foreground">Gratis 14 Hari</div>
                <ul className="space-y-3 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>100 balasan AI gratis total</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>1 Chatbot Widget Website</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Knowledge Base maks 10.000 karakter</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Handover otomatis ke WhatsApp admin</span>
                  </li>
                </ul>
              </div>

              <Link href="/register" className="mt-8">
                <Button variant="outline" className="w-full">
                  Mulai Uji Coba Gratis
                </Button>
              </Link>
            </Card>

            {/* Basic SaaS Card */}
            <Card className="p-8 flex flex-col justify-between border-2 border-primary bg-primary-light/10 text-left relative overflow-hidden shadow-lg">
              <div className="absolute top-4 right-4 text-[11px] font-bold text-white bg-primary px-3 py-1 rounded-full shadow-sm">
                Paling Populer
              </div>
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-emerald-800 px-3 py-1 rounded-full bg-emerald-100">
                    Paket Berlangganan
                  </span>
                  <h3 className="text-2xl font-bold text-foreground mt-3">Paket Basic</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Solusi lengkap asisten CS AI 24 jam non-stop untuk meningkatkan transaksi.
                  </p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-foreground">Rp75.000</span>
                  <span className="text-xs text-muted-foreground font-semibold">/ bulan</span>
                </div>
                <ul className="space-y-3 text-xs text-foreground font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>600 balasan AI per bulan</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Kustomisasi warna & posisi widget</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Knowledge Base + Auto FAQ Templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Analitik Jam Tersibuk & Riwayat Chat</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Pengumpulan Leads & Export CSV</span>
                  </li>
                </ul>
              </div>

              <Link href="/register" className="mt-8">
                <Button className="w-full gap-2 shadow-md">
                  Daftar Sekarang
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </Card>
          </div>
        </div>
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
