import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Syarat & Ketentuan Layanan — SIBISA AI Chatbot',
  description: 'Syarat dan ketentuan penggunaan layanan SaaS SIBISA AI Chatbot oleh Edvora.',
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
              S
            </div>
            <span className="text-lg font-extrabold tracking-tight text-foreground">SIBISA</span>
          </Link>
          <Link href="/">
            <Button variant="outline" size="sm">Kembali ke Beranda</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto max-w-4xl px-4 space-y-6 text-foreground">
          <h1 className="text-3xl font-extrabold tracking-tight">Syarat & Ketentuan Layanan (Terms of Service)</h1>
          <p className="text-xs text-muted-foreground">Terakhir Diperbarui: 22 September 2026</p>

          <div className="space-y-4 text-xs md:text-sm leading-relaxed text-muted-foreground">
            <p>
              Dengan mendaftar dan menggunakan layanan <strong>SIBISA</strong>, kamu menyetujui syarat dan ketentuan layanan berikut.
            </p>

            <h2 className="text-base font-bold text-foreground mt-6">1. Deskripsi Layanan</h2>
            <p>
              SIBISA adalah platform SaaS kecerdasan buatan (AI) yang menyediakan widget chatbot customer service untuk membantu pemilik UMKM merespons pertanyaan pengunjung secara otomatis 24/7 dan mengalihkan pertanyaan kompleks ke WhatsApp admin.
            </p>

            <h2 className="text-base font-bold text-foreground mt-6">2. Akun & Keamanan</h2>
            <p>
              Kamu bertanggung jawab penuh atas kerahasiaan kata sandi akun dan aktivitas yang terjadi di bawah akun kamu. SIBISA berhak menangguhkan akun yang terindikasi melakukan penyalahgunaan atau aktivitas ilegal.
            </p>

            <h2 className="text-base font-bold text-foreground mt-6">3. Penggunaan Yang Diizinkan & Batasan</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Kamu dilarang menggunakan SIBISA untuk menyebarkan konten ilegal, penipuan, perjudian, atau ujaran kebencian.</li>
              <li>Kamu dilarang mencoba melakukan prompt injection yang bertujuan merusak infrastruktur platform.</li>
              <li>Layanan ini disediakan sebagai asisten pembantu respons awal dan tidak menggantikan kepastian transaksi hukum atau perjanjian tertulis manusia.</li>
            </ul>

            <h2 className="text-base font-bold text-foreground mt-6">4. Pembayaran & Pembatalan</h2>
            <p>
              Paket berlangganan diproses berdasarkan ketentuan bulanan (30 hari). Pembatalan atau penyesuaian paket dapat dilakukan sewaktu-waktu melalui dashboard owner.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-card py-6 text-center text-xs text-muted-foreground">
        © 2026 SIBISA by Edvora. All rights reserved.
      </footer>
    </div>
  );
}
