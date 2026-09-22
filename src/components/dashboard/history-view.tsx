'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  MessageSquare,
  Search,
  CheckCircle2,
  AlertTriangle,
  X,
  User,
  Bot,
} from 'lucide-react';
import { ConversationItem, getConversationDetail, updateConversationStatus, MessageItem } from '@/lib/actions/history';

export function HistoryView({ initialConversations }: { initialConversations: ConversationItem[] }) {
  const [conversations, setConversations] = useState<ConversationItem[]>(initialConversations);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);

  const [detailConv, setDetailConv] = useState<ConversationItem | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Filter conversations
  const filtered = conversations.filter((c) => {
    if (activeFilter !== 'all' && c.status !== activeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchSess = c.session_id.toLowerCase().includes(q);
      const matchMsg = (c.last_message || '').toLowerCase().includes(q);
      return matchSess || matchMsg;
    }
    return true;
  });

  async function openDetail(conv: ConversationItem) {
    setSelectedConvId(conv.id);
    setDetailConv(conv);
    setLoadingDetail(true);

    try {
      const res = await getConversationDetail(conv.id);
      if (res) {
        setMessages(res.messages);
      }
    } catch {
      console.error('Failed to load conversation details');
    } finally {
      setLoadingDetail(false);
    }
  }

  async function handleStatusChange(status: 'open' | 'handover' | 'closed') {
    if (!selectedConvId) return;
    const res = await updateConversationStatus(selectedConvId, status);
    if (res.success) {
      setConversations((prev) =>
        prev.map((c) => (c.id === selectedConvId ? { ...c, status } : c))
      );
      if (detailConv) {
        setDetailConv({ ...detailConv, status });
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 rounded-xl bg-muted p-1 text-xs font-semibold">
          <button
            onClick={() => setActiveFilter('all')}
            className={`rounded-lg px-3 py-1.5 transition-colors ${
              activeFilter === 'all'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Semua ({conversations.length})
          </button>
          <button
            onClick={() => setActiveFilter('open')}
            className={`rounded-lg px-3 py-1.5 transition-colors ${
              activeFilter === 'open'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Terbuka
          </button>
          <button
            onClick={() => setActiveFilter('handover')}
            className={`rounded-lg px-3 py-1.5 transition-colors ${
              activeFilter === 'handover'
                ? 'bg-card text-amber-700 shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Handover WA
          </button>
          <button
            onClick={() => setActiveFilter('closed')}
            className={`rounded-lg px-3 py-1.5 transition-colors ${
              activeFilter === 'closed'
                ? 'bg-card text-emerald-700 shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Selesai
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari sesi atau isi chat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Conversations List Table/Cards */}
        <div className={`${selectedConvId ? 'lg:col-span-6' : 'lg:col-span-12'} space-y-3`}>
          {filtered.length === 0 ? (
            <Card className="flex flex-col items-center justify-center p-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-3">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-foreground text-sm">Belum Ada Riwayat Percakapan</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                Percakapan pengunjung dari widget di website kamu akan muncul di sini.
              </p>
            </Card>
          ) : (
            filtered.map((conv) => (
              <Card
                key={conv.id}
                onClick={() => openDetail(conv)}
                className={`p-4 cursor-pointer transition-all hover:border-primary/50 ${
                  selectedConvId === conv.id ? 'border-primary ring-1 ring-primary bg-primary-light/20' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs">
                      {conv.session_id.substring(0, 6)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-foreground">
                          Sesi #{conv.session_id.substring(0, 8)}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            conv.status === 'handover'
                              ? 'bg-amber-100 text-amber-800'
                              : conv.status === 'closed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}
                        >
                          {conv.status === 'handover'
                            ? 'Handover WA'
                            : conv.status === 'closed'
                            ? 'Selesai'
                            : 'Terbuka'}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {conv.last_message || 'Belum ada pesan'}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0 text-[11px] text-muted-foreground">
                    <span>
                      {new Date(conv.last_message_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="text-[10px] font-semibold bg-muted px-1.5 py-0.5 rounded">
                      {conv.message_count} pesan
                    </span>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Conversation Thread Detail Panel */}
        {selectedConvId && detailConv && (
          <div className="lg:col-span-6 border border-border rounded-2xl bg-card p-5 space-y-4 shadow-sm flex flex-col h-[600px] sticky top-20">
            {/* Header Detail */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-bold text-sm text-foreground">
                  Detail Sesi #{detailConv.session_id.substring(0, 10)}
                </h3>
                <span className="text-[11px] text-muted-foreground">
                  Mulai:{' '}
                  {new Date(detailConv.started_at).toLocaleString('id-ID', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* Status Dropdown */}
                <select
                  value={detailConv.status}
                  onChange={(e) =>
                    handleStatusChange(e.target.value as 'open' | 'handover' | 'closed')
                  }
                  className="text-xs border border-border rounded-lg px-2 py-1 bg-background font-semibold"
                >
                  <option value="open">Terbuka</option>
                  <option value="handover">Handover WA</option>
                  <option value="closed">Selesai</option>
                </select>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={() => setSelectedConvId(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {loadingDetail ? (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                  Memuat percakapan...
                </div>
              ) : messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                  Tidak ada pesan dalam sesi ini.
                </div>
              ) : (
                messages.map((m) => {
                  const isUser = m.role === 'user';
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 text-[10px] text-muted-foreground">
                        {isUser ? (
                          <>
                            <span>Pengunjung</span>
                            <User className="h-3 w-3" />
                          </>
                        ) : (
                          <>
                            <Bot className="h-3 w-3 text-primary" />
                            <span>Asisten AI</span>
                          </>
                        )}
                        <span>•</span>
                        <span>
                          {new Date(m.created_at).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                          isUser
                            ? 'bg-primary text-primary-foreground rounded-tr-none'
                            : 'bg-muted/80 text-foreground rounded-tl-none border border-border'
                        }`}
                      >
                        {m.content}
                      </div>

                      {/* Assistant Metadata Badges */}
                      {!isUser && (
                        <div className="flex items-center gap-1.5 mt-1">
                          {m.answered === true ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="h-3 w-3" /> Dijawab AI
                            </span>
                          ) : m.answered === false ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              <AlertTriangle className="h-3 w-3" /> Handover WA
                            </span>
                          ) : null}

                          {m.lead_intent && m.lead_intent !== 'none' && (
                            <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                              Intent: {m.lead_intent}
                            </span>
                          )}

                          {m.latency_ms && (
                            <span className="text-[9px] text-muted-foreground">
                              {m.latency_ms}ms
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
