import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://app.sibisa.id'),
  title: 'SIBISA — AI Chatbot Customer Service untuk UMKM Indonesia',
  description:
    'Solusi SaaS chatbot AI 24/7 untuk UMKM Indonesia. Jawab pertanyaan harga & operasional instan, kurangi kebocoran prospek, dan handover otomatis ke WhatsApp.',
  keywords: ['AI Chatbot', 'SaaS UMKM', 'Customer Service AI', 'Edvora', 'SIBISA', 'Chatbot WhatsApp'],
  authors: [{ name: 'Edvora' }],
  openGraph: {
    title: 'SIBISA — AI Chatbot Customer Service untuk UMKM Indonesia',
    description: 'Solusi SaaS chatbot AI 24/7 untuk UMKM Indonesia. Pasang 1 baris script, jawab calon pembeli instan.',
    url: 'https://app.sibisa.id',
    siteName: 'SIBISA by Edvora',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SIBISA — AI Chatbot Customer Service untuk UMKM',
    description: 'Asisten AI 24/7 pembantu operasional customer service toko online kamu.',
  },
  robots: {
    index: true,
    follow: true,
  },
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
