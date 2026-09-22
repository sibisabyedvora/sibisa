import { getAnalyticsSummary } from '@/lib/actions/analytics';
import { AnalyticsView } from '@/components/dashboard/analytics-view';
import { BarChart3 } from 'lucide-react';

export default async function AnalyticsPage() {
  const analyticsData = await getAnalyticsSummary();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl flex items-center gap-2.5">
          <BarChart3 className="h-7 w-7 text-primary" />
          Analitik Performa Chatbot
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Pantau tingkat keberhasilan jawaban AI, rasio handover WhatsApp, jam tersibuk, dan pertanyaan yang belum terjawab.
        </p>
      </div>

      <AnalyticsView data={analyticsData} />
    </div>
  );
}
