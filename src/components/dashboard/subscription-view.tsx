'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Zap,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { SubscriptionInfo } from '@/lib/billing/state';
import { adminActivateSubscriptionAction } from '@/lib/actions/subscription';

export function SubscriptionView({ initialSub }: { initialSub: SubscriptionInfo | null }) {
  const [sub] = useState<SubscriptionInfo | null>(initialSub);
  const [loadingDemo, setLoadingDemo] = useState(false);

  async function handleDemoActivate() {
    setLoadingDemo(true);
    try {
      const res = await adminActivateSubscriptionAction(sub?.owner_id, 30);
      if (res.success) {
        alert('Paket Basic 30 Hari berhasil diaktifkan secara manual!');
        window.location.reload();
      } else {
        alert(res.error || 'Gagal mengaktifkan paket');
      }
    } catch {
      alert('Terjadi kesalahan saat aktivasi paket');
    } finally {
      setLoadingDemo(false);
    }
  }

  const isExpired = sub ? !sub.is_valid || sub.status === 'expired' : false;
  const isUsageHigh = sub ? sub.usage_percent >= 80 : false;

  return (
    <div className="space-y-6">
      {/* Expired or High Usage Warning Banner */}
      {isExpired && (
        <Card className="border border-rose-300 bg-rose-50 p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-rose-950">Masa Langganan Telah Berakhir</h3>
              <p className="text-xs text-rose-800">
                Widget chat di website kamu saat ini menayangkan pesan nonaktif. Segera perpanjang paket untuk mengaktifkan balasan AI kembali.
              </p>
            </div>
          </div>
        </Card>
      )}

      {isUsageHigh && !isExpired && (
        <Card className="border border-amber-300 bg-amber-50 p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-amber-950">Penggunaan Kuota Memenuhi 80%+</h3>
              <p className="text-xs text-amber-800">
                Kamu telah menggunakan {sub?.usage_current} dari {sub?.quota_max} balasan AI bulan ini ({sub?.usage_percent}%).
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Main Status & Quota Card */}
      <Card className="p-6 border border-border shadow-sm space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
              <Zap className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-foreground">
                  {sub?.plan === 'basic' ? 'Paket Basic SIBISA' : 'Free Trial 14 Hari'}
                </h3>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    isExpired
                      ? 'bg-rose-100 text-rose-800'
                      : sub?.status === 'active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-indigo-100 text-indigo-800'
                  }`}
                >
                  {isExpired ? 'Expired' : sub?.status === 'active' ? 'Aktif' : 'Trialing'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {sub?.days_remaining !== undefined
                  ? `Sisa waktu aktif: ${sub.days_remaining} hari lagi`
                  : 'Status langganan bisnis kamu.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDemoActivate}
              disabled={loadingDemo}
              className="gap-2 text-xs font-semibold"
            >
              {loadingDemo ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5 text-primary" />}
              Aktifkan Paket Basic (Demo Manual DB)
            </Button>
          </div>
        </div>

        {/* Quota Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-foreground">Penggunaan Kuota Balasan AI Bulanan</span>
            <span className="font-semibold text-muted-foreground">
              {sub?.usage_current || 0} / {sub?.quota_max || 100} Balasan ({sub?.usage_percent || 0}%)
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                sub && sub.usage_percent >= 90
                  ? 'bg-rose-500'
                  : sub && sub.usage_percent >= 75
                  ? 'bg-amber-500'
                  : 'bg-primary'
              }`}
              style={{ width: `${sub?.usage_percent || 0}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Plan Features Comparison Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Free Trial Card */}
        <Card className="p-6 flex flex-col justify-between border border-border">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-primary px-2.5 py-1 rounded-full bg-primary-light">
                Paket Uji Coba
              </span>
              <h3 className="text-xl font-bold text-foreground mt-2">Free Trial</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Dapatkan evaluasi penuh seluruh fitur SIBISA selama 14 hari pertama.
              </p>
            </div>
            <div className="text-2xl font-extrabold text-foreground">Gratis</div>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
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
                <span>Handover ke WhatsApp admin</span>
              </li>
            </ul>
          </div>
        </Card>

        {/* Basic Plan Card */}
        <Card className="p-6 flex flex-col justify-between border-2 border-primary bg-primary-light/10 relative overflow-hidden">
          <div className="absolute top-3 right-3 text-[10px] font-bold text-white bg-primary px-2.5 py-1 rounded-full">
            Rekomendasi UMKM
          </div>
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-emerald-700 px-2.5 py-1 rounded-full bg-emerald-100">
                Paket Berlangganan
              </span>
              <h3 className="text-xl font-bold text-foreground mt-2">Basic SaaS</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Solusi terlengkap customer service instan 24/7 untuk bisnis usaha kamu.
              </p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-foreground">Rp75.000</span>
              <span className="text-xs text-muted-foreground">/ bulan</span>
            </div>
            <ul className="space-y-2.5 text-xs text-foreground font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>600 balasan AI instan per bulan</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Widget Chatbot kustom warna & posisi</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Knowledge Base + Auto FAQ Templates</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Riwayat Chat & Pengumpulan Leads CSV</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Handover WhatsApp + Ringkasan Chat</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-primary/20">
            <a
              href="https://wa.me/6281234567890?text=Halo%20Admin%20SIBISA,%20saya%20ingin%20perpanjang/upgrade%20Paket%20Basic%20Rp75.000"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white p-3 text-xs font-bold shadow-sm transition-colors"
            >
              Hubungi Admin via WA untuk Perpanjang
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
