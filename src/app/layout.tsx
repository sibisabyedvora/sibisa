import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'SIBISA — AI Chatbot Customer Service untuk UMKM',
  description:
    'Solusi SaaS chatbot AI 24/7 untuk UMKM Indonesia. Otomatisasi pertanyaan pelanggan, kurangi kebocoran prospek, dan handover otomatis ke WhatsApp.',
  keywords: ['AI Chatbot', 'SaaS UMKM', 'Customer Service AI', 'Edvora', 'SIBISA'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} font-sans antialiased`}>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        {children}
      </body>
    </html>
  );
}
