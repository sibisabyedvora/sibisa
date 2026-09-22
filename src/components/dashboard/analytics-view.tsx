'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  Clock,
  Zap,
  HelpCircle,
  Plus,
  TrendingUp,
  Activity,
} from 'lucide-react';
import { AnalyticsSummary } from '@/lib/actions/analytics';
import { TrendChart } from '@/components/dashboard/trend-chart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export function AnalyticsView({ data }: { data: AnalyticsSummary }) {
  // Find busiest hour
  const maxHourCount = Math.max(...data.hourlyDistribution.map((h) => h.count), 0);
  const busiestHour = data.hourlyDistribution.find((h) => h.count === maxHourCount && maxHourCount > 0);

  return (
    <div className="space-y-6">
      {/* 4 Performance Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Answer Rate (AI)</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-foreground">{data.answerRate}%</div>
          <p className="text-[11px] text-muted-foreground mt-1">
            {data.totalAiReplies} balasan AI langsung dari Knowledge
          </p>
        </Card>

        <Card className="p-5 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Handover Rate</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-foreground">{data.handoverRate}%</div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Pertanyaan yang dialihkan ke WhatsApp
          </p>
        </Card>

        <Card className="p-5 border-l-4 border-l-indigo-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Rata-rata Latensi AI</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-foreground">
            {data.avgLatencyMs ? `${(data.avgLatencyMs / 1000).toFixed(1)}s` : '< 1.5s'}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Waktu respons Gemini API</p>
        </Card>

        <Card className="p-5 border-l-4 border-l-primary">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Jam Tersibuk</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-light text-primary">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-foreground">
            {busiestHour ? busiestHour.hour : '14:00 - 16:00'}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            {busiestHour ? `${busiestHour.count} percakapan` : 'Jam puncak chat pengunjung'}
          </p>
        </Card>
      </div>

      {/* 14-Day Traffic Trend */}
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Tren Trafik Chat & Balasan AI (14 Hari)
          </h3>
          <p className="text-xs text-muted-foreground">
            Volume harian percakapan masuk vs total balasan AI yang diberikan.
          </p>
        </div>
        <TrendChart data={data.trend14Days} />
      </Card>

      {/* Hourly Distribution Bar Chart */}
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-indigo-600" />
            Distribusi Jam Tersibuk (00:00 - 23:00 WIB)
          </h3>
          <p className="text-xs text-muted-foreground">
            Menunjukkan jam berapa pengunjung paling banyak mengirimkan pertanyaan.
          </p>
        </div>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.hourlyDistribution} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="hour" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748B' }} interval={2} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748B' }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="count" name="Jumlah Chat" radius={[4, 4, 0, 0]}>
                {data.hourlyDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.count === maxHourCount && maxHourCount > 0 ? '#4F46E5' : '#CBD5E1'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Unanswered Questions List Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-amber-600" />
              Pertanyaan Belum Terjawab (Handover)
            </h3>
            <p className="text-xs text-muted-foreground">
              Daftar pertanyaan pelanggan yang belum ada di Knowledge Base & memicu handover ke WhatsApp.
            </p>
          </div>
          <Link href="/knowledge">
            <Button size="sm" className="gap-1.5 text-xs shadow-sm">
              <Plus className="h-3.5 w-3.5" />
              Tambah ke Knowledge Base
            </Button>
          </Link>
        </div>

        {data.unansweredQuestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-xl bg-muted/20">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-2" />
            <h4 className="font-bold text-xs text-foreground">Semua Pertanyaan Terjawab!</h4>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Asisten AI berhasil menjawab seluruh pertanyaan pelanggan dari Knowledge Base yang ada.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
            {data.unansweredQuestions.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3.5 gap-3 hover:bg-muted/30 transition-colors"
              >
                <div className="space-y-1">
                  <p className="text-xs font-bold text-foreground">
                    &ldquo;{item.question}&rdquo;
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span>Sesi #{item.session_id.substring(0, 8)}</span>
                    <span>•</span>
                    <span>
                      {new Date(item.timestamp).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
                <Link href={`/knowledge?prefill=${encodeURIComponent(item.question)}`}>
                  <Button variant="outline" size="sm" className="text-[11px] h-7 gap-1 shrink-0">
                    <Plus className="h-3 w-3 text-primary" />
                    Buat FAQ Baru
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
