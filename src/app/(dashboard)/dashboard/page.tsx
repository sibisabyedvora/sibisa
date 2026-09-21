import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  MessageSquare,
  Bot,
  Store,
  BookOpen,
  ArrowRight,
  Zap,
  CheckCircle2,
  Clock,
  Users,
  AlertTriangle,
} from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Owner';

  // Fetch business profile if available
  const { data: business } = await supabase
    .from('businesses')
    .select('id, name')
    .eq('owner_id', user?.id || '')
    .maybeSingle();

  // Fetch subscription info if available
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan, status, trial_ends_at, current_period_end')
    .eq('owner_id', user?.id || '')
    .maybeSingle();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
            Halo, {userName}! 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Berikut ringkasan performa asisten AI customer service bisnismu hari ini.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/chatbot">
            <Button size="sm" className="gap-2 shadow-sm">
              <Bot className="h-4 w-4" />
              Uji Chatbot di Playground
            </Button>
          </Link>
        </div>
      </div>

      {/* Subscription Status Card */}
      <Card className="border border-primary/20 bg-gradient-to-r from-primary-light via-card to-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-foreground">
                  Paket Status: {subscription?.plan === 'basic' ? 'Paket Basic (Rp75.000/bln)' : 'Free Trial 14 Hari'}
                </span>
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                  {subscription?.status || 'Active'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Kuota AI Balasan: <strong>0 / 100 balasan</strong> terpakai bulan ini.
              </p>
            </div>
          </div>
          <Link href="/subscription">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              Kelola Langganan
            </Button>
          </Link>
        </div>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Total Percakapan</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-light text-primary">
              <MessageSquare className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-foreground">0</div>
          <p className="text-[11px] text-muted-foreground mt-1">Belum ada chat pengunjung</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Tingkat Jawaban AI</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-foreground">100%</div>
          <p className="text-[11px] text-muted-foreground mt-1">Dijawab langsung dari KB</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Handover WhatsApp</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-foreground">0</div>
          <p className="text-[11px] text-muted-foreground mt-1">Klik lanjut ke WA</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Leads Terkumpul</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-foreground">0</div>
          <p className="text-[11px] text-muted-foreground mt-1">Calon pembeli terdata</p>
        </Card>
      </div>

      {/* Onboarding Checklist Card */}
      {!business && (
        <Card className="border border-amber-200 bg-amber-50/50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="space-y-3 flex-1">
              <div>
                <h3 className="text-base font-bold text-amber-950">Langkah Pertama: Lengkapi Profil Bisnismu</h3>
                <p className="text-xs text-amber-800 mt-1">
                  Agar AI SIBISA dapat menjawab pertanyaan calon pelanggan dengan tepat, isi profil usaha & nomor WhatsApp kamu terlebih dahulu.
                </p>
              </div>
              <Link href="/business">
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white gap-2">
                  Isi Profil Bisnis Sekarang
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Setup Actions Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary mb-3">
              <Store className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-foreground">1. Profil Bisnis</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Atur nama bisnis, jam operasional, alamat, dan nomor WhatsApp admin.
            </p>
          </div>
          <Link href="/business" className="mt-4">
            <Button variant="outline" size="sm" className="w-full">Kelola Profil</Button>
          </Link>
        </Card>

        <Card className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 mb-3">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-foreground">2. Knowledge Base & FAQ</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Masukkan daftar produk/layanan, daftar harga, dan pertanyaan FAQ pelanggan.
            </p>
          </div>
          <Link href="/knowledge" className="mt-4">
            <Button variant="outline" size="sm" className="w-full">Tambah Knowledge</Button>
          </Link>
        </Card>

        <Card className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 mb-3">
              <Bot className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-foreground">3. Pasang Widget Chat</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Salin 1 baris kode script widget dan tempelkan di website toko online kamu.
            </p>
          </div>
          <Link href="/chatbot" className="mt-4">
            <Button variant="outline" size="sm" className="w-full">Ambil Script Widget</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
