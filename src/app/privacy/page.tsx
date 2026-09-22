import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Kebijakan Privasi — SIBISA AI Chatbot',
  description: 'Kebijakan privasi perlindungan data pribadi pengguna dan pengunjung SIBISA (UU PDP No. 27/2022).',
};

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-extrabold tracking-tight">Kebijakan Privasi (Privacy Policy)</h1>
          <p className="text-xs text-muted-foreground">Terakhir Diperbarui: 22 September 2026</p>

          <div className="space-y-4 text-xs md:text-sm leading-relaxed text-muted-foreground">
            <p>
              Selamat datang di <strong>SIBISA</strong> (Presented by Edvora). Kami berkomitmen penuh untuk melindungi data pribadi dan privasi kamu serta pengunjung website bisnis kamu sesuai dengan UU Perlindungan Data Pribadi (UU PDP No. 27/2022).
            </p>

            <h2 className="text-base font-bold text-foreground mt-6">1. Data yang Kami Kumpulkan</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Informasi Akun Owner:</strong> Nama, alamat email, dan kredensial autentikasi.</li>
              <li><strong>Profil Bisnis & Knowledge Base:</strong> Deskripsi usaha, alamat, jam operasional, FAQ, dan informasi produk.</li>
              <li><strong>Data Pengunjung Widget:</strong> Hash alamat IP (kami tidak menyimpan IP mentah), metadata peramban, riwayat percakapan chat, dan kontak lead (bila diberikan secara sukarela).</li>
            </ul>

            <h2 className="text-base font-bold text-foreground mt-6">2. Penggunaan Informasi</h2>
            <p>
              Data yang dikumpulkan digunakan semata-mata untuk menyediakan layanan AI customer service, memproses jawaban otomatis dari Gemini API, menyajikan analitik performa di dashboard owner, dan menghubungi kamu terkait layanan SIBISA.
            </p>

            <h2 className="text-base font-bold text-foreground mt-6">3. Keamanan & Retensi Data</h2>
            <p>
              Seluruh percakapan dan data bisnis disimpan di infrastruktur Supabase dengan enkripsi standar industri dan dilindungi oleh Row Level Security (RLS). Data riwayat percakapan secara otomatis di-retensi selama maksimum 12 bulan.
            </p>

            <h2 className="text-base font-bold text-foreground mt-6">4. Hak Pengguna</h2>
            <p>
              Kamu berhak untuk mengakses, mengoreksi, atau meminta penghapusan seluruh data akun dan riwayat bisnis kamu kapan saja melalui dashboard atau dengan menghubungi tim dukungan kami.
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
