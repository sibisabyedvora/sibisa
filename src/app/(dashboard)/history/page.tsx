import { getChatHistory } from '@/lib/actions/history';
import { HistoryView } from '@/components/dashboard/history-view';
import { MessageSquare } from 'lucide-react';

export default async function HistoryPage() {
  const conversations = await getChatHistory();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl flex items-center gap-2.5">
          <MessageSquare className="h-7 w-7 text-primary" />
          Riwayat Percakapan
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Pantau seluruh percakapan pengunjung dari widget website, detail balasan AI, dan status handover.
        </p>
      </div>

      <HistoryView initialConversations={conversations} />
    </div>
  );
}
